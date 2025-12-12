import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/prisma";

let userToken: string;
let adminToken: string;
let sweetId: number;

beforeAll(async () => {
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();

  const s = await prisma.sweet.create({ data: { name: "TestSweet", category: "mithai", price: 1.5, quantity: 2 } });
  sweetId = s.id;

  await request(app).post("/api/auth/register").send({ name: "Buyer", email: "buyer@test.com", password: "buyerpass" });
  const resUser = await request(app).post("/api/auth/login").send({ email: "buyer@test.com", password: "buyerpass" });
  userToken = resUser.body.token;

  await request(app).post("/api/auth/register").send({ name: "Admin2", email: "admin2@test.com", password: "adminpass" });
  await prisma.user.updateMany({ where: { email: "admin2@test.com" }, data: { role: "ADMIN" } });
  const resAdmin = await request(app).post("/api/auth/login").send({ email: "admin2@test.com", password: "adminpass" });
  adminToken = resAdmin.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Inventory: purchase & restock", () => {
  test("POST /api/sweets/:id/purchase - decrements quantity and blocks when 0", async () => {
    const r1 = await request(app).post(`/api/sweets/${sweetId}/purchase`).set("Authorization", `Bearer ${userToken}`).send();
    expect(r1.status).toBe(200);
    expect(r1.body).toHaveProperty("quantity", 1);

    const r2 = await request(app).post(`/api/sweets/${sweetId}/purchase`).set("Authorization", `Bearer ${userToken}`).send();
    expect(r2.status).toBe(200);
    expect(r2.body).toHaveProperty("quantity", 0);

    const r3 = await request(app).post(`/api/sweets/${sweetId}/purchase`).set("Authorization", `Bearer ${userToken}`).send();
    expect(r3.status).toBe(400);
  });

  test("POST /api/sweets/:id/restock - admin only, increases quantity", async () => {
    const asUser = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect([401, 403].includes(asUser.status)).toBeTruthy();

    const asAdmin = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(asAdmin.status).toBe(200);
    expect(asAdmin.body).toHaveProperty("quantity");
    expect(asAdmin.body.quantity).toBeGreaterThanOrEqual(5);
  });
});
