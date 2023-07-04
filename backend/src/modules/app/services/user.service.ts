import { ObjectId } from "bson";
import UserRepository from "../repositories/user.repository";
import httpErrors from "http-errors";
import {
  UserQueryParametersSchema,
  UserCreateRequestSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
  UsersResponseSchema,
  UserResponseBaseSchema,
} from "../schemas/user.schema";

class UserService {
  protected repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async listUsers(
    query: UserQueryParametersSchema
  ): Promise<UsersResponseSchema> {
    // get data
    const user = await this.repository.listUsers(query);

    // if user null
    if (user.data === null || user.count <= 0) {
      return {
        statusCode: 404,
        message: "Data tidak ditemukan.",
      };
    }

    return {
      statusCode: 200,
      message: "Data ditemukan.",
      data: user.data,
      total: user.count,
      per_page: query.per_page,
      current_page: query.page,
      last_page:
        query.per_page === 0 ? 0 : Math.ceil(user.count / query.per_page),
    };
  }

  async getUserById(id: string): Promise<UserResponseSchema> {
    // if id is not ObjectId
    if (!ObjectId.isValid(id)) {
      return {
        statusCode: httpErrors.BadRequest().statusCode,
        message: "id tidak valid.",
      };
    }

    // get data
    const user = await this.repository.getUserById(id);

    // if data not found
    if (user === null) {
      return {
        statusCode: 404,
        message: "Data tidak ditemukan.",
      };
    }

    return {
      statusCode: 200,
      data:
        user === null
          ? null
          : ({
              id: user.id,
              email: user.email,
              name: user.name,
              role_id: user.role_id,
              role_name: user.role?.name,
            } as UserResponseBaseSchema),
      message: "Data ditemukan.",
    };
  }

  async getUserByEmail(email: string): Promise<UserResponseSchema> {
    const user = await this.repository.getUserByEmail(email);

    // If user not found
    if (user === null) {
      return {
        statusCode: 404,
        message: "Data tidak ditemukan.",
      };
    }

    return {
      statusCode: 200,
      data:
        user === null
          ? null
          : ({
              id: user.id,
              email: user.email,
              name: user.name,
              role_id: user.role_id,
              role_name: user.role?.name,
            } as UserResponseBaseSchema),
      message: "Data ditemukan.",
    };
  }

  async createUser(
    input: UserCreateRequestSchema
  ): Promise<UserResponseSchema> {
    // Periksa jika email sudah terdaftar
    const user = await this.repository.getUserByEmail(input.email);
    if (user) {
      return {
        statusCode: 409,
        message: "Email sudah terdaftar.",
      };
    }

    // Buat data
    const createdData = await this.repository.createUser(input);

    return {
      statusCode: 201,
      data: createdData,
      message: "Data berhasil tersimpan",
    };
  }

  async updateUser(
    input: UserUpdateRequestSchema
  ): Promise<UserResponseSchema> {
    // Periksa jika email sudah terdaftar
    const user = await this.repository.getUserByEmail(input.email);
    if (user && user.id !== input.id) {
      return {
        statusCode: 409,
        message: "Email sudah terdaftar.",
      };
    }

    // Update data
    const updateData = await this.repository.updateUser(input);

    return {
      statusCode: 200,
      data: updateData,
      message: "Data berhasil diperbaharui",
    };
  }

  async deleteUser(id: string): Promise<UserResponseSchema> {
    // Jika id bukan objectid
    if (!ObjectId.isValid(id)) {
      return {
        statusCode: httpErrors.BadRequest().statusCode,
        message: "id tidak valid.",
      };
    }

    // Periksa jika email sudah terdaftar
    const user = await this.repository.getUserById(id);

    // Hapus data
    const deleteData = await this.repository.deleteUser(id);

    return {
      statusCode: 200,
      data: deleteData,
      message: "Data berhasil dihapus",
    };
  }
}

export default UserService;
