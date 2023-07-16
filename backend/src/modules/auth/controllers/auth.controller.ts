import { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "@modules/auth/services/auth.service";
import { AuthLoginRequestSchema } from "@modules/auth/schemas/auth.schema";
import UserService from "@modules/application/services/user.service";
import { comparePassword } from "@utilities/hashPassword";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utilities/jwtTokens";

// Service
const service = new AuthService();
const userService = new UserService();

export async function loginHandler(
  request: FastifyRequest<{ Body: AuthLoginRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get input
    const input = request.body;

    // get user by email
    const user = await userService.getUserByEmail(input.email, true);

    // if user not found
    if (user === null) {
      return reply.unauthorized("Email or password invalid");
    }

    const passwordHash: string =
      user.password === undefined || user.password === null
        ? ""
        : user.password;

    // check password
    const isGoodPassword = await comparePassword(input.password, passwordHash);
    if (!isGoodPassword) {
      return reply.unauthorized("Email or password invalid");
    }

    // create log
    const log = service.createUserLog(user.id, "web");

    // generate refresh token
    const refreshToken = await generateRefreshToken({ id: user.id });

    // generate access token
    const accessToken = await generateAccessToken({ id: user.id });

    // prepare response
    const response = {
      email: user.email,
      name: user.name,
      role_name: user.role_name,
      token: accessToken,
    };

    return reply
      .setCookie("_refreshToken", refreshToken, {
        httpOnly: true,
      })
      .code(200)
      .send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}
