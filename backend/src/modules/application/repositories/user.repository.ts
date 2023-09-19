import prisma from "@utilities/prisma";
import {
  UserCreateRequestSchema,
  UserQueryParametersSchema,
  UserUpdateRequestSchema,
} from "@modules/application/schemas/user.schema";
import { hashPassword } from "@utilities/hashPassword";
import { ObjectId } from "bson";

const selectedColumns = {
  id: true,
  email: true,
  name: true,
  role_id: true,
  role: {
    select: {
      code: true,
      name: true,
    },
  },
  actor: true,
  photo_filename: true,
  photo_filename_hash: true,
  is_active: true,
  public_id: true,
  created_at: true,
  updated_at: true,
};

class UserRepository {
  async getUsers(query: UserQueryParametersSchema) {
    // search
    const search = query.search ?? "";

    // where parameters
    const whereParameters = {
      OR: [{ email: { contains: search } }, { name: { contains: search } }],
      AND: [{ is_active: query.is_active }],
    };

    // order by
    const sortDirection = query.sort_direction ?? "asc";
    const sortBy = query.sort_by ?? "id";
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
      prisma.user.findMany({
        select: selectedColumns,
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
      data: records.map(({ role, ...rest }) => {
        return { ...rest, role_code: role.code, role_name: role.name };
      }),
      total: recordsCount,
    };
  }

  async getUserById(id: string, usePassword: boolean = false) {
    const record = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...selectedColumns,
        password: usePassword,
      },
    });

    if (record === null) return null;

    return {
      ...record,
      role_code: record.role.code,
      role_name: record.role.name,
    };
  }

  async getUserByEmail(email: string, usePassword: boolean = false) {
    const record = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        ...selectedColumns,
        password: usePassword,
      },
    });

    if (record === null) return null;

    return {
      ...record,
      role_code: record.role.code,
      role_name: record.role.name,
    };
  }

  async createUser(input: UserCreateRequestSchema, user_id: string | null) {
    // hash password
    const password: string = await hashPassword(input.password);

    // insert
    const record = await prisma.user.create({
      data: {
        email: input.email,
        password: password,
        name: input.name,
        role_id: input.role_id,
        actor: input.actor,
        is_active: true,
        public_id: new ObjectId().toString(),
        created_by: user_id,
        created_at: new Date(),
      },
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      role_name: record.name,
    };
  }

  async updateUser(
    id: string,
    input: UserUpdateRequestSchema,
    user_id: string | null
  ) {
    let data = {
      email: input.email,
      name: input.name,
      role_id: input.role_id,
      actor: input.actor,
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
        plainText ?? ""
      );

      // Concat
      data = {
        ...data,
        ...{ password: passwordHash },
      };
    }

    // update
    const record = await prisma.user.update({
      where: { id: id },
      data: data,
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      role_name: record.name,
    };
  }

  async deleteUser(id: string) {
    // delete
    const record = await prisma.user.delete({
      where: {
        id: id,
      },
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      role_name: record.name,
    };
  }

  async getUserProfileById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        email: true,
        name: true,
        actor: true,
      },
    });

    const officer = await prisma.officer.findFirst({
      where: {
        user_id: id,
      },
      select: {
        code: true,
        phone_no: true,
      },
    });

    const citizen = await prisma.citizen.findFirst({
      where: {
        user_id: id,
      },
      select: {
        id_card_number: true,
        phone_no: true,
      },
    });

    return { user, officer, citizen };
  }

  async updatePassword(newPassword: string, user_id: string) {
    // hash password
    const password: string = await hashPassword(newPassword);

    // update
    const user = await prisma.user.update({
      where: { id: user_id },
      data: {
        password: password,
        last_change_password_at: new Date(),
      },
    });

    return user;
  }
}

export default UserRepository;
