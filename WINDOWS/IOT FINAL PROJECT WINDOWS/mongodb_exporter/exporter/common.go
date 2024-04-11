package exporter

import (
	"context"
	"sort"
	"strings"

	"github.com/AlekSi/pointer"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var systemDBs = []string{"admin", "config", "local"} //nolint:gochecknoglobals

func listCollections(ctx context.Context, client *mongo.Client, database string, filterInNamespaces []string) ([]string, error) {
	filter := bson.D{} // Default=empty -> list all collections

	// if there is a filter with the list of collections we want, create a filter like
	// $or: {
	//     {"$regex": "collection1"},
	//     {"$regex": "collection2"},
	// }
	if len(filterInNamespaces) > 0 {
		matchExpressions := []bson.D{}

		for _, namespace := range filterInNamespaces {
			parts := strings.Split(namespace, ".") // db.collection.name.with.dots
			if len(parts) > 1 {
				// The part before the first dot is the database name.
				// The rest is the collection name and it can have dots. We need to rebuild it.
				collection := strings.Join(parts[1:], ".")
				matchExpressions = append(matchExpressions,
					bson.D{{Key: "name", Value: primitive.Regex{Pattern: collection, Options: "i"}}})
			}
		}

		if len(matchExpressions) > 0 {
			filter = bson.D{{Key: "$or", Value: matchExpressions}}
		}
	}

	collections, err := client.Database(database).ListCollectionNames(ctx, filter)
	if err != nil {
		return nil, errors.Wrap(err, "cannot get the list of collections for discovery")
	}

	return collections, nil
}

// databases returns the list of databases matching the filters.
// - filterInNamespaces: Include only the database names matching the any of the regular expressions in this list.
//                       Case will be ignored because the function will automatically add the ignore case
//                       flag to the regular expression.
// - exclude: List of databases to be excluded. Useful to ignore system databases.
func databases(ctx context.Context, client *mongo.Client, filterInNamespaces []string, exclude []string) ([]string, error) {
	opts := &options.ListDatabasesOptions{NameOnly: pointer.ToBool(true), AuthorizedDatabases: pointer.ToBool(true)}

	filter := bson.D{}

	if excludeFilter := makeExcludeFilter(exclude); excludeFilter != nil {
		filter = append(filter, *excludeFilter)
	}

	if namespacesFilter := makeDBsFilter(filterInNamespaces); namespacesFilter != nil {
		filter = append(filter, *namespacesFilter)
	}

	dbNames, err := client.ListDatabaseNames(ctx, filter, opts)
	if err != nil {
		return nil, errors.Wrap(err, "cannot get the database names list")
	}

	return dbNames, nil
}

func makeExcludeFilter(exclude []string) *primitive.E {
	filterExpressions := []bson.D{}
	for _, dbname := range exclude {
		filterExpressions = append(filterExpressions,
			bson.D{{Key: "name", Value: bson.D{{Key: "$ne", Value: dbname}}}},
		)
	}

	if len(filterExpressions) == 0 {
		return nil
	}

	return &primitive.E{Key: "$and", Value: filterExpressions}
}

// makeDBsFilter creates a filter to list all databases or only the ones in the specified
// namespaces list. Namespaces have the form of <db>.<collection> and the collection name
// can have a dot. Example: db1.collection.one -> db: db1, collection: collection.one
// db1, db2.col2, db3.col.one will produce [db1, db2, db3].
func makeDBsFilter(filterInNamespaces []string) *primitive.E {
	dbs := []string{}
	if len(dbs) == 0 {
		return nil
	}

	for _, namespace := range filterInNamespaces {
		parts := strings.Split(namespace, ".")
		dbs = append(dbs, parts[0])
	}

	return &primitive.E{Key: "name", Value: primitive.E{Key: "$in", Value: dbs}}
}

func listAllCollections(ctx context.Context, client *mongo.Client, filterInNamespaces []string, excludeDBs []string) (map[string][]string, error) {
	namespaces := make(map[string][]string)

	for _, namespace := range filterInNamespaces {
		parts := strings.Split(namespace, ".")
		dbname := parts[0]

		colls, err := listCollections(ctx, client, dbname, []string{namespace})
		if err != nil {
			return nil, errors.Wrapf(err, "cannot list the collections for %q", dbname)
		}

		if _, ok := namespaces[dbname]; !ok {
			namespaces[dbname] = colls
		} else {
			namespaces[dbname] = append(namespaces[dbname], colls...)
		}
		sort.Strings(namespaces[dbname]) // make it testeable.
	}

	return namespaces, nil
}

func nonSystemCollectionsCount(ctx context.Context, client *mongo.Client, includeNamespaces []string, filterInCollections []string) (int, error) {
	databases, err := databases(ctx, client, includeNamespaces, systemDBs)
	if err != nil {
		return 0, errors.Wrap(err, "cannot retrieve the collection names for count collections")
	}

	var count int

	for _, dbname := range databases {
		colls, err := listCollections(ctx, client, dbname, filterInCollections)
		if err != nil {
			return 0, errors.Wrap(err, "cannot get collections count")
		}
		count += len(colls)
	}

	return count, nil
}
