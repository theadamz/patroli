import prisma from "@utilities/prisma";
import {
  UserCreateRequestSchema,
  UserQueryParametersSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
} from "@modules/application/schemas/user.schema";
import { hashPassword } from "@utilities/hashPassword";

class UserRepository {
  async getUsers(query: UserQueryParametersSchema) {
    // search
    const search = query.search === undefined ? "" : query.search;

    // where parameters
    const whereParameters = {
      OR: [{ email: { contains: search } }, { name: { contains: search } }],
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
    const [rows, rowsCount] = await prisma.$transaction([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role_id: true,
          role: {
            select: {
              name: true,
            },
          },
          is_active: true,
          created_by: true,
          created_at: true,
          updated_by: true,
          updated_at: true,
        },
        where: whereParameters,
        orderBy: orderBy,
        skip: skip,
        take: take,
      }),
      prisma.user.count({
        where: whereParameters,
      }),
    ]);

    return {
      // @ts-ignore
      data: rows.map(({ role, ...user }) => {
        return { ...user, role_name: role?.name };
      }),
      total: rowsCount,
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role_id: true,
        role: {
          select: { name: true },
        },
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        email: true,
        name: true,
        role_id: true,
        role: {
          select: { name: true },
        },
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async createUser(input: UserCreateRequestSchema, user_id: string | null) {
    // hash password
    const password: string = await hashPassword(input.password);

    // insert
    const user = await prisma.user
      .create({
        data: {
          email: input.email,
          password: password,
          name: input.name,
          role_id: input.role_id,
          is_active: true,
          created_by: user_id,
          created_at: new Date(),
        },
      })
      .then(async (user: UserResponseSchema) => {
        return user === null
          ? null
          : ({
              id: user.id,
              email: user.email,
              name: user.name,
              role_id: user.role_id,
              role_name: (
                await prisma.role.findFirst({
                  where: { id: user.role_id?.toString() },
                  select: { name: true },
                })
              )?.name,
              is_active: user.is_active,
              created_at: user.created_at,
            } as any);
      });

    return user;
  }

  async updateUser(
    id: string,
    input: UserUpdateRequestSchema,
    user_id: string | null
  ): Promise<UserResponseSchema> {
    let data = {
      email: input.email,
      name: input.name,
      role_id: input.role_id,
      is_active: input.is_active,
      updated_by: user_id,
      updated_at: new Date(),
    };

    // Handling password
    const plainText: string | undefined = input.password;

    // Jika password ada
    if (input.password !== undefined) {
      // hash password
      const passwordHash: string | undefined = await hashPassword(
        plainText === undefined ? "" : plainText
      );

      // Concat
      data = {
        ...data,
        ...{ password: passwordHash },
      };
    }

    // update
    const user = await prisma.user
      .update({
        where: { id: id },
        data: data,
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role_id: true,
          role: {
            select: { name: true },
          },
          is_active: true,
          updated_at: true,
        },
      })
      .then(async (user: UserResponseSchema) => {
        return user === null
          ? null
          : ({
              id: user.id,
              email: user.email,
              password: user.password,
              name: user.name,
              role_id: user.role_id,
              role_name: (
                await prisma.role.findFirst({
                  where: { id: user.role_id?.toString() },
                  select: { name: true },
                })
              )?.name,
              is_active: user.is_active,
              updated_at: user.updated_at,
            } as any);
      });

    return user;
  }

  async deleteUser(id: string) {
    // delete
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role_id: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }
}

export default UserRepository;
