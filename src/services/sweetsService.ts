import prisma from "../prisma";

export async function createSweet(input: { name: string; category: string; price: number; quantity: number }) {
  const sweet = await prisma.sweet.create({ data: input });
  return sweet;
}

export async function listSweets() {
  return prisma.sweet.findMany({ orderBy: { id: "asc" } });
}

export async function searchSweets(opts: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) {
  // Fetch all sweets then filter in-memory to avoid connector-specific query options.
  const all = await prisma.sweet.findMany();

  return all.filter((s) => {
    // name filter (case-insensitive substring)
    if (opts.name && !s.name.toLowerCase().includes(opts.name.toLowerCase())) return false;
    // category exact match (case-insensitive)
    if (opts.category && s.category.toLowerCase() !== opts.category.toLowerCase()) return false;
    // price range
    if (opts.minPrice != null && s.price < opts.minPrice) return false;
    if (opts.maxPrice != null && s.price > opts.maxPrice) return false;
    return true;
  });
}
