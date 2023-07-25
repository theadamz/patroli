import prisma from "@utilities/prisma";
import {
  CategoryCreateRequestSchema,
  CategoryQueryParametersSchema,
  CategoryUpdateRequestSchema,
} from "@root/modules/complaint/schemas/category.schema";

class CategoryRepository {
  async getCategories(query: CategoryQueryParametersSchema) {
    // search
    const search = query.search === undefined ? "" : query.search;

    // where parameters
    const whereParameters = {
      OR: [{ name: { contains: search } }],
      AND: [{ is_visible: query.is_visible }],
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
      prisma.complain_category.findMany({
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
      prisma.complain_category.count({
        where: whereParameters,
      }),
    ]);

    return {
      // @ts-ignore
      data: rows,
      total: rowsCount,
      per_page: query.per_page,
      current_page: query.page,
      last_page:
        query.per_page === 0 ? 0 : Math.ceil(rowsCount / query.per_page),
    };
  }

  async getCategoryById(id: string) {
    const row = await prisma.complain_category.findUnique({
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
    const row = await prisma.complain_category.findFirst({
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
    const data = await prisma.complain_category.create({
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
    const data = await prisma.complain_category.update({
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
