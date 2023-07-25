import prisma from "../../utilities/prisma";
import RoleSeed from "../seeders/role.seed";
import UserSeed from "../seeders/user.seed";
import MenuSeed from "../seeders/menu.seed";
import RoleMenuSeed from "../seeders/roleMenu.seed";
import OfficerSeed from "../seeders/officer.seed";
import CitizenSeed from "../seeders/citizen.seed";
import CategorySeed from "../seeders/category.seed";

const truncateFirst = true;

async function main() {
  if (truncateFirst) await clearDataCollections();

  // Seed data
  await RoleSeed();
  await UserSeed();
  await MenuSeed();
  await RoleMenuSeed();
  await OfficerSeed();
  await CitizenSeed();
  await CategorySeed();
}

async function clearDataCollections() {
  console.log("start clear data collections");

  // Run raw command
  const result: any = await prisma.$runCommandRaw({
    listCollections: 1,
    nameOnly: true,
  });

  // console.log(result);
  console.log(result?.cursor?.firstBatch);

  // Run delete data in collection
  const collections: any = result?.cursor?.firstBatch;

  // Loop collections
  await collections.forEach(async (collection: any) => {
    console.log(`execute delete for collection : ${collection?.name}`);

    // Run raw command for delete
    const clearData: any = await prisma.$runCommandRaw({
      delete: collection?.name,
      deletes: [
        {
          q: {},
          limit: 0,
        },
      ],
    });

    console.log(clearData);
  });
}

if (process.env.NODE_ENV !== "production") {
  main().catch((err) => {
    console.log(err);
  });
}
