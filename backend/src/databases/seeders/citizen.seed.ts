import { ObjectId } from "bson";
import { hashPassword } from "../../utilities/hashPassword";
import prisma from "../../utilities/prisma";

const data = [
  {
    id_card_number: "1234567890000001",
    name: "John Doe",
    phone_no: "+62822000001",
    email: "citizen1@email.com",
  },
  {
    id_card_number: "1234567890000002",
    name: "Michael Smith",
    phone_no: "+62822000002",
    email: "citizen2@email.com",
  },
  {
    id_card_number: "1234567890000003",
    name: "Adam",
    phone_no: "+62822000003",
    email: "citizen3@email.com",
  },
];

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  // Ambil role id
  const role = await prisma.role.findUnique({ where: { code: "citizen" } });

  // Loop data
  for (const item of data) {
    const transaction = await prisma.$transaction(async (tx) => {
      // create user
      const user = await tx.user.create({
        data: {
          email: item.email,
          name: item.name,
          password: await hashPassword("123456"),
          role_id: role!.id,
          actor: "citizen",
          is_active: true,
          public_id: new ObjectId().toString(),
          created_by: null,
        },
      });

      // create citizen
      const citizen = await tx.citizen.create({
        data: {
          user_id: user.id,
          id_card_number: item.id_card_number,
          name: item.name,
          phone_no: item.phone_no,
          email: item.email,
        },
      });

      return citizen;
    });

    console.log(transaction);
  }
}
