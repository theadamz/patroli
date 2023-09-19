import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import config from "@root/config";
import {
  checkPermissionVsMethod,
  getPermissionByMenuCode,
} from "@root/utilities/accessGuard";

// declare
declare module "fastify" {
  export interface FastifyInstance {
    accessGuard(options?: {
      menuCode?: string;
      checkMenuAccess?: boolean;
      checkMenuPermission?: boolean;
    }): any;
  }
}

// export const type = "no-instance";

export const main = async (fastify: FastifyInstance) => {
  fastify.decorate(
    "accessGuard",
    function (options?: {
      menuCode?: string;
      checkMenuAccess?: boolean;
      checkMenuPermission?: boolean;
    }) {
      return async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          // set default / orverride value
          const menuCode =
            options?.menuCode === undefined ? "" : options?.menuCode;
          const checkMenuAccess: boolean =
            options?.checkMenuAccess === undefined
              ? true
              : options?.checkMenuAccess;
          const checkMenuPermission: boolean =
            options?.checkMenuPermission === undefined
              ? true
              : options?.checkMenuPermission;

          // check if method not allowed
          if (!config.ALLOWED_METHOD.includes(request.method)) {
            return reply.code(405).send({ message: "Method not allowed" });
          }

          // check if access undefined
          if (menuCode === "") {
            return reply.code(403).send({
              message: "Access undefined, please contact your administrator",
            });
          }

          // Set menu_code
          request.menu_code = menuCode;

          // if check_menu_access === true
          if (checkMenuAccess === true) {
            // get permission menu by menu code and role_id
            const menuPermission = await getPermissionByMenuCode(
              request.menu_code,
              request.auth.user.role_id
            );

            // if permission not found
            if (menuPermission === null) {
              return reply.code(403).send({ message: "Access not found" });
            }

            // set request menu_permission
            request.menu_permission = menuPermission;

            // if options.check_permission === true
            if (checkMenuPermission === true) {
              // is permission allowed?
              const isAllowed = await checkPermissionVsMethod(
                request.menu_permission,
                request.method
              );

              if (!isAllowed) {
                return reply.code(403).send({ message: "Access not Allowed" });
              }
            }
          }
        } catch (e) {
          return reply.code(500).send(e);
        }
      };
    }
  );
};
