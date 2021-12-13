import express from "express";

import {
    getProducts,
    getProductById,
    addProduct,
    removeProductById,
    updateProductById,
} from "./productController";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", addProduct);
router.delete("/:id", removeProductById);
router.put("/:id", updateProductById);

export default router;
