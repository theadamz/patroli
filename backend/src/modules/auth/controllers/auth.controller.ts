import { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "../services/auth.service";
import { AuthLoginRequestSchema } from "../schemas/auth.schema";

// Service
const service = new AuthService();

export async function loginHandler(
  request: FastifyRequest<{ Body: AuthLoginRequestSchema }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;
    const login = await service.login(input);
  } catch (e: any) {}
}
