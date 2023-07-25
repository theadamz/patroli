import prisma from "../../utilities/prisma";

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  const data = await prisma.complain_category.createMany({
    data: [
      { name: "Gangguan", is_visible: true },
      { name: "Pencurian", is_visible: true },
      { name: "Daerah Rawan", is_visible: true },
      { name: "Lainnya", is_visible: true },
    ],
  });

  console.log(data);
}
