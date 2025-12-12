import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/prisma";

let token: string;

beforeAll(async () => {
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();

  // create a user and login to get token
  await request(app).post("/api/auth/register").send({ name: "S", email: "sweets@test.com", password: "pass1234" });
  const res = await request(app).post("/api/auth/login").send({ email: "sweets@test.com", password: "pass1234" });
  token = res.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Sweets endpoints", () => {
  test("POST /api/sweets - requires auth and creates sweet", async () => {
    // no token -> 401
    const noAuth = await request(app).post("/api/sweets").send({ name: "Ladoo", category: "mithai", price: 1.5, quantity: 10 });
    expect(noAuth.status).toBe(401);

    // with token -> 201
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Ladoo", category: "mithai", price: 1.5, quantity: 10 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "Ladoo");
  });

  test("GET /api/sweets - lists sweets", async () => {
    const res = await request(app).get("/api/sweets").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((s: any) => s.name === "Ladoo")).toBeTruthy();
  });

  test("GET /api/sweets/search - search by name and category and price range", async () => {
    // search by name partial
    const byName = await request(app).get("/api/sweets/search").query({ name: "lad" }).set("Authorization", `Bearer ${token}`);
    expect(byName.status).toBe(200);
    expect(byName.body.some((s: any) => s.name === "Ladoo")).toBeTruthy();

    // by category
    const byCat = await request(app).get("/api/sweets/search").query({ category: "mithai" }).set("Authorization", `Bearer ${token}`);
    expect(byCat.status).toBe(200);
    expect(byCat.body.length).toBeGreaterThanOrEqual(1);

    // price range
    const byPrice = await request(app).get("/api/sweets/search").query({ minPrice: 1, maxPrice: 2 }).set("Authorization", `Bearer ${token}`);
    expect(byPrice.status).toBe(200);
    expect(byPrice.body.some((s: any) => s.name === "Ladoo")).toBeTruthy();
  });
});
