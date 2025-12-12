// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // create an admin user (password: adminpass) - we'll hash it later in auth step,
  // for seed keep a placeholder passwordHash to identify admin user for local dev
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash: "adminpass-hash-placeholder",
      role: "ADMIN",
    },
  });

  // create sample sweets
  const sweets = [
    { name: "Gulab Jamun", category: "mithai", price: 1.5, quantity: 12 },
    { name: "Chocolate Bar", category: "chocolates", price: 2.0, quantity: 5 },
    { name: "Rasgulla", category: "mithai", price: 1.2, quantity: 0 }, // out of stock
  ];

  for (const s of sweets) {
    await prisma.sweet.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
