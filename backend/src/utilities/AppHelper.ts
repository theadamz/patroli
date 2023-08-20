import prisma from "./prisma";
import { UserInfo } from "@modules/application/schemas/commons";

export const getUserInfoByPublicId = async (
  public_id: string
): Promise<UserInfo> => {
  const user = await prisma.user.findUnique({
    where: {
      public_id,
    },
    select: {
      id: true,
      public_id: true,
      email: true,
      role_id: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    id: user!.id,
    public_id: user!.public_id,
    email: user!.email,
    role_id: user!.role_id,
    role_name: user!.role.name,
  };
};

export const getActorId = async (
  user_id: string,
  actor: "officer" | "citizen"
): Promise<string> => {
  if (actor === "citizen") {
    const citizen = await prisma.citizen.findUnique({
      where: {
        user_id: user_id,
      },
    });

    return citizen!.id;
  } else {
    const officer = await prisma.officer.findUnique({
      where: {
        user_id: user_id,
      },
    });

    return officer!.id;
  }
};
