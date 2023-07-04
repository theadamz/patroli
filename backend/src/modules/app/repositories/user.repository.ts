import prisma from "../../../utilities/prisma";
import {
  UserQueryParametersSchema,
  UserCreateRequestSchema,
  UserResponseBaseSchema,
  UserUpdateRequestSchema,
  UserModelSchema,
} from "../schemas/user.schema";
import { hashPassword } from "../../../utilities/hashPassword";

// type for return list
type ListUser = {
  data: UserResponseBaseSchema[];
  count: number;
};

class UserRepository {
  async listUsers(query: UserQueryParametersSchema): Promise<ListUser> {
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

    // get data users and count
    const [users, usersCount] = await prisma.$transaction([
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
      data: users.map(({ role, ...user }) => {
        return { ...user, role_name: role?.name };
      }),
      count: usersCount,
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
      },
    });
  }

  async createUser(
    input: UserCreateRequestSchema
  ): Promise<UserResponseBaseSchema | null> {
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
        },
      })
      .then(async (user) => {
        return user === null
          ? null
          : ({
              id: user.id,
              email: user?.email,
              name: user?.name,
              role_id: user?.role_id,
              role_name: (
                await prisma.role.findFirst({
                  where: { id: user.role_id?.toString() },
                  select: { name: true },
                })
              )?.name,
            } as UserResponseBaseSchema);
      });

    return user;
  }

  async updateUser(
    input: UserUpdateRequestSchema
  ): Promise<UserResponseBaseSchema> {
    let data = {
      email: input.email,
      name: input.name,
      role_id: input.role_id,
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
    const user = await prisma.user.update({
      where: { id: input.id },
      data: data,
    });

    return user;
  }

  async deleteUser(id: string): Promise<UserResponseBaseSchema> {
    // delete
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return user;
  }
}

export default UserRepository;
