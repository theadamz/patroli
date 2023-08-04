import { ObjectId } from "bson";
import OfficerRepository from "@modules/master/repositories/officer.repository";
import {
  OfficerQueryParametersSchema,
  OfficerCreateRequestSchema,
  OfficerUpdateRequestSchema,
  OfficerResponseSchema,
} from "@modules/master/schemas/officer.schema";

class OfficerService {
  protected repository: OfficerRepository;

  constructor() {
    this.repository = new OfficerRepository();
  }

  async getOfficers(query: OfficerQueryParametersSchema) {
    // get data
    const records = await this.repository.getOfficers(query);

    return records;
  }

  async getOfficerById(id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.getOfficerById(id);

    return record;
  }

  async getOfficerByCode(code: string): Promise<OfficerResponseSchema | null> {
    const officer = await this.repository.getOfficerByCode(code);

    if (officer === null) return null;

    return {
      id: officer.id,
      code: officer.code,
      name: officer.name,
      phone_no: officer.phone_no,
      email: officer.email,
      photo_filename_hash: officer.photo_filename_hash,
      rating: officer.rating,
      is_active: officer.is_active,
      user_id: officer.user_id,
      last_coordinates: [
        officer.last_coordinates[0],
        officer.last_coordinates[1],
      ],
    };
  }

  async getOfficerByEmail(
    email: string
  ): Promise<OfficerResponseSchema | null> {
    const officer = await this.repository.getOfficerByEmail(email);

    if (officer === null) return null;

    return {
      id: officer.id,
      code: officer.code,
      name: officer.name,
      phone_no: officer.phone_no,
      email: officer.email,
      photo_filename_hash: officer.photo_filename_hash,
      rating: officer.rating,
      is_active: officer.is_active,
      user_id: officer.user_id,
      last_coordinates: [
        officer.last_coordinates[0],
        officer.last_coordinates[1],
      ],
    };
  }

  async createOfficer(
    input: OfficerCreateRequestSchema,
    user_id: string | null
  ) {
    // create data
    const createdData = await this.repository.createOfficer(input, user_id);

    return createdData;
  }

  async updateOfficer(
    id: string,
    input: OfficerUpdateRequestSchema,
    user_id: string | null
  ) {
    // Update data
    const updateData = await this.repository.updateOfficer(id, input, user_id);

    return updateData;
  }

  async deleteOfficer(id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.deleteOfficer(id);

    return record;
  }
}

export default OfficerService;
