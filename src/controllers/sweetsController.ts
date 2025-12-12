import { Request, Response } from "express";
import * as service from "../services/sweetsService";

export async function createSweet(req: Request, res: Response) {
  const { name, category, price, quantity } = req.body;
  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ error: "name, category, price, quantity required" });
  }
  if (price < 0 || quantity < 0) return res.status(400).json({ error: "price/quantity must be non-negative" });
  try {
    const sweet = await service.createSweet({ name, category, price: Number(price), quantity: Number(quantity) });
    return res.status(201).json(sweet);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "create failed" });
  }
}

export async function listSweets(_req: Request, res: Response) {
  const sweets = await service.listSweets();
  return res.json(sweets);
}

export async function searchSweets(req: Request, res: Response) {
  const { name, category, minPrice, maxPrice } = req.query;
  const results = await service.searchSweets({
    name: name as string | undefined,
    category: category as string | undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });
  return res.json(results);
}
