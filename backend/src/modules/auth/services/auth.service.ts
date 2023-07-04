import httpErrors from "http-errors";
import UserRepository from "../../app/repositories/user.repository";
import {
  AuthLoginRequestSchema,
  AuthLoginResponseSchema,
} from "../schemas/auth.schema";
import { comparePassword } from "../../../utilities/hashPassword";

export default class AuthService {
  protected repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async login(input: AuthLoginRequestSchema): Promise<AuthLoginResponseSchema> {
    // get data
    const user = await this.repository.getUserByEmail(input.email);

    // if user null
    if (user === null) {
      return {
        statusCode: httpErrors.NotFound().statusCode,
        message: "Email atau password salah.",
      };
    }

    // check password
    const correctPassword = await comparePassword(
      input.password,
      user.password
    );
    if (!correctPassword) {
      return {
        statusCode: httpErrors.Unauthorized().statusCode,
        message: "Email atau password salah.",
      };
    }

    // generate token
    const accessToken = "";
    const refreshToken = "";

    return {
      statusCode: 200,
      message: "Data ditemukan.",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }
}
