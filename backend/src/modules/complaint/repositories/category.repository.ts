import prisma from "@utilities/prisma";
import {
  CategoryCreateRequestSchema,
  CategoryQueryParametersSchema,
  CategoryUpdateRequestSchema,
} from "@root/modules/complaint/schemas/category.schema";

class CategoryRepository {
  async getCategories(query: CategoryQueryParametersSchema) {
    // search
    const search = query.search ?? "";

    // where parameters
    const whereParameters = {
      OR: [{ name: { contains: search } }],
      AND: [{ is_visible: query.is_visible }],
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
      prisma.complaint_category.findMany({
        select: {
          id: true,
          name: true,
          is_visible: true,
          created_at: true,
          updated_at: true,
        },
        where: whereParameters,
        orderBy: orderBy,
        skip: skip,
        take: take,
      }),
      prisma.complaint_category.count({
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

  async getCategoryById(id: string) {
    const row = await prisma.complaint_category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        is_visible: true,
        created_at: true,
        updated_at: true,
      },
    });

    return row;
  }

  async getCategoryByName(name: string) {
    const row = await prisma.complaint_category.findFirst({
      where: {
        name: name.trim(),
      },
    });

    return row;
  }

  async createCategory(
    input: CategoryCreateRequestSchema,
    user_id: string | null
  ) {
    // save
    const data = await prisma.complaint_category.create({
      data: {
        name: input.name,
        is_visible: input.is_visible,
        created_by: user_id,
        created_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        is_visible: true,
        created_at: true,
        updated_at: true,
      },
    });

    return data;
  }

  async updateCategory(
    id: string,
    input: CategoryUpdateRequestSchema,
    user_id: string | null
  ) {
    // save
    const data = await prisma.complaint_category.update({
      where: {
        id: id,
      },
      data: {
        name: input.name,
        is_visible: input.is_visible,
        updated_by: user_id,
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        is_visible: true,
        created_at: true,
        updated_at: true,
      },
    });

    return data;
  }
}

export default CategoryRepository;
