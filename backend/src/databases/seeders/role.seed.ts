import prisma from "../../utilities/prisma";

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  const data = await prisma.role.createMany({
    data: [
      { code: "dev", name: "Developer" },
      { code: "administrator", name: "Administrator" },
      { code: "operator", name: "Operator" },
    ],
  });

  console.log(data);
}
