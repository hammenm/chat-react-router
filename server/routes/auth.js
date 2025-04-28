import { Router } from "express";
import prisma from "./lib/db.js";
import { sign } from "./lib/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const userCopied = { ...user };
  delete userCopied.password;

  res.status(200).json({
    user,
    token: sign(userCopied),
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });

  const userCopied = { ...user };
  delete userCopied.password;

  res.status(200).json({
    user,
    token: sign(userCopied),
  });
});

export default router;
