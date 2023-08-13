import { ObjectId } from "bson";
import CitizenRepository from "@modules/master/repositories/citizen.repository";
import {
  CitizenQueryParametersSchema,
  CitizenCreateRequestSchema,
  CitizenUpdateRequestSchema,
  CitizenResponseSchema,
} from "@modules/master/schemas/citizen.schema";

class CitizenService {
  protected repository: CitizenRepository;

  constructor() {
    this.repository = new CitizenRepository();
  }

  async getCitizens(query: CitizenQueryParametersSchema) {
    // get data
    const records = await this.repository.getCitizens(query);

    return records;
  }

  async getCitizenById(id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.getCitizenById(id);

    return record;
  }

  async getCitizenByCode(code: string): Promise<CitizenResponseSchema | null> {
    const citizen = await this.repository.getCitizenByCode(code);

    if (citizen === null) return null;

    return {
      id: citizen.id,
      id_card_number: citizen.id_card_number,
      name: citizen.name,
      phone_no: citizen.phone_no,
      email: citizen.email,
      photo_filename_hash: citizen.photo_filename_hash,
      is_active: citizen.is_active,
      user_id: citizen.user_id,
      last_coordinates: [
        citizen.last_coordinates[0],
        citizen.last_coordinates[1],
      ],
    };
  }

  async getCitizenByEmail(
    email: string
  ): Promise<CitizenResponseSchema | null> {
    const citizen = await this.repository.getCitizenByEmail(email);

    if (citizen === null) return null;

    return {
      id: citizen.id,
      id_card_number: citizen.id_card_number,
      name: citizen.name,
      phone_no: citizen.phone_no,
      email: citizen.email,
      photo_filename_hash: citizen.photo_filename_hash,
      is_active: citizen.is_active,
      user_id: citizen.user_id,
      last_coordinates: [
        citizen.last_coordinates[0],
        citizen.last_coordinates[1],
      ],
    };
  }

  async getCitizenByPhone(
    phone_no: string
  ): Promise<CitizenResponseSchema | null> {
    const citizen = await this.repository.getCitizenByPhone(phone_no);

    if (citizen === null) return null;

    return {
      id: citizen.id,
      id_card_number: citizen.id_card_number,
      name: citizen.name,
      phone_no: citizen.phone_no,
      email: citizen.email,
      photo_filename_hash: citizen.photo_filename_hash,
      is_active: citizen.is_active,
      user_id: citizen.user_id,
      last_coordinates: [
        citizen.last_coordinates[0],
        citizen.last_coordinates[1],
      ],
    };
  }

  async createCitizen(
    input: CitizenCreateRequestSchema,
    user_id: string | null
  ) {
    // create data
    const createdData = await this.repository.createCitizen(input, user_id);

    return createdData;
  }

  async updateCitizen(
    id: string,
    input: CitizenUpdateRequestSchema,
    user_id: string | null
  ) {
    // Update data
    const updateData = await this.repository.updateCitizen(id, input, user_id);

    return updateData;
  }

  async deleteCitizen(id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.deleteCitizen(id);

    return record;
  }
}

export default CitizenService;
