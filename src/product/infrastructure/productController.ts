import { Request, Response, NextFunction } from "express";

import Product from "../../product/domain/product";
import User from "../../user/domain/user";

const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findByPk(1); // TODO: remove hardcoded
    const allProducts = await user.getProducts();

    res.status(200).json({ success: true, data: allProducts });
};

const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByPk(1); // TODO: remove hardcoded
    const product = await user.getProducts({ where: { id } });

    if (!product) {
        res.status(404).json({ success: false });
        return;
    }

    res.status(200).json({ success: true, data: product });
};

const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, description, price, imageUrl, category, stock } = req.body;
    const ratings = 0;

    const user = await User.findByPk(1); // TODO: remove hardcoded
    const newProduct = await Product.create({
        title,
        description,
        price,
        imageUrl,
        ratings,
        category,
        stock,
    });

    await user.addProducts(newProduct);
    res.status(200).json({ success: true, data: newProduct });
};

const removeProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const productToDelete = await Product.findByPk(id);
    await productToDelete.destroy();

    res.status(200).json({ success: true });
};

const updateProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { title, description, price, imageUrl, category, stock } = req.body;

    const user = await User.findByPk(1); // TODO: remove hardcoded
    const updatedProducts = await user.getProducts({ where: { id } });

    if (!updatedProducts) {
        res.status(404).json({ success: false });
        return;
    }

    const updatedProduct = updatedProducts[0];

    updatedProduct.title = title;
    updatedProduct.description = description;
    updatedProduct.price = price;
    updatedProduct.imageUrl = imageUrl;
    updatedProduct.category = category;
    updatedProduct.stock = stock;
    await updatedProduct.save();

    res.status(200).json({ success: true, data: updatedProduct });
};

export { getProducts, getProductById, addProduct, removeProductById, updateProductById };
