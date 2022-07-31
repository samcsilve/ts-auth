import { signAccessToken, signRefreshToken } from "./../service/auth.service";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import prisma from "../utils/prisma";
import argon2 from "argon2";
import { omit } from "lodash";

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) => {
  const message = "Invalid credentials";
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.send(message);
  }

  const isValid = await argon2.verify(user.password, password);

  if (!isValid) {
    return res.send(message);
  }

  const userData = omit(user, "password");

  //   Sign an access token
  const accessToken = signAccessToken(userData);

  //   Sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user.id });
  //   Send the tokens
  return res.send({ accessToken, refreshToken });
};
