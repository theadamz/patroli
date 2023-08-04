import prisma from "../../utilities/prisma";

const menus = [
  {
    code: "menu",
    name: "Menu",
    description: "Pengelolaan Menu",
    is_active: true,
  },
  {
    code: "role",
    name: "Grup Pengguna",
    description: "Pengelolaan grup pengguna",
    is_active: true,
  },
  {
    code: "rolemenu",
    name: "Akses Pengguna",
    description: "Pengelolaan menu akses berdasarkan grup pengguna",
    is_active: true,
  },
  {
    code: "user",
    name: "Pengguna",
    description: "Pengelolaan pengguna yang mengakses sistem",
    is_active: true,
  },
  {
    code: "officer",
    name: "Petugas",
    description: "Pengelolaan petugas",
    is_active: true,
  },
  {
    code: "officer-team",
    name: "Tim Petugas",
    description: "Pengelolaan tim petugas",
    is_active: true,
  },
  {
    code: "monitoring-officer",
    name: "Monitoring Petugas",
    description: "Pengelolaan monitoring petugas",
    is_active: true,
  },
  {
    code: "citizen",
    name: "Warga",
    description: "Pengelolaan warga yang menggunakan sistem",
    is_active: true,
  },
  {
    code: "complaint-category",
    name: "Kategori Keluhan",
    description: "Pengelolaan kategori keluhan warga",
    is_active: true,
  },
  {
    code: "complaint",
    name: "Keluhan Warga",
    description:
      "Pengelolaan keluhan warga yang diinput oleh warga atau operator",
    is_active: true,
  },
  {
    code: "report",
    name: "Laporan",
    description: "Laporan",
    is_active: true,
  },
];

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  const transaction = await prisma.$transaction(async (tx) => {
    for (const menu of menus) {
      // create menu
      await tx.menu.create({
        data: {
          code: menu.code,
          name: menu.name,
          description: menu.description,
          is_active: menu.is_active,
          created_by: null,
        },
      });
    }
  });

  console.log(transaction);
}
