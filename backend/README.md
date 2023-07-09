# What is this?

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
pnpm init
pnpm dlx typescript --init
```

# How to start

```
pnpm add fastify @fastify/jwt @fastify/sensible fastify-zod zod zod-to-json-schema bcrypt bson
pnpm add ts-node-dev typescript @types/node -D
pnpm add typescript ts-node @types/node -D
pnpm add @types/bcrypt -D

```

## Prisma Init

- install prisma client

  ```
  pnpm add @prisma/client
  pnpm add ts-node-dev typescript @types/node -D
  ```
- create schema with mongodb provider

  ```
  pnpm dlx prisma init --datasource-provider mongodb
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
  pnpm dlx prisma migrate dev --name init

  No need to run migrate command according to this link :
  https://www.prisma.io/docs/concepts/database-connectors/mongodb
  https://www.youtube.com/watch?v=b4nxOv91vWI&ab_channel=Prisma
  ```
- Run this command everytime you make changes in any schema :

  ```
  pnpm dlx prisma generate
  or
  pnpm dlx prisma db push
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
