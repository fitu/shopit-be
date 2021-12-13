import express from "express";

import { getCart, addProductToCart, deleteProductFromCart } from "../controllers/cartController";

const router = express.Router();

router.get("/", getCart);
router.post("/", addProductToCart);
router.delete("/", deleteProductFromCart);

export default router;
