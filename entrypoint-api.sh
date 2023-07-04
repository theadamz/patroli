#!/bin/sh

# info file
echo "eksekusi file: entrypoint-api.sh";

# test arguments
echo "test arguments from Dockerfile-api:";
echo "WORKDIR=$WORKDIR";
echo "API_PORT_EXPOSE=$API_PORT_EXPOSE";

# ganti direktori
echo "pindah direktori";
cd $WORKDIR;
echo "pwd=$(pwd)";

# list files
ls -l -a;

# info
echo "npm version: $(npm -v)";
echo "yarn version: $(yarn -v)";

# install dependencies
# yarn;
yarn install --frozen-lockfile;
# yarn add ts-node-dev typescript @types/node --dev;

# jalankan prisma
echo "running prisma commands:";
# npx prisma generate;
# npx prisma db push;
# npx prisma db seed;

# jalankan server
# yarn dev;
yarn dev-docker;