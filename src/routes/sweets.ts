import { Router } from "express";
import * as controller from "../controllers/sweetsController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth, controller.createSweet);
router.get("/", requireAuth, controller.listSweets);
router.get("/search", requireAuth, controller.searchSweets);


router.post("/:id/purchase", requireAuth, controller.purchaseSweet);
router.post("/:id/restock", requireAuth, controller.restockSweet);

export default router;
