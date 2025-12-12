import { Router } from "express";
import * as controller from "../controllers/sweetsController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth, controller.createSweet);
router.get("/", requireAuth, controller.listSweets);
router.get("/search", requireAuth, controller.searchSweets);

export default router;
