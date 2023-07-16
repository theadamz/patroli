import prisma from "@utilities/prisma";
import { PlatformEnum } from "@modules/auth/schemas/auth.schema";

export default class AuthService {
  async createUserLog(user_id: string, platform: PlatformEnum) {
    const log = await prisma.users_logs.create({
      data: {
        user_id: user_id,
        platform: platform,
        created_at: new Date(),
      },
    });

    return log;
  }
}
