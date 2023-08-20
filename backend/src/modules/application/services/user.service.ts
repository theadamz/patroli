import { ObjectId } from "bson";
import UserRepository from "@modules/application/repositories/user.repository";
import {
  UserQueryParametersSchema,
  UserCreateRequestSchema,
  UserUpdateRequestSchema,
  UserResponseSchema,
} from "@modules/application/schemas/user.schema";
import { app } from "@root/app";

class UserService {
  protected repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getUsers(query: UserQueryParametersSchema) {
    // get data
    const records = await this.repository.getUsers(query);

    return {
      data: records.data,
      total: records.total,
      per_page: query.per_page,
      current_page: query.page,
      last_page:
        query.per_page === 0 ? 0 : Math.ceil(records.total / query.per_page),
    };
  }

  async getUserById(id: string, usePassword: boolean = false) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const record = await this.repository.getUserById(id, usePassword);

    return record;
  }

  async getUserByEmail(
    email: string,
    usePassword: boolean = false
  ): Promise<UserResponseSchema | null> {
    const record = await this.repository.getUserByEmail(email, usePassword);

    return record;
  }

  async createUser(input: UserCreateRequestSchema) {
    // create data
    const record = await this.repository.createUser(
      input,
      app.request.auth.user.id
    );

    return record;
  }

  async updateUser(
    id: string,
    input: UserUpdateRequestSchema,
    user_id: string | null
  ) {
    // Update data
    const record = await this.repository.updateUser(id, input, user_id);

    return record;
  }

  async deleteUser(id: string) {
    // Hapus data
    const record = await this.repository.deleteUser(id);

    return record;
  }

  async getUserProfileById(id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const profile = await this.repository.getUserProfileById(id);

    // if data not found
    if (profile === null) return null;

    let response = null;

    response = {
      identity_no:
        profile.user?.actor === "officer"
          ? profile.officer?.code
          : profile.citizen?.id_card_number,
      name: profile.user?.name,
    };

    if (profile.user?.actor === "officer") {
      response = {
        ...response,
        ...{
          phone_no: profile.officer?.phone_no,
          email: profile.user?.email,
        },
      };
    } else {
      response = {
        ...response,
        ...{
          phone_no: profile.citizen?.phone_no,
          email: profile.user?.email,
        },
      };
    }

    return response;
  }

  async updatePassword(newPassword: string, user_id: string) {
    // Update data
    const update = await this.repository.updatePassword(newPassword, user_id);

    return update;
  }
}

export default UserService;
