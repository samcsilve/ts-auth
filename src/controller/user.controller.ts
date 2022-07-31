import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import argon2 from "argon2";
import prisma from "../utils/prisma";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const body = req.body;
  const { password, ...rest } = body;
  const hashedPassword = await argon2.hash(password);

  try {
    await prisma.user.create({
      data: {
        password: hashedPassword,
        ...rest,
      },
    });

    return res.send("User created successfully");
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(401).send("Invalid credentials");
    }
    return res.status(500).send(error);
  }
};

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  return res.send(res.locals.user);
};
