import prisma from "@utilities/prisma";
import { PlatformEnum } from "@modules/auth/schemas/auth.schema";

export default class AuthService {
  async createUserLog(user_id: string, platform: PlatformEnum) {
    const log = await prisma.user_log.create({
      data: {
        user_id: user_id,
        platform: platform,
        created_at: new Date(),
      },
    });

    return log;
  }

  async clearUserToken(user_id: string) {
    const tokens = await prisma.user_token.deleteMany({
      where: {
        user_id: user_id,
      },
    });

    return tokens;
  }
}
