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

// Package tu has Test Util functions
package tu

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"

	"github.com/pkg/errors"
	"github.com/stretchr/testify/require"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	// MongosPort MongoDB mongos Port.
	MongosPort = "17000"
	// MongoDBS1PrimaryPort MongoDB Shard 1 Primary Port.
	MongoDBS1PrimaryPort = "17001"
	// MongoDBS1Secondary1Port MongoDB Shard 1 Secondary 1 Port.
	MongoDBS1Secondary1Port = "17002"
	// MongoDBS1Secondary2Port MongoDB Shard 1 Secondary 2 Port.
	MongoDBS1Secondary2Port = "17003"
	// MongoDBStandAlonePort MongoDB stand alone instance Port.
	MongoDBStandAlonePort = "27017"
	// MongoDBConfigServer1Port MongoDB config server primary Port.
	MongoDBConfigServer1Port = "17009"
)

// GetenvDefault gets a variable from the environment and returns its value or the
// spacified default if the variable is empty.
func GetenvDefault(key, defaultValue string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}

	return defaultValue
}

// DefaultTestClient returns the default MongoDB connection used for tests. It is a direct
// connection to the primary server of replicaset 1.
func DefaultTestClient(ctx context.Context, t *testing.T) *mongo.Client {
	port, err := PortForContainer("mongo-1-1")
	require.NoError(t, err)
	return TestClient(ctx, port, t)
}

// TestClient returns a new MongoDB connection to the specified server port.
func TestClient(ctx context.Context, port string, t *testing.T) *mongo.Client {
	if port == "" {
		port = MongoDBS1PrimaryPort
	}

	hostname := "127.0.0.1"
	direct := true
	to := time.Second
	co := &options.ClientOptions{
		ConnectTimeout: &to,
		Hosts:          []string{net.JoinHostPort(hostname, port)},
		Direct:         &direct,
	}

	client, err := mongo.Connect(ctx, co)
	require.NoError(t, err)

	t.Cleanup(func() {
		// In some tests we manually disconnect the client so, don't check
		// for errors, the client might be already disconnected.
		client.Disconnect(ctx) //nolint:errcheck
	})

	err = client.Ping(ctx, nil)
	require.NoError(t, err)

	return client
}

// LoadJSON loads a file and returns the result of unmarshaling it into a bson.M structure.
func LoadJSON(filename string) (bson.M, error) {
	buf, err := ioutil.ReadFile(filepath.Clean(filename))
	if err != nil {
		return nil, err
	}

	var m bson.M
	err = json.Unmarshal(buf, &m)
	if err != nil {
		return nil, err
	}

	return m, nil
}

func InspectContainer(name string) (DockerInspectOutput, error) {
	var di DockerInspectOutput

	out, err := exec.Command("docker", "inspect", name).Output() //nolint:gosec
	if err != nil {
		return di, errors.Wrap(err, "cannot inspect docker container")
	}

	if err := json.Unmarshal(out, &di); err != nil {
		return di, errors.Wrap(err, "cannot inspect docker container")
	}

	return di, nil
}

func PortForContainer(name string) (string, error) {
	di, err := InspectContainer(name)
	if err != nil {
		return "", errors.Wrapf(err, "cannot get error for container %q", name)
	}

	if len(di) == 0 {
		return "", errors.Wrapf(err, "cannot get error for container %q (empty array)", name)
	}

	ports := di[0].NetworkSettings.Ports["27017/tcp"]
	if len(ports) == 0 {
		return "", errors.Wrapf(err, "cannot get error for container %q (empty ports list)", name)
	}

	return ports[0].HostPort, nil
}
