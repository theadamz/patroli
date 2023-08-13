import prisma from "@utilities/prisma";
import {
  CitizenCreateRequestSchema,
  CitizenQueryParametersSchema,
  CitizenUpdateRequestSchema,
} from "@modules/master/schemas/citizen.schema";
import { ObjectId } from "bson";
import { hashPassword } from "@utilities/hashPassword";

class CitizenRepository {
  async getCitizens(query: CitizenQueryParametersSchema) {
    // search
    const search = query.search === undefined ? "" : query.search;

    // where parameters
    const whereParameters = {
      OR: [
        { id_card_number: { contains: search } },
        { name: { contains: search } },
      ],
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
      prisma.citizen.findMany({
        select: {
          id: true,
          user_id: true,
          id_card_number: true,
          name: true,
          phone_no: true,
          email: true,
          photo_filename: true,
          photo_filename_hash: true,
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
      prisma.citizen.count({
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

  async getCitizenById(id: string) {
    const record = await prisma.citizen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        user_id: true,
        id_card_number: true,
        name: true,
        phone_no: true,
        email: true,
        photo_filename: true,
        photo_filename_hash: true,
        last_coordinates: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return record;
  }

  async getCitizenByCode(code: string) {
    const record = await prisma.citizen.findUnique({
      where: {
        id_card_number: code,
      },
      select: {
        id: true,
        user_id: true,
        id_card_number: true,
        name: true,
        phone_no: true,
        email: true,
        photo_filename: true,
        photo_filename_hash: true,
        last_coordinates: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return record;
  }

  async getCitizenByEmail(email: string) {
    const record = await prisma.citizen.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        user_id: true,
        id_card_number: true,
        name: true,
        phone_no: true,
        email: true,
        photo_filename: true,
        photo_filename_hash: true,
        last_coordinates: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return record;
  }

  async getCitizenByPhone(phone_no: string) {
    const record = await prisma.citizen.findUnique({
      where: {
        phone_no: phone_no,
      },
      select: {
        id: true,
        user_id: true,
        id_card_number: true,
        name: true,
        phone_no: true,
        email: true,
        photo_filename: true,
        photo_filename_hash: true,
        last_coordinates: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return record;
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
          role_id: role?.id,
          actor: "citizen",
          public_id: new ObjectId().toString(),
          created_by: user_id,
          created_at: new Date(),
        },
      });

      // save
      const citizen = await tx.citizen.create({
        data: {
          user_id: user.id,
          id_card_number: input.id_card_number,
          name: input.name,
          phone_no: input.phone_no,
          email: input.email,
          photo_filename: input.photo_filename,
          photo_filename_hash: input.photo_filename_hash,
          is_active: true,
          created_at: new Date(),
        },
      });

      return citizen;
    });

    return transaction;
  }

  async updateCitizen(
    id: string,
    input: CitizenUpdateRequestSchema,
    user_id: string | null
  ) {
    const transaction = await prisma.$transaction(async (tx) => {
      // save
      const citizen = await tx.citizen.update({
        where: {
          id: id,
        },
        data: {
          id_card_number: input.id_card_number,
          name: input.name,
          phone_no: input.phone_no,
          email: input.email,
          photo_filename: input.photo_filename,
          photo_filename_hash: input.photo_filename_hash,
          is_active: input.is_active === null ? false : input.is_active,
          updated_at: new Date(),
        },
      });

      // Buat user
      await tx.user.update({
        where: {
          id: citizen.user_id,
        },
        data: {
          email: input.email,
          name: input.name,
          updated_by: user_id,
          updated_at: new Date(),
        },
      });

      return citizen;
    });

    return transaction;
  }

  async deleteCitizen(id: string) {
    const transaction = await prisma.$transaction(async (tx) => {
      // delete citizen
      const citizen = await tx.citizen.delete({
        where: {
          id,
        },
      });

      // delete user
      await tx.user.delete({
        where: {
          id: citizen.user_id,
        },
      });

      return citizen;
    });

    return transaction;
  }
}

export default CitizenRepository;
