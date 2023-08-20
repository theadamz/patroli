import prisma from "@utilities/prisma";
import {
  OfficerCreateRequestSchema,
  OfficerQueryParametersSchema,
  OfficerUpdateRequestSchema,
} from "@modules/master/schemas/officer.schema";
import { ObjectId } from "bson";
import { hashPassword } from "@utilities/hashPassword";

const selectedColumns = {
  id: true,
  user_id: true,
  code: true,
  name: true,
  phone_no: true,
  email: true,
  rating: true,
  last_coordinates: true,
  is_active: true,
  created_at: true,
  updated_at: true,
  user: {
    select: {
      photo_filename: true,
      photo_filename_hash: true,
    },
  },
};

class OfficerRepository {
  async getOfficers(query: OfficerQueryParametersSchema) {
    // search
    const search = query.search ?? "";

    // where parameters
    const whereParameters = {
      OR: [{ code: { contains: search } }, { name: { contains: search } }],
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
      prisma.officer.findMany({
        select: selectedColumns,
        where: whereParameters,
        orderBy: orderBy,
        skip: skip,
        take: take,
      }),
      prisma.officer.count({
        where: whereParameters,
      }),
    ]);

    return {
      data: records.map(({ user, ...rest }) => {
        return {
          ...rest,
          photo_filename: user.photo_filename,
          photo_filename_hash: user.photo_filename_hash,
        };
      }),
      total: recordsCount,
      per_page: query.per_page,
      current_page: query.page,
      last_page:
        query.per_page === 0 ? 0 : Math.ceil(recordsCount / query.per_page),
    };
  }

  async getOfficerById(id: string) {
    const record = await prisma.officer.findUnique({
      where: {
        id,
      },
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      photo_filename: record.user.photo_filename,
      photo_filename_hash: record.user.photo_filename_hash,
    };
  }

  async getOfficerByCode(code: string) {
    const record = await prisma.officer.findUnique({
      where: {
        code: code,
      },
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      photo_filename: record.user.photo_filename,
      photo_filename_hash: record.user.photo_filename_hash,
    };
  }

  async getOfficerByEmail(email: string) {
    const record = await prisma.officer.findUnique({
      where: {
        email: email,
      },
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      photo_filename: record.user.photo_filename,
      photo_filename_hash: record.user.photo_filename_hash,
    };
  }

  async getOfficerByPhone(phone_no: string) {
    const record = await prisma.officer.findUnique({
      where: {
        phone_no: phone_no,
      },
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      photo_filename: record.user.photo_filename,
      photo_filename_hash: record.user.photo_filename_hash,
    };
  }

  async createOfficer(
    input: OfficerCreateRequestSchema,
    user_id: string | null
  ) {
    const password = await hashPassword(input.email);

    const transaction = await prisma.$transaction(async (tx) => {
      // ambil role_id officer
      const role = await tx.role.findUnique({
        where: {
          code: "officer",
        },
      });

      // Buat user
      const user = await tx.user.create({
        data: {
          email: input.email,
          password: password,
          name: input.name,
          role_id: role!.id,
          actor: "officer",
          public_id: new ObjectId().toString(),
          photo_filename: input.photo_filename,
          photo_filename_hash: input.photo_filename_hash,
          created_by: user_id,
          created_at: new Date(),
        },
      });

      // save
      const record = await tx.officer.create({
        data: {
          user_id: user.id,
          code: input.code,
          name: input.name,
          phone_no: input.phone_no,
          email: input.email,
          rating: 0,
          is_active: input.is_active,
          created_by: user_id,
          created_at: new Date(),
        },
        select: selectedColumns,
      });

      if (record === null) return null;

      return {
        ...record,
        photo_filename: record.user.photo_filename,
        photo_filename_hash: record.user.photo_filename_hash,
      };
    });

    return transaction;
  }

  async updateOfficer(
    id: string,
    input: OfficerUpdateRequestSchema,
    user_id: string | null
  ) {
    // save
    const record = await prisma.officer.update({
      where: {
        id: id,
      },
      data: {
        code: input.code,
        name: input.name,
        phone_no: input.phone_no,
        email: input.email,
        is_active: input.is_active,
        updated_by: user_id,
        updated_at: new Date(),
        user: {
          update: {
            email: input.email,
            name: input.name,
            photo_filename: input.photo_filename,
            photo_filename_hash: input.photo_filename_hash,
            updated_by: user_id,
            updated_at: new Date(),
          },
        },
      },
      select: selectedColumns,
    });

    if (record === null) return null;

    return {
      ...record,
      photo_filename: record.user.photo_filename,
      photo_filename_hash: record.user.photo_filename_hash,
    };
  }

  async deleteOfficer(id: string) {
    const transaction = await prisma.$transaction(async (tx) => {
      // delete officer
      const record = await tx.officer.delete({
        where: {
          id,
        },
        select: selectedColumns,
      });

      // delete user
      await tx.user.delete({
        where: {
          id: record.user_id,
        },
      });

      if (record === null) return null;

      return {
        ...record,
        photo_filename: record.user.photo_filename,
        photo_filename_hash: record.user.photo_filename_hash,
      };
    });

    return transaction;
  }
}

export default OfficerRepository;
