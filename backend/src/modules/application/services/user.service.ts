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

  async getUserById(id: string) {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // get data
    const user = await this.repository.getUserById(id);

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
    // Buat data
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
}

export default UserService;
