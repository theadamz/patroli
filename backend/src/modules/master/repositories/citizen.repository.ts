import prisma from "@utilities/prisma";
import {
  CitizenCreateRequestSchema,
  CitizenQueryParametersSchema,
  CitizenUpdateRequestSchema,
} from "@modules/master/schemas/citizen.schema";
import { ObjectId } from "bson";
import { hashPassword } from "@utilities/hashPassword";

const selectedColumns = {
  id: true,
  user_id: true,
  id_card_number: true,
  name: true,
  phone_no: true,
  email: true,
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

class CitizenRepository {
  async getCitizens(query: CitizenQueryParametersSchema) {
    // search
    const search = query.search ?? "";

    // where parameters
    const whereParameters = {
      OR: [
        { id_card_number: { contains: search } },
        { name: { contains: search } },
      ],
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
      prisma.citizen.findMany({
        select: selectedColumns,
        where: whereParameters,
        orderBy: orderBy,
        skip: skip,
        take: take,
      }),
      prisma.citizen.count({
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

  async getCitizenById(id: string) {
    const record = await prisma.citizen.findUnique({
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

  async getCitizenByCode(code: string) {
    const record = await prisma.citizen.findUnique({
      where: {
        id_card_number: code,
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

  async getCitizenByEmail(email: string) {
    const record = await prisma.citizen.findUnique({
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

  async getCitizenByPhone(phone_no: string) {
    const record = await prisma.citizen.findUnique({
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

  async createCitizen(
    input: CitizenCreateRequestSchema,
    user_id: string | null
  ) {
    const password = await hashPassword(input.email);

    const transaction = await prisma.$transaction(async (tx) => {
      // ambil role_id citizen
      const role = await tx.role.findUnique({
        where: {
          code: "citizen",
        },
      });

      // Buat user
      const user = await tx.user.create({
        data: {
          email: input.email,
          password: password,
          name: input.name,
          role_id: role!.id,
          actor: "citizen",
          photo_filename: input.photo_filename,
          photo_filename_hash: input.photo_filename_hash,
          public_id: new ObjectId().toString(),
          created_by: user_id,
          created_at: new Date(),
        },
      });

      // save
      const record = await tx.citizen.create({
        data: {
          user_id: user.id,
          id_card_number: input.id_card_number,
          name: input.name,
          phone_no: input.phone_no,
          email: input.email,
          is_active: true,
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

  async updateCitizen(
    id: string,
    input: CitizenUpdateRequestSchema,
    user_id: string | null
  ) {
    const record = await prisma.citizen.update({
      where: {
        id: id,
      },
      data: {
        id_card_number: input.id_card_number,
        name: input.name,
        phone_no: input.phone_no,
        email: input.email,
        is_active: input.is_active === null ? false : input.is_active,
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
    });

    return record;
  }

  async deleteCitizen(id: string) {
    const record = await prisma.$transaction(async (tx) => {
      // delete citizen
      const record = await tx.citizen.delete({
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

    return record;
  }
}

export default CitizenRepository;
