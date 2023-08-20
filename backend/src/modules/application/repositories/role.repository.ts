import prisma from "@utilities/prisma";
import {
  RoleCreateRequestSchema,
  RoleQueryParametersSchema,
  RoleUpdateRequestSchema,
} from "@modules/application/schemas/role.schema";

class RoleRepository {
  async getRoles(query: RoleQueryParametersSchema) {
    // search
    const search = query.search === undefined ? "" : query.search;

    // where parameters
    const whereParameters = {
      OR: [{ code: { contains: search } }, { name: { contains: search } }],
    };

    // order by
    const sortDirection =
      query.sort_direction === undefined || query.sort_direction === null
        ? "asc"
        : query.sort_direction;
    const sortBy =
      query.sort_by === undefined || query.sort_by === null
        ? "id"
        : query.sort_by;
    const orderBy = {
      [sortBy]: sortDirection,
    };

    // take
    const take: number | undefined =
      query.per_page === 0 ? undefined : query.per_page;

    // skip
    const skip = query.page === 1 ? 0 : (query.page - 1) * query.per_page;

    // get data and count
    const [records, recordsCount] = await prisma.$transaction([
      prisma.role.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          created_at: true,
          updated_at: true,
        },
        where: whereParameters,
        orderBy: orderBy,
        skip: skip,
        take: take,
      }),
      prisma.role.count({
        where: whereParameters,
      }),
    ]);

    return {
      data: records,
      total: recordsCount,
      per_page: query.per_page,
      current_page: query.page,
      last_page:
        query.per_page === 0 ? 0 : Math.ceil(recordsCount / query.per_page),
    };
  }

  async getRoleById(id: string) {
    const row = await prisma.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        code: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    return row;
  }

  async getRoleByCode(code: string) {
    const row = await prisma.role.findUnique({
      where: {
        code: code,
      },
      select: {
        id: true,
        code: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    return row;
  }

  async createRole(input: RoleCreateRequestSchema, user_id: string | null) {
    // save
    const data = await prisma.role.create({
      data: {
        code: input.code,
        name: input.name,
        created_by: user_id,
        created_at: new Date(),
      },
      select: {
        id: true,
        code: true,
        name: true,
        created_at: true,
      },
    });

    return data;
  }

  async updateRole(
    id: string,
    input: RoleUpdateRequestSchema,
    user_id: string | null
  ) {
    // save
    const data = await prisma.role.update({
      where: {
        id: id,
      },
      data: {
        code: input.code,
        name: input.name,
        updated_by: user_id,
        updated_at: new Date(),
      },
      select: {
        id: true,
        code: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    return data;
  }

  async deleteRole(id: string) {
    // delete
    const data = await prisma.role.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        code: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    return data;
  }

  async getRoleAccesss(role_id: string) {
    const records = await prisma.role_menu.findMany({
      where: {
        role_id: role_id,
      },
      select: {
        id: true,
        role_id: true,
        role: {
          select: { name: true },
        },
        menu_id: true,
        menu: {
          select: { name: true },
        },
        allow_create: true,
        allow_edit: true,
        allow_delete: true,
        created_at: true,
        updated_at: true,
      },
    });

    return records.map(({ role, menu, ...row }) => {
      const result = {
        ...row,
        ...{
          role_name: role?.name,
        },
        ...{
          menu_name: menu.name,
        },
      };

      return result;
    });
  }
}

export default RoleRepository;
