import prisma from "@utilities/prisma";
import {
  ComplaintCreateRequestSchema,
  ComplaintQueryParametersSchema,
  ComplaintUpdateRequestSchema,
} from "@modules/complaint/schemas/complaint.schema";
import { ObjectId } from "bson";
import CitizenService from "@modules/master/services/citizen.service";
import { video_file } from "@prisma/client";

const cizizenService = new CitizenService();

const selectedColumns = {
  id: true,
  doc_no: true,
  doc_date: true,
  complaint_category_id: true,
  complaint_category: {
    select: {
      name: true,
    },
  },
  officer_id: true,
  officer: {
    select: {
      name: true,
    },
  },
  description: true,
  video: true,
  pictures: true,
  status: true,
  reason: true,
  rating: true,
  coordinates: true,
  created_at: true,
  updated_at: true,
};

class ComplaintRepository {
  async getComplaints(
    query: ComplaintQueryParametersSchema,
    citizen_id: string
  ) {
    // search
    const search = query.search ?? "";

    // where parameters
    const whereParameters = {
      OR: [{ description: { contains: search } }],
      AND: [{ citizen_id: citizen_id }],
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
      prisma.complaint.findMany({
        select: selectedColumns,
        where: whereParameters,
        orderBy: orderBy,
        skip: skip,
        take: take,
      }),
      prisma.complaint.count({
        where: whereParameters,
      }),
    ]);

    return {
      data: records.map(({ complaint_category, officer, ...rest }) => {
        return {
          ...rest,
          complaint_category_name: complaint_category.name ?? null,
          officer_name: officer?.name ?? null,
        };
      }),
      total: recordsCount,
      per_page: query.per_page,
      current_page: query.page,
      last_page:
        query.per_page === 0 ? 0 : Math.ceil(recordsCount / query.per_page),
    };
  }

  async getComplaintById(id: string, citizen_id: string) {
    const record = await prisma.complaint.findFirst({
      where: { id: id, citizen_id: citizen_id },
      select: selectedColumns,
    });

    if (record === null) return null;

    return record !== null
      ? {
          ...record,
          ...{
            complaint_category_name: record.complaint_category.name ?? null,
          },
          ...{ officer_name: record.officer?.name ?? null },
        }
      : record;
  }

  async getComplaintLogsById(id: string, citizen_id: string) {
    const record = await prisma.complaint.findFirst({
      where: { id: id, citizen_id: citizen_id },
      select: {
        logs: {
          select: {
            message: true,
            old_data: true,
            created_at: true,
          },
        },
      },
    });

    if (record === null) return null;

    return record.logs;
  }

  async createComplaint(
    input: ComplaintCreateRequestSchema,
    citizen_id: string,
    user_id: string | null
  ) {
    // get citizen
    const citizen = await cizizenService.getCitizenById(citizen_id);

    // save
    const record = await prisma.complaint.create({
      data: {
        doc_no: new ObjectId().toString(),
        doc_date: new Date(),
        complaint_category_id: input.complaint_category_id,
        citizen_id: citizen_id,
        description: input.description,
        video: input.video,
        pictures: input.pictures!,
        status: "menunggu",
        coordinates: [input.latitude, input.longitude],
        logs: {
          message: `${citizen?.name} melaporkan keluhan.`,
          created_by: user_id,
          created_at: new Date(),
        },
        created_by: user_id,
        created_at: new Date(),
      },
      select: selectedColumns,
    });

    return record !== null
      ? {
          ...record,
          ...{
            complaint_category_name: record.complaint_category.name ?? null,
          },
          ...{ officer_name: record.officer?.name ?? null },
        }
      : record;
  }

  async updateComplaint(
    id: string,
    input: ComplaintUpdateRequestSchema,
    citizen_id: string,
    user_id: string | null
  ) {
    // get citizen
    const citizen = await cizizenService.getCitizenById(citizen_id);

    // get old data
    const oldData = await this.getComplaintById(id, citizen_id);

    // prepare data to update
    let data2update = {
      complaint_category_id: input.complaint_category_id,
      description: input.description,
      coordinates: [input.latitude, input.longitude],
      logs: {
        push: {
          message: `${citizen?.name} memperbaharui data keluhan.`,
          old_data: JSON.stringify(oldData),
          created_by: user_id,
          created_at: new Date(),
        },
      },
      updated_by: user_id,
      updated_at: new Date(),
    };

    // check if pictures exist
    if (input.pictures && input.pictures.length > 0) {
      data2update = {
        ...data2update,
        ...{
          pictures: {
            push: input.pictures,
          },
        },
      };
    }

    // check if video exist
    if (input.video) {
      data2update = {
        ...data2update,
        ...{
          video: {
            video_filename: input.video.video_filename,
            video_filename_hash: input.video.video_filename_hash,
          } as video_file,
        },
      };
    }

    // update data
    const record = await prisma.complaint.update({
      where: {
        id: id,
      },
      data: data2update,
      select: selectedColumns,
    });

    return record !== null
      ? {
          ...record,
          ...{
            complaint_category_name: record.complaint_category.name ?? null,
          },
          ...{ officer_name: record.officer?.name ?? null },
        }
      : record;
  }

  async deleteComplaint(id: string, citizen_id: string) {
    const record = await prisma.complaint.delete({
      where: { id: id },
      select: selectedColumns,
    });

    return record !== null
      ? {
          ...record,
          ...{
            complaint_category_name: record.complaint_category.name ?? null,
          },
          ...{ officer_name: record.officer?.name ?? null },
        }
      : record;
  }

  async deleteComplaintPictures(
    id: string,
    files: string[],
    citizen_id: string
  ) {
    // get previous record
    const complaint = await this.getComplaintById(id, citizen_id);

    // if null then return null
    if (!complaint) return null;

    // filter pictures
    const pictures = complaint.pictures.filter((value) => {
      return !files.includes(value.picture_filename_hash);
    });

    // if pictures length = 0
    if (pictures.length === complaint.pictures.length) {
      return null;
    }

    // update pictures with new array
    const record = await prisma.complaint.update({
      where: { id: id },
      data: {
        pictures: pictures,
      },
      select: selectedColumns,
    });

    return record !== null
      ? {
          ...record,
          ...{
            complaint_category_name: record.complaint_category.name ?? null,
          },
          ...{ officer_name: record.officer?.name ?? null },
        }
      : record;
  }

  async deleteComplaintVideos(id: string, files: string[], citizen_id: string) {
    // get previous record
    const complaint = await this.getComplaintById(id, citizen_id);

    // if null then return null
    if (complaint === null || !complaint.video) return null;

    if (!files.includes(complaint.video.video_filename_hash)) {
      return null;
    }

    // update pictures with new array
    const record = await prisma.complaint.update({
      where: { id: id },
      data: {
        video: null,
      },
      select: selectedColumns,
    });

    return record !== null
      ? {
          ...record,
          ...{
            complaint_category_name: record.complaint_category.name ?? null,
          },
          ...{ officer_name: record.officer?.name ?? null },
        }
      : record;
  }
}

export default ComplaintRepository;
