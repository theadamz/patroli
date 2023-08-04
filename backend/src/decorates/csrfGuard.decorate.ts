import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import config from "@utilities/config";
import { csrfVerifyToken } from "@root/utilities/csrf";

// declare
declare module "fastify" {
  export interface FastifyInstance {
    csrfGuard: any;
  }
}

export const main = async (fastify: FastifyInstance) => {
  fastify.decorate(
    "csrfGuard",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // if token csrf are not used
        if (config.TOKEN_CSRF === false) return true;

        // set regenerate token flag = false
        config.TOKEN_CSRF_REGENERATE_FLAG = false;

        // get token from cookie
        // @ts-ignore
        const csrfToken: string =
          request.cookies[config.TOKEN_CSRF_NAME] === undefined ||
          request.cookies[config.TOKEN_CSRF_NAME] === null
            ? ""
            : request.cookies[config.TOKEN_CSRF_NAME];

        // if csrf empty
        if (csrfToken === "") {
          return reply.code(403).send({ message: "CSRF token not found" });
        }

        const csrfCheck = await csrfVerifyToken(csrfToken);

        if (typeof csrfCheck !== "boolean" || csrfCheck === false) {
          return reply.code(403).send({ message: "CSRF token invalid" });
        }

        // when everything valid then regenerate token csrf
        config.TOKEN_CSRF_REGENERATE_FLAG = true;
      } catch (e) {
        return reply.code(500).send(e);
      }
    }
  );
};
