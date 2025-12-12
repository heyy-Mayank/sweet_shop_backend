import express from "express";
import prisma from "./prisma";
import authRouter from "./routes/auth";
import sweetsRouter from "./routes/sweets";

const app = express();
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// dev-only: list sweets
app.get("/dev/sweets", async (_req, res) => {
  try {
    const sweets = await prisma.sweet.findMany();
    res.json({ ok: true, count: sweets.length, sweets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB error" });
  }
});

// auth and sweets routes
app.use("/api/auth", authRouter);
app.use("/api/sweets", sweetsRouter);

export default app;
