// @ts-nocheck
import prisma from "./prisma";
import { UserInfo } from "@modules/auth/schemas/auth.schema";

export const getUserInfoByPublicId = async (
  public_id: string
): Promise<UserInfo> => {
  const user = await prisma.user.findUnique({
    where: {
      public_id: public_id,
    },
    include: {
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    id: user.id,
    public_id: user.public_id,
    email: user.email,
    role_id: user.role_id,
    role_name: user.role?.name,
  };
};
