import express from "express";

const app = express();
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

export default app;
