import prisma from "../../utilities/prisma";

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  // Seed role menu for role dev dan administrator
  const roles = await prisma.role.findMany({
    where: { code: { in: ["dev", "administrator"] } },
  });

  const menus = await prisma.menu.findMany({
    select: {
      id: true,
    },
  });

  // Loop roles
  roles.forEach(async function (role) {
    // Loop menus
    menus.forEach(async function (menu) {
      // Create role_menu
      await prisma.role_menu.create({
        data: {
          role_id: role.id,
          menu_id: menu.id,
          allow_create: true,
          allow_edit: true,
          allow_delete: true,
        },
      }); // ./role_menu
    }); // ./menus
  }); // ./roles

  // Seed role menu for role operator
  const roleOperator = await prisma.role.findFirst({
    where: { code: "operator" },
  });

  const appMenuId = (
    await prisma.menu.findFirst({
      where: { code: "app" },
      select: { id: true },
    })
  )?.id;

  const menuOperator = await prisma.menu.findMany({
    select: {
      id: true,
    },
    where: {
      parent_menu_id: {
        notIn: appMenuId,
      },
    },
  });

  menuOperator.forEach(async function (menu) {
    // Create role_menu
    await prisma.role_menu.create({
      data: {
        role_id: roleOperator?.id,
        menu_id: menu.id,
        allow_create: true,
        allow_edit: true,
        allow_delete: true,
      },
    }); // ./role_menu
  });
}
