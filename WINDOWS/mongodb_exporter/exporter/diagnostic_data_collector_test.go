// mongodb_exporter
// Copyright (C) 2017 Percona LLC
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

package exporter

import (
	"context"
	"fmt"
	"io/ioutil"
	"sort"
	"strings"
	"testing"
	"time"

	"github.com/percona/exporter_shared/helpers"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/testutil"
	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/percona/mongodb_exporter/internal/tu"
)

func TestDiagnosticDataCollector(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	client := tu.DefaultTestClient(ctx, t)
	logger := logrus.New()
	ti := labelsGetterMock{}

	c := &diagnosticDataCollector{
		client:       client,
		logger:       logger,
		topologyInfo: ti,
	}

	// The last \n at the end of this string is important
	expected := strings.NewReader(`
# HELP mongodb_oplog_stats_ok local.oplog.rs.stats.
# TYPE mongodb_oplog_stats_ok untyped
mongodb_oplog_stats_ok 1
# HELP mongodb_oplog_stats_wt_btree_fixed_record_size local.oplog.rs.stats.wiredTiger.btree.
# TYPE mongodb_oplog_stats_wt_btree_fixed_record_size untyped
mongodb_oplog_stats_wt_btree_fixed_record_size 0
# HELP mongodb_oplog_stats_wt_transaction_update_conflicts local.oplog.rs.stats.wiredTiger.transaction.
# TYPE mongodb_oplog_stats_wt_transaction_update_conflicts untyped
mongodb_oplog_stats_wt_transaction_update_conflicts 0` + "\n")
	// Filter metrics for 2 reasons:
	// 1. The result is huge
	// 2. We need to check against know values. Don't use metrics that return counters like uptime
	//    or counters like the number of transactions because they won't return a known value to compare
	filter := []string{
		"mongodb_oplog_stats_ok",
		"mongodb_oplog_stats_wt_btree_fixed_record_size",
		"mongodb_oplog_stats_wt_transaction_update_conflicts",
	}
	// TODO: use NewPedanticRegistry when mongodb_exporter code fulfils its requirements (https://jira.percona.com/browse/PMM-6630).
	reg := prometheus.NewRegistry()
	err := reg.Register(c)
	require.NoError(t, err)
	err = testutil.GatherAndCompare(reg, expected, filter...)
	assert.NoError(t, err)
}

func TestAllDiagnosticDataCollectorMetrics(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	client := tu.DefaultTestClient(ctx, t)

	ti, err := newTopologyInfo(ctx, client)
	require.NoError(t, err)

	c := &diagnosticDataCollector{
		client:         client,
		logger:         logrus.New(),
		compatibleMode: true,
		topologyInfo:   ti,
	}

	metrics := helpers.CollectMetrics(c)
	actualMetrics := helpers.ReadMetrics(metrics)
	filters := []string{
		"mongodb_mongod_metrics_cursor_open",
		"mongodb_mongod_metrics_get_last_error_wtimeouts_total",
		"mongodb_mongod_wiredtiger_cache_bytes",
		"mongodb_mongod_wiredtiger_transactions_total",
		"mongodb_mongod_wiredtiger_cache_bytes_total",
		"mongodb_op_counters_total",
		"mongodb_ss_mem_resident",
		"mongodb_ss_mem_virtual",
		"mongodb_ss_metrics_cursor_open",
		"mongodb_ss_metrics_getLastError_wtime_totalMillis",
		"mongodb_ss_opcounters",
		"mongodb_ss_opcountersRepl",
		"mongodb_ss_wt_cache_maximum_bytes_configured",
		"mongodb_ss_wt_cache_modified_pages_evicted",
	}
	actualMetrics = filterMetrics(actualMetrics, filters)
	actualLines := helpers.Format(helpers.WriteMetrics(actualMetrics))
	metricNames := getMetricNames(actualLines)

	sort.Strings(filters)
	for _, want := range filters {
		assert.True(t, metricNames[want], fmt.Sprintf("missing %q metric", want))
	}
}

