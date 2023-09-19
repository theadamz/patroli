import { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "@modules/auth/services/auth.service";
import {
  AuthLoginRequestSchema,
  AuthRefreshTokenParametersSchema,
  UpdatePasswordRequestSchema,
} from "@modules/auth/schemas/auth.schema";
import UserService from "@modules/application/services/user.service";
import { verifyPassword } from "@utilities/hashPassword";
import config from "@root/config";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@root/utilities/joseJWTAuth";
import { csrfGenerateToken } from "@root/utilities/csrf";
import { app } from "@root/app";
import { getActorId, getUserInfoByPublicId } from "@root/utilities/appHelper";

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

    // if user not active
    if (user.is_active === false) {
      return reply.unauthorized("Email or password invalid");
    }

    const passwordHash: string = user.password ?? "";

    // check password
    const correctPassword = await verifyPassword(input.password, passwordHash);
    if (!correctPassword) {
      return reply.unauthorized("Email or password invalid");
    }

    // create log
    await service.createUserLog(user.id, input.platform);

    // hapus semua token
    await service.clearUserToken(user.id);

    // generate refresh token
    const refreshToken = await generateRefreshToken({
      id: user.public_id,
      actor: user.actor,
      actor_id:
        user.actor !== "operator"
          ? await getActorId(user.id, user.actor)
          : user.public_id,
    });

    // register request
    app.request.auth = {
      id: user.public_id,
      user: await getUserInfoByPublicId(user.public_id),
      payload: {
        id: user.public_id,
        actor: user.actor,
        actor_id:
          user.actor !== "operator"
            ? await getActorId(user.id, user.actor)
            : user.public_id,
      },
      token: refreshToken,
    };

    // prepare response
    let response = {
      public_id: user.public_id,
      email: user.email,
      name: user.name,
      actor: user.actor,
      role_code: user.role_code,
      role_name: user.role_name,
      token: {
        refresh: refreshToken,
      },
      login_time: new Date(),
    };

    let replyToClient = reply.setCookie(
      config.TOKEN_REFRESH_NAME,
      refreshToken
    );

    // if use access token
    if (config.TOKEN_ACCESS === true) {
      // generate access token
      const accessToken = await generateAccessToken({
        id: user.public_id,
        actor: user.actor,
        actor_id:
          user.actor !== "operator"
            ? await getActorId(user.id, user.actor)
            : user.public_id,
      });

      response = {
        ...response,
        ...{ token: { ...response.token, ...{ access: accessToken } } },
      };

      replyToClient.setCookie(config.TOKEN_ACCESS_NAME, accessToken);
    }

    // if use csrf
    if (config.TOKEN_CSRF === true) {
      // generate csrf token
      const csrfToken = await csrfGenerateToken();

      response = {
        ...response,
        ...{
          token: { ...response.token, ...{ csrf: csrfToken } },
        },
      };

      replyToClient.setCookie(config.TOKEN_CSRF_NAME, csrfToken);
    }

    return replyToClient.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function refreshTokenHandler(
  request: FastifyRequest<{
    Params: AuthRefreshTokenParametersSchema;
  }>,
  reply: FastifyReply
) {
  try {
    // get input
    const params = request.params;

    // token jwt access
    if (params.type === "access" && config.TOKEN_ACCESS === true) {
      // generate access token
      const accessToken = await generateAccessToken({
        id: request.auth.id,
        actor: request.auth.payload.actor,
        actor_id: request.auth.payload.actor_id,
      });

      // set cookie
      reply.setCookie(config.TOKEN_ACCESS_NAME, accessToken);

      return reply.code(201).send({ token: accessToken });
    }

    // token csrf
    if (params.type === "csrf" && config.TOKEN_CSRF === true) {
      // generate csrf token
      const csrfToken = await csrfGenerateToken();

      // set cookie
      reply.setCookie(config.TOKEN_CSRF_NAME, csrfToken);

      return reply.code(201).send({ token: csrfToken });
    }

    return reply.code(404).send({ message: "No token generated" });
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function profileHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const profile = await userService.getUserProfileById(request.auth.user.id);

    return reply.code(200).send(profile);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function updatePasswordHandler(
  request: FastifyRequest<{ Body: UpdatePasswordRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get input
    const input = request.body;

    // ambil user
    const user = await userService.getUserById(request.auth.user.id, true);
    if (user === null) {
      return reply.code(404).send({ message: "User not found" });
    }

    // compare password
    const isOldPassOk = await verifyPassword(
      input.old_password,
      user.password ?? ""
    );
    if (!isOldPassOk) {
      return reply.code(400).send({ message: "Please check your password" });
    }

    // update password user
    await userService.updatePassword(input.new_password, request.auth.user.id);

    return reply.code(200).send({ message: "Password successfuly updated" });
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}
