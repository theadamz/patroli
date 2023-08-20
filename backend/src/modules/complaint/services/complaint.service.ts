import { ObjectId } from "bson";
import ComplaintRepository from "@modules/complaint/repositories/complaint.repository";
import {
  ComplaintQueryParametersSchema,
  ComplaintCreateRequestSchema,
  ComplaintUpdateRequestSchema,
} from "@modules/complaint/schemas/complaint.schema";

class ComplaintService {
  protected repository: ComplaintRepository;

  constructor() {
    this.repository = new ComplaintRepository();
  }

  async getComplaints(
    query: ComplaintQueryParametersSchema,
    citizen_id: string
  ) {
    // get data
    const records = await this.repository.getComplaints(query, citizen_id);

    return records;
  }

  async getComplaintById(id: string, citizen_id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.getComplaintById(id, citizen_id);

    return record;
  }

  async getComplaintLogsById(id: string, citizen_id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.getComplaintLogsById(id, citizen_id);

    return record;
  }

  async createComplaint(
    input: ComplaintCreateRequestSchema,
    citizen_id: string,
    user_id: string | null
  ) {
    // create data
    const createdData = await this.repository.createComplaint(
      input,
      citizen_id,
      user_id
    );

    return createdData;
  }

  async updateComplaint(
    id: string,
    input: ComplaintUpdateRequestSchema,
    citizen_id: string,
    user_id: string | null
  ) {
    // Update data
    const updateData = await this.repository.updateComplaint(
      id,
      input,
      citizen_id,
      user_id
    );

    return updateData;
  }

  async deleteComplaint(id: string, citizen_id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.deleteComplaint(id, citizen_id);

    return record;
  }

  async deleteComplaintPictures(
    id: string,
    files: string[],
    citizen_id: string
  ) {
    // get data
    const record = await this.repository.deleteComplaintPictures(
      id,
      files,
      citizen_id
    );

    return record;
  }

  async deleteComplaintVideos(id: string, files: string[], citizen_id: string) {
    // get data
    const record = await this.repository.deleteComplaintVideos(
      id,
      files,
      citizen_id
    );

    return record;
  }
}

export default ComplaintService;