func TestContextTimeout(t *testing.T) {
	ctx := context.Background()

	client := tu.DefaultTestClient(ctx, t)

	ti, err := newTopologyInfo(ctx, client)
	require.NoError(t, err)

	dbCount := 100

	err = addTestData(ctx, client, dbCount)
	assert.NoError(t, err)

	defer cleanTestData(ctx, client, dbCount) //nolint:errcheck

	cctx, ccancel := context.WithCancel(context.Background())
	ccancel()

	c := &diagnosticDataCollector{
		client:         client,
		logger:         logrus.New(),
		compatibleMode: true,
		topologyInfo:   ti,
		ctx:            cctx,
	}
	// it should not panic
	helpers.CollectMetrics(c)
}

func addTestData(ctx context.Context, client *mongo.Client, count int) error {
	session, err := client.StartSession()
	if err != nil {
		return errors.Wrap(err, "cannot create session to add test data")
	}

	if err := session.StartTransaction(); err != nil {
		return errors.Wrap(err, "cannot start session to add test data")
	}

	if err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {
		ctx, cancel := context.WithCancel(ctx)
		defer cancel()

		for i := 0; i < count; i++ {
			dbName := fmt.Sprintf("testdb_%06d", i)
			doc := bson.D{{Key: "field1", Value: "value 1"}}
			_, err := client.Database(dbName).Collection("test_col").InsertOne(ctx, doc)
			if err != nil {
				return errors.Wrap(err, "cannot add test data")
			}
		}

		if err = session.CommitTransaction(ctx); err != nil {
			return errors.Wrap(err, "cannot commit add test data transaction")
		}

		return nil
	}); err != nil {
		return errors.Wrap(err, "cannot add data inside a session")
	}

	session.EndSession(ctx)

	return nil
}

func cleanTestData(ctx context.Context, client *mongo.Client, count int) error {
	session, err := client.StartSession()
	if err != nil {
		return errors.Wrap(err, "cannot create session to add test data")
	}

	if err := session.StartTransaction(); err != nil {
		return errors.Wrap(err, "cannot start session to add test data")
	}

	if err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {
		for i := 0; i < count; i++ {
			dbName := fmt.Sprintf("testdb_%06d", i)
			client.Database(dbName).Drop(ctx) //nolint:errcheck
		}

		if err = session.CommitTransaction(sc); err != nil {
			return errors.Wrap(err, "cannot commit add test data transaction")
		}

		return nil
	}); err != nil {
		return errors.Wrap(err, "cannot add data inside a session")
	}

	session.EndSession(ctx)

	return nil
}

func TestDisconnectedDiagnosticDataCollector(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	client := tu.DefaultTestClient(ctx, t)
	err := client.Disconnect(ctx)
	assert.NoError(t, err)

	logger := logrus.New()
	logger.Out = ioutil.Discard // diable logs in tests

	ti := labelsGetterMock{}

	c := &diagnosticDataCollector{
		client:         client,
		logger:         logger,
		topologyInfo:   ti,
		compatibleMode: true,
	}

	// The last \n at the end of this string is important
	expected := strings.NewReader(`
# HELP mongodb_mongod_replset_my_state An integer between 0 and 10 that represents the replica state of the current member
# TYPE mongodb_mongod_replset_my_state gauge
mongodb_mongod_replset_my_state{set=""} 6
# HELP mongodb_mongod_storage_engine The storage engine used by the MongoDB instance
# TYPE mongodb_mongod_storage_engine gauge
mongodb_mongod_storage_engine{engine="Engine is unavailable"} 1
# HELP mongodb_version_info The server version
# TYPE mongodb_version_info gauge
mongodb_version_info{mongodb="server version is unavailable"} 1
` + "\n")
	// Filter metrics for 2 reasons:
	// 1. The result is huge
	// 2. We need to check against know values. Don't use metrics that return counters like uptime
	//    or counters like the number of transactions because they won't return a known value to compare
	filter := []string{
		"mongodb_mongod_replset_my_state",
		"mongodb_mongod_storage_engine",
		"mongodb_version_info",
	}

	reg := prometheus.NewRegistry()
	err = reg.Register(c)
	require.NoError(t, err)
	err = testutil.GatherAndCompare(reg, expected, filter...)
	assert.NoError(t, err)
}
