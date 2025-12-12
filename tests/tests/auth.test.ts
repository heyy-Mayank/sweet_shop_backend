// tests/auth.test.ts
// tests/auth.test.ts
import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/prisma";


beforeAll(async () => {
  // ensure DB clean for tests
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth: register & login", () => {
  const user = { name: "Test User", email: "test@example.com", password: "pass1234" };

  test("POST /api/auth/register - validates input and creates user", async () => {
    // missing email -> 400
    const resMissing = await request(app).post("/api/auth/register").send({ name: "A", password: "x" });
    expect(resMissing.status).toBe(400);

    // valid register -> 201
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", user.email);
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  test("POST /api/auth/login - returns JWT on correct credentials", async () => {
    // wrong password -> 401
    const bad = await request(app).post("/api/auth/login").send({ email: user.email, password: "wrong" });
    expect(bad.status).toBe(401);

    // correct -> 200 and token
    const ok = await request(app).post("/api/auth/login").send({ email: user.email, password: user.password });
    expect(ok.status).toBe(200);
    expect(ok.body).toHaveProperty("token");
    expect(typeof ok.body.token).toBe("string");
  });
});
