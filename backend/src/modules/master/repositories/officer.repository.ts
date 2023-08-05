import prisma from "@utilities/prisma";
import {
  OfficerCreateRequestSchema,
  OfficerQueryParametersSchema,
  OfficerUpdateRequestSchema,
} from "@modules/master/schemas/officer.schema";
import { ObjectId } from "bson";

class OfficerRepository {
  async getOfficers(query: OfficerQueryParametersSchema) {
    // search
    const search = query.search === undefined ? "" : query.search;

    // where parameters
    const whereParameters = {
      OR: [{ code: { contains: search } }, { name: { contains: search } }],
      AND: [{ is_active: query.is_active }],
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
      prisma.officer.findMany({
        select: {
          id: true,
          user_id: true,
          code: true,
          name: true,
          phone_no: true,
          email: true,
          photo_filename_hash: true,
          rating: true,
          last_coordinates: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
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
      // @ts-ignore
      data: records,
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
      select: {
        id: true,
        user_id: true,
        code: true,
        name: true,
        phone_no: true,
        email: true,
        photo_filename_hash: true,
        rating: true,
        last_coordinates: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return record;
  }

  async getOfficerByCode(code: string) {
    const record = await prisma.officer.findUnique({
      where: {
        code: code,
      },
      select: {
        id: true,
        user_id: true,
        code: true,
        name: true,
        phone_no: true,
        email: true,
        photo_filename_hash: true,
        rating: true,
        last_coordinates: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return record;
  }

  async getOfficerByEmail(email: string) {
    const record = await prisma.officer.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        user_id: true,
        code: true,
        name: true,
        phone_no: true,
        email: true,
        photo_filename_hash: true,
        rating: true,
        last_coordinates: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return record;
  }

  async createOfficer(
    input: OfficerCreateRequestSchema,
    user_id: string | null
  ) {
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
          password: input.email,
          name: input.name,
          role_id: role?.id,
          actor: "officer",
          public_id: new ObjectId().toString(),
          created_by: user_id,
          created_at: new Date(),
        },
      });

      // save
      const officer = await tx.officer.create({
        data: {
          user_id: user.id,
          code: input.code,
          name: input.name,
          phone_no: input.phone_no,
          email: input.email,
          photo_filename: input.photo_filename,
          photo_filename_hash: input.photo_filename_hash,
          rating: 0,
          is_active: input.is_active,
          created_by: user_id,
          created_at: new Date(),
        },
      });

      return officer;
    });

    return transaction;
  }

  async updateOfficer(
    id: string,
    input: OfficerUpdateRequestSchema,
    user_id: string | null
  ) {
    const transaction = await prisma.$transaction(async (tx) => {
      // save
      const officer = await tx.officer.update({
        where: {
          id: id,
        },
        data: {
          code: input.code,
          name: input.name,
          phone_no: input.phone_no,
          email: input.email,
          photo_filename: input.photo_filename,
          photo_filename_hash: input.photo_filename_hash,
          is_active: input.is_active,
          updated_by: user_id,
          updated_at: new Date(),
        },
      });

      // Buat user
      await tx.user.update({
        where: {
          id: officer.user_id,
        },
        data: {
          email: input.email,
          name: input.name,
          updated_by: user_id,
          updated_at: new Date(),
        },
      });

      return officer;
    });

    return transaction;
  }

  async deleteOfficer(id: string) {
    const transaction = await prisma.$transaction(async (tx) => {
      // delete officer
      const officer = await tx.officer.delete({
        where: {
          id,
        },
      });

      // delete user
      await tx.user.delete({
        where: {
          id: officer.user_id,
        },
      });

      return officer;
    });

    return transaction;
  }
}

export default OfficerRepository;
