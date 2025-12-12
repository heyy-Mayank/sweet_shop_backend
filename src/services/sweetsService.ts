import prisma from "../prisma";

export async function createSweet(input: { name: string; category: string; price: number; quantity: number }) {
  const sweet = await prisma.sweet.create({ data: input });
  return sweet;
}

export async function listSweets() {
  return prisma.sweet.findMany({ orderBy: { id: "asc" } });
}

export async function searchSweets(opts: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) {
  const all = await prisma.sweet.findMany();
  return all.filter((s) => {
    if (opts.name && !s.name.toLowerCase().includes(opts.name.toLowerCase())) return false;
    if (opts.category && s.category.toLowerCase() !== opts.category.toLowerCase()) return false;
    if (opts.minPrice != null && s.price < opts.minPrice) return false;
    if (opts.maxPrice != null && s.price > opts.maxPrice) return false;
    return true;
  });
}

export async function purchaseSweet(id: number) {
  
  return prisma.$transaction(async (tx) => {
    const sweet = await tx.sweet.findUnique({ where: { id } });
    if (!sweet) {
      const e: any = new Error("Sweet not found");
      e.status = 404;
      throw e;
    }
    if (sweet.quantity <= 0) {
      const e: any = new Error("Out of stock");
      e.status = 400;
      throw e;
    }
    const updated = await tx.sweet.update({ where: { id }, data: { quantity: sweet.quantity - 1 } });
    return updated;
  });
}

export async function restockSweet(id: number, amount: number) {
  return prisma.$transaction(async (tx) => {
    const sweet = await tx.sweet.findUnique({ where: { id } });
    if (!sweet) {
      const e: any = new Error("Sweet not found");
      e.status = 404;
      throw e;
    }
    const updated = await tx.sweet.update({ where: { id }, data: { quantity: sweet.quantity + amount } });
    return updated;
  });
}
