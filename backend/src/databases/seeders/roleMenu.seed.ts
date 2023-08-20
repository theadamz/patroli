import prisma from "../../utilities/prisma";

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  // menu for role dev and administrator
  await menuRoleDevAdministrator();

  // menu for role operator
  await menuRoleOperator();

  // menu for role citizen
  await menuRoleCitizen();

  // menu for role citizen
  await menuRoleOfficer();
}

async function menuRoleDevAdministrator() {
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
  for (const role of roles) {
    console.log(`Insert menu for role ${role.name}`);
    // Loop menus
    for (const menu of menus) {
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
    } // ./menus
  } // ./roles
}

async function menuRoleOperator() {
  // Seed role menu for role operator
  const roleOperator = await prisma.role.findFirst({
    where: { code: "operator" },
  });

  const excludeMenus = await prisma.menu.findMany({
    where: {
      code: {
        in: ["menu", "role", "rolemenu"],
      },
    },
  });

  const excludeMenuIds = excludeMenus.map((item) => item.id); // get id only

  const menuOperator = await prisma.menu.findMany({
    select: {
      id: true,
    },
    where: {
      id: {
        notIn: excludeMenuIds,
      },
    },
  });

  console.log(`Insert menu for role ${roleOperator?.name}`);
  for (const menu of menuOperator) {
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
  }
}

async function menuRoleCitizen() {
  const role = await prisma.role.findFirst({
    where: { code: "citizen" },
  });

  // role menu complaint
  const complaintCategory = await prisma.menu.findFirst({
    where: {
      code: {
        in: ["complaint-category"],
      },
    },
  });

  await prisma.role_menu.create({
    data: {
      role_id: role!.id,
      menu_id: complaintCategory!.id,
      allow_create: false,
      allow_edit: false,
      allow_delete: false,
    },
  });

  // role menu complaint
  const complaint = await prisma.menu.findFirst({
    where: {
      code: {
        in: ["complaint"],
      },
    },
  });

  await prisma.role_menu.create({
    data: {
      role_id: role!.id,
      menu_id: complaint!.id,
      allow_create: true,
      allow_edit: true,
      allow_delete: true,
    },
  });
}

async function menuRoleOfficer() {
  const role = await prisma.role.findFirst({
    where: { code: "officer" },
  });

  console.log(`Insert menu for role ${role?.name}`);

  // role menu complaint
  const complaintCategory = await prisma.menu.findFirst({
    where: {
      code: {
        in: ["complaint-category"],
      },
    },
  });

  await prisma.role_menu.create({
    data: {
      role_id: role!.id,
      menu_id: complaintCategory!.id,
      allow_create: false,
      allow_edit: false,
      allow_delete: false,
    },
  });

  // role menu complaint
  const complaint = await prisma.menu.findFirst({
    where: {
      code: {
        in: ["complaint"],
      },
    },
  });

  await prisma.role_menu.create({
    data: {
      role_id: role!.id,
      menu_id: complaint!.id,
      allow_create: true,
      allow_edit: true,
      allow_delete: true,
    },
  });
}
