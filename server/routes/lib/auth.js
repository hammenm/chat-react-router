import jwt from "jsonwebtoken";

const secret = "secret";

export const getAuthUser = async (req) => {
  const authorization = req.headers?.authorization;
  const token = authorization?.split(" ")[1];

  if (token) {
    return jwt.verify(token, secret);
  }
};

export const sign = (payload, options) =>
  jwt.sign(payload, secret, {
    expiresIn: "1d",
    ...options,
  });
