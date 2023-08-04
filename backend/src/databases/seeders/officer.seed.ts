import { ObjectId } from "bson";
import { hashPassword } from "../../utilities/hashPassword";
import prisma from "../../utilities/prisma";

const data = [
  {
    code: "000001",
    name: "Briptu Adam",
    phone_no: "+62811000001",
    email: "000001@email.com",
    photo_file: null,
    rating: 0,
  },
  {
    code: "000002",
    name: "Kapten Malik",
    phone_no: "+62811000002",
    email: "000002@email.com",
    photo_file: null,
    rating: 1.5,
  },
  {
    code: "000003",
    name: "Kolonel Dina",
    phone_no: "+62811000003",
    email: "000003@email.com",
    photo_file: null,
    rating: 2.3,
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
  const role = await prisma.role.findUnique({ where: { code: "officer" } });

  for (const item of data) {
    const transaction = await prisma.$transaction(async (tx) => {
      // create user
      const user = await tx.user.create({
        data: {
          email: item.email,
          name: item.name,
          password: await hashPassword("123456"),
          role_id: role?.id,
          actor: "officer",
          is_active: true,
          public_id: new ObjectId().toString(),
          created_by: null,
        },
      });

      // create officer
      const officer = await tx.officer.create({
        data: {
          user_id: user.id,
          code: item.code,
          name: item.name,
          phone_no: item.phone_no,
          email: item.email,
          photo_file: item.photo_file,
          rating: item.rating,
        },
      });

      return officer;
    });

    console.log(transaction);
  }
}
