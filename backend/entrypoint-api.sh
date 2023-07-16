#!/bin/sh

# info file
echo "execute file: entrypoint-api.sh";

# test arguments
echo "test arguments from Dockerfile-api:";
echo "WORKDIR=$WORKDIR";
echo "API_PORT_EXPOSE=$API_PORT_EXPOSE";
echo "NODE_ENV=$NODE_ENV";

# info
echo "npm version: $(npm -v)";
echo "pnpm version: $(pnpm -v)";

# list files
echo "list files:";
cd $WORKDIR; # change dir
echo "directory=$(pwd)";
ls -l -a;

# run prisma command
echo "running prisma commands:";
# npx prisma generate;
npx prisma db push;
# npx prisma db seed;

# run server
pnpm run dev;