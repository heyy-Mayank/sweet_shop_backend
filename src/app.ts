import express from "express";
import cors from "cors";
import prisma from "./prisma";
import authRouter from "./routes/auth";
import sweetsRouter from "./routes/sweets";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.json({ 
    message: "Sweet Shop API", 
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      sweets: "/api/sweets",
      ping: "/ping"
    }
  });
});


// Health check
app.get("/ping", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Dev route for testing
app.get("/dev/sweets", async (_req, res) => {
  try {
    const sweets = await prisma.sweet.findMany();
    res.json({ ok: true, count: sweets.length, sweets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB error" });
  }
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/sweets", sweetsRouter);


export default app;
