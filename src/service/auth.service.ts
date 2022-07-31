import { User } from "@prisma/client";
import { signJwt } from "../utils/jwt";
import prisma from "../utils/prisma";

export const createSession = async ({ userId }: { userId: string }) => {
  return await prisma.session.create({ data: { userId, valid: true } });
};

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({
    userId,
  });

  const refreshToken = signJwt(
    {
      session: session.id,
    },
    process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
    {
      expiresIn: "1y",
    }
  );

  return refreshToken;
}

export const signAccessToken = (user: Partial<User>) => {
  const accessToken = signJwt(
    user,
    process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  return accessToken;
};
