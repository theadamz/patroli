import prisma from "../../utilities/prisma";

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  // Ambil officers
  const officers = await prisma.officer.findMany({
    where: {
      is_active: true,
    },
    select: {
      id: true,
    },
  });

  const ids = officers.map((item) => item.id);

  const data = await prisma.officer_team.create({
    data: {
      code: "JAGUAR",
      name: "JAGUAR",
      officer_ids: ids,
      leader_officer_id: ids[0],
    },
  });

  console.log(data);
}
