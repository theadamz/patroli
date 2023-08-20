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

# How to use?

* Make sure you have node js and pnpm installed.
* Go to backend directory folder and open your terminal (use bash or something similar if you use windows).
* Install dependencies

  ```
  pnpm install
  ```
* Run server with :

  ```
  pnpm dev
  ```
* Build script use this command :

  ```
  pnpm build // will create dist folder
  ```
* a

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
  npx prisma migrate dev --name init

  No need to run migrate command according to this link :
  https://www.prisma.io/docs/concepts/database-connectors/mongodb
  https://www.youtube.com/watch?v=b4nxOv91vWI&ab_channel=Prisma
  ```
- Run this command everytime you make changes in any schema :

  ```
  npx prisma generate // to generate client
  or
  npx prisma db push // to update type safe, index, etc
  ```
- Prisma docs :

  ```
  https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#transaction
  https://www.prisma.io/docs/concepts/components/prisma-client/transactions
  ```

## Prisma Seed

- Create file in folder src/databases/seeders
- Import and call seed in src/databases/prisma/seed.ts
- Run command seed with

  ```
  npx prisma db seed
  ```
- Set `truncateFirst` to `true` in `seed.ts` file to delete data first before seed.
