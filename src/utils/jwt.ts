import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
  object: Object,
  key: string,
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(key, "base64").toString("ascii");

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(token: string, key: string): T | null {
  const publicKey = Buffer.from(key, "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
