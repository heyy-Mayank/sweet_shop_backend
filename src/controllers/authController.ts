import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }

  try {
    const user = await authService.registerUser({ name, email, password });
    const { passwordHash, ...rest } = user as any;
    return res.status(201).json(rest);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  try {
    const token = await authService.loginUser({ email, password });
    if (!token) return res.status(401).json({ error: "invalid credentials" });
    return res.json({ token });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "login failed" });
  }
}
