import { ObjectId } from "bson";
import { hashPassword } from "../../utilities/hashPassword";
import prisma from "../../utilities/prisma";

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  // Ambil role id
  const devRole = await prisma.role.findUnique({ where: { code: "dev" } });
  const administratorRole = await prisma.role.findUnique({
    where: { code: "administrator" },
  });
  const operatorRole = await prisma.role.findUnique({
    where: { code: "operator" },
  });

  const data = await prisma.user.createMany({
    data: [
      {
        email: "theadamz91@gmail.com",
        name: "Developer",
        password: await hashPassword("123456"),
        role_id: devRole?.id,
        actor: "operator",
        is_active: true,
        public_id: new ObjectId().toString(),
        created_by: null,
      },
      {
        email: "adiena14@gmail.com",
        name: "Administrator",
        password: await hashPassword("123456"),
        role_id: administratorRole?.id,
        actor: "operator",
        is_active: true,
        public_id: new ObjectId().toString(),
        created_by: null,
      },
      {
        email: "operator@email.com",
        name: "Operator",
        password: await hashPassword("123456"),
        role_id: operatorRole?.id,
        actor: "operator",
        is_active: true,
        public_id: new ObjectId().toString(),
        created_by: null,
      },
    ],
  });

  console.log(data);
}
