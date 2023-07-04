import { ObjectId } from "bson";
import prisma from "../../utilities/prisma";

export default async function main() {
  console.log(`start seeding : ${__filename}`);

  await run();

  console.log(`seed finishied : ${__filename}`);
}

async function run() {
  console.log("Insert data");

  let sort = 1;
  let _id = null;

  // Seed menu under app
  _id = new ObjectId().toString();
  await appMenuSeed(_id, sort++);

  // Seed menu under app
  _id = new ObjectId().toString();
  await basicMenuSeed(_id, sort++);

  // monitoring
  _id = new ObjectId().toString();
  await prisma.menu.create({
    data: {
      id: _id,
      parent_menu_id: _id,
      code: "monitoring",
      name: "Monitoring",
      description: "Monitoring",
      icon: "current-location",
      path: "monitoring",
      sort: sort++,
      is_active: true,
    },
  });

  // laporan
  _id = new ObjectId().toString();
  await prisma.menu.create({
    data: {
      id: _id,
      parent_menu_id: _id,
      code: "laporan",
      name: "Laporan",
      description: "Laporan masyarakat",
      icon: "report",
      path: "report",
      sort: sort++,
      is_active: true,
    },
  });
}

async function appMenuSeed(_id: string, sortParent: number) {
  console.log("seeding app");

  let sort = 1;

  const app = await prisma.menu.create({
    data: {
      id: _id,
      parent_menu_id: _id,
      code: "app",
      name: "Application",
      description: "Application",
      icon: "app-window",
      path: null,
      sort: sortParent,
      is_active: true,
    },
  });

  const menu = await prisma.menu.create({
    data: {
      id: new ObjectId().toString(),
      parent_menu_id: app.id,
      code: "menu",
      name: "Menus",
      description: "Menu",
      icon: "app-window",
      path: "app/menu",
      sort: sort++,
      is_active: true,
    },
  });

  const role = await prisma.menu.create({
    data: {
      id: new ObjectId().toString(),
      parent_menu_id: app.id,
      code: "role",
      name: "Roles",
      description: "Roles",
      icon: "users-group",
      path: "app/role",
      sort: sort++,
      is_active: true,
    },
  });

  const roleMenu = await prisma.menu.create({
    data: {
      id: new ObjectId().toString(),
      parent_menu_id: app.id,
      code: "rolemenu",
      name: "Role Menus",
      description: "Role Menus",
      icon: "users-shield",
      path: "app/role-menus",
      sort: sort++,
      is_active: true,
    },
  });

  const user = await prisma.menu.create({
    data: {
      id: new ObjectId().toString(),
      parent_menu_id: app.id,
      code: "user",
      name: "Users",
      description: "Users",
      icon: "users",
      path: "app/user",
      sort: sort++,
      is_active: true,
    },
  });
}

async function basicMenuSeed(_id: string, sortParent: number) {
  console.log("seeding basic");

  let sort = 1;

  const basic = await prisma.menu.create({
    data: {
      id: _id,
      parent_menu_id: _id,
      code: "basic",
      name: "Basic",
      description: "Basic",
      icon: "category",
      path: null,
      sort: sortParent,
      is_active: true,
    },
  });

  const category = await prisma.menu.create({
    data: {
      id: new ObjectId().toString(),
      parent_menu_id: basic.id,
      code: "kategori",
      name: "Kategori",
      description: "Kategori",
      icon: "point",
      path: "basic/category",
      sort: sort++,
      is_active: true,
    },
  });
}
