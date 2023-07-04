#!/bin/sh

# info file
echo "eksekusi file: entrypoint-mongodb.sh";

# replication
echo "execute replication";
# we take over the default & start mongo in replica set mode in a background task
mongod --port $MONGO_PORT --replSet rs0 --bind_ip 0.0.0.0 & MONGOD_PID=$!;
# we prepare the replica set with a single node and prepare the root user config
INIT_REPL_CMD="rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_HOST:$MONGO_PORT' }] })";
INIT_USER_CMD="db.getUser('$MONGO_INITDB_ROOT_USERNAME') || db.createUser({ user: '$MONGO_INITDB_ROOT_USERNAME', pwd: '$MONGO_INITDB_ROOT_PASSWORD', roles: [ 'root' ] })";
# we wait for the replica set to be ready and then submit the commands just above
until (mongo admin --port $MONGO_PORT --eval "$INIT_REPL_CMD && $INIT_USER_CMD"); do sleep 1; done;
# we are done but we keep the container by waiting on signals from the mongo task
echo "REPLICA SET ONLINE"; wait $MONGOD_PID;