import { MenuAccessType } from "@root/modules/application/schemas/menu.schema";
import prisma from "./prisma";

export const getPermissionByMenuCode = async (
  menu_code: string,
  role_id: string
): Promise<MenuAccessType | null> => {
  const menu = await prisma.menu.findFirst({
    where: {
      code: menu_code,
      is_active: true,
    },
    select: {
      id: true,
    },
  });

  const access = await prisma.role_menu.findFirst({
    where: {
      role_id: role_id,
      menu_id: menu?.id,
    },
    select: {
      menu_id: true,
      allow_create: true,
      allow_edit: true,
      allow_delete: true,
      menu: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  });

  if (menu === null || access === null) return null;

  return {
    menu_id: access.menu_id,
    menu_code: access.menu.code,
    menu_name: access.menu.name,
    allow_create: access.allow_create,
    allow_edit: access.allow_edit,
    allow_delete: access.allow_delete,
  };
};

export const checkPermissionVsMethod = async (
  permission: MenuAccessType,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string
) => {
  switch (method) {
    case "POST":
      return permission.allow_create === undefined
        ? false
        : permission.allow_create === true;

    case "PUT":
    case "PATCH":
      return permission.allow_edit === undefined
        ? false
        : permission.allow_edit === true;

    case "DELETE":
      return permission.allow_edit === undefined
        ? false
        : permission.allow_edit === true;

    default:
      return method === "GET" ?? false;
  }
};
