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
    const users = await this.repository.getUsers(query);

    return {
      // @ts-ignore
      data: users.data,
      total: users.total,
      per_page: query.per_page,
      current_page: query.page,
      last_page:
        query.per_page === 0 ? 0 : Math.ceil(users.total / query.per_page),
    };
  }

  async getUserById(id: string, usePassword: boolean = false) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const user = await this.repository.getUserById(id, usePassword);

    // if data not found
    if (user === null) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role_id: user.role_id,
      role_name: user.role?.name,
      actor: user.actor,
      is_active: user.is_active,
      public_id: user.public_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
      ...(usePassword ? { password: user.password } : null),
    };
  }

  async getUserByEmail(
    email: string,
    usePassword: boolean = false
  ): Promise<UserResponseSchema | null> {
    const user = await this.repository.getUserByEmail(email);

    // if data not found
    if (user === null) return null;

    let response = {
      id: user.id,
      email: user.email,
      name: user.name,
      role_id: user.role_id,
      role_name: user.role?.name,
      actor: user.actor,
      is_active: user.is_active,
      public_id: user.public_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    if (usePassword) {
      response = { ...response, ...{ password: user.password } };
    }

    return response;
  }

  async createUser(input: UserCreateRequestSchema) {
    // create data
    const createdData = await this.repository.createUser(
      input,
      app.request.auth.user.id
    );

    return createdData;
  }

  async updateUser(
    id: string,
    input: UserUpdateRequestSchema,
    user_id: string | null
  ) {
    // Update data
    const updateData = await this.repository.updateUser(id, input, user_id);

    // Remove property password from updateData and make a new object called properties
    const { password: _, ...response } = updateData;

    return response;
  }

  async deleteUser(id: string) {
    // Hapus data
    const deleteData = await this.repository.deleteUser(id);

    return deleteData;
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
          photo_file: profile.officer?.photo_file,
        },
      };
    } else {
      response = {
        ...response,
        ...{
          phone_no: profile.citizen?.phone_no,
          email: profile.user?.email,
          photo_file: profile.citizen?.photo_file,
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
