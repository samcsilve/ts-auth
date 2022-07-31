import { signAccessToken, signRefreshToken } from "./../service/auth.service";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import prisma from "../utils/prisma";
import argon2 from "argon2";
import { get, omit } from "lodash";
import { verifyJwt } from "../utils/jwt";
import { Session } from "@prisma/client";

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

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = get(req, "headers.x-refresh");
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    process.env.REFRESH_TOKEN_PUBLIC_KEY as string
  );

  if (!decoded) {
    return res.status(401).send("Could not refresh access token");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: decoded.session,
    },
  });

  if (!session || !session.valid) {
    return res.status(401).send("Could not refresh access token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    return res.status(401).send("Could not refresh access token");
  }

  const userData = omit(user, "password")

  const accessToken = signAccessToken(userData);

  return res.send({accessToken});
};
