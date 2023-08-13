import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import config from "./config";
import { generateAccessToken } from "./joseJWTAuth";
import { UserInfo } from "../modules/auth/schemas/auth.schema";
import { csrfGenerateToken } from "./csrf";
import { MenuAccessType } from "@root/modules/application/schemas/menu.schema";

// declare extends module fastify
declare module "fastify" {
  export interface FastifyInstance {
    request: FastifyRequest;
    reply: FastifyReply;
    rootPath: string;
  }
}

declare module "fastify" {
  export interface FastifyRequest {
    auth: {
      id: string;
      user: UserInfo;
      payload: any;
      token: string;
    };
    menu_code: string;
    menu_permission: MenuAccessType;
  }
}

export default async function registerHooks(
  server: FastifyInstance,
  rootPath: string
) {
  // Set rootPath
  server.rootPath = rootPath;

  // hooks request & reply
  await setRequestAndReplyToInstance(server);

  // response token
  await responseTokens(server);
}

const setRequestAndReplyToInstance = async (server: FastifyInstance) => {
  await server.addHook(
    "onRequest",
    async function (request: FastifyRequest, reply: FastifyReply) {
      server.request = request;
      server.reply = reply;
    }
  );
};

const responseTokens = async (server: FastifyInstance) => {
  await server.addHook(
    "onSend",
    async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
      // if use token access and user not undefined
      if (
        config.TOKEN_ACCESS &&
        request.auth !== undefined &&
        request.raw.url !== "/login" &&
        reply.raw.statusCode < 300
      ) {
        // generate access token
        const accessToken = await generateAccessToken({
          id: request.auth.id,
        });

        // Set cookie
        reply.setCookie(config.TOKEN_ACCESS_NAME, accessToken);
      }

      // if use token csrf
      if (
        config.TOKEN_CSRF &&
        config.TOKEN_CSRF_REGENERATE &&
        config.TOKEN_CSRF_REGENERATE_FLAG &&
        request.auth !== undefined &&
        request.raw.url !== "/login" &&
        reply.raw.statusCode < 300
      ) {
        // generate csrf token
        const csrfToken = await csrfGenerateToken();

        // Set cookie
        reply.setCookie(config.TOKEN_CSRF_NAME, csrfToken);
      }
    }
  );
};
