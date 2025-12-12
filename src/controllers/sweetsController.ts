import { Request, Response } from "express";
import * as service from "../services/sweetsService";
import { AuthRequest } from "../middleware/authMiddleware";

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

export async function purchaseSweet(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "invalid id" });

  try {
    const updated = await service.purchaseSweet(id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(err.status || 400).json({ error: err.message || "purchase failed" });
  }
}

export async function restockSweet(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const amount = Number(req.body.amount);
  if (Number.isNaN(id) || Number.isNaN(amount) || amount <= 0) return res.status(400).json({ error: "invalid id or amount" });

  
  if (!req.user || req.user.role !== "ADMIN") return res.status(403).json({ error: "forbidden" });

  try {
    const updated = await service.restockSweet(id, amount);
    return res.json(updated);
  } catch (err: any) {
    return res.status(err.status || 400).json({ error: err.message || "restock failed" });
  }
}