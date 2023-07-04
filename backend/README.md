# Backend

backend for patroli

# What are we using?

- Fastify - Web framework
- Prisma - Database ORM
- Zod - Request and response validation
- Swagger - API docs
- Typescript - Types
- MongoDB - Database
- rethinkDB - realtime database
- socket.io - realtime communication

# How to create project?

```
yarn init
npx typescript --init
```

# How to start

```
yarn add fastify @fastify/jwt @fastify/sensible fastify-zod zod zod-to-json-schema bcrypt bson
yarn add ts-node-dev typescript @types/node --dev
yarn add @types/bcrypt --dev

```

## Prisma Init

- install prisma client

  ```
  yarn add @prisma/client
  yarn add ts-node-dev typescript @types/node --dev
  ```
- create schema with mongodb provider

  ```
  npx prisma init --datasource-provider mongodb
  ```
- Change file `.env` DATABASE_URL according to your mongodb setting
- Move prisma folder inside databases folder
- Edit package.json and add

  ```
  "prisma": {
    "schema": "src/databases/prisma/schema.prisma"
  }
  ```
- Create your models
- Migrate the schema

  ```
  npx prisma migrate dev --name init

  No need to run migrate command according to this link :
  https://www.prisma.io/docs/concepts/database-connectors/mongodb
  https://www.youtube.com/watch?v=b4nxOv91vWI&ab_channel=Prisma
  ```
- Run this command everytime you make changes in any schema :

  ```
  npx prisma generate
  or
  npx prisma db push
  ```
- Prisma docs :

  ```
  https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#transaction
  https://www.prisma.io/docs/concepts/components/prisma-client/transactions
  ```
- If you already update schema but cannot insert/update your data, stop your server/fastify and run `npx prisma generate` then run again your server.

## Prisma Seed

- Create file in folder src/seeders
- Import and call seed in src/databases/prisma/seed.ts
- Run command seed with

  ```
  npx prisma db seed
  ```
- Set `truncateFirst` to `true` in `seed.ts` file to delete data first before seed.
