import { Router, Request, Response, NextFunction } from "express";

import Controller from "../../shared/Controller";
import Product from "./product";
import User from "../../user/infrastructure/user";

class ProductController implements Controller {
    public path = "/products";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.get(this.path, this.getProducts);
        this.router.get(`${this.path}/:id`, this.getProductById);
        this.router.post(this.path, this.addProduct);
        this.router.delete(`${this.path}/:id`, this.removeProductById);
        this.router.put(`${this.path}/:id`, this.updateProductById);
    };

    private getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const allProducts = await Product.findAll();

        res.status(200).json({ success: true, data: allProducts });
    };

    private getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ success: false });
            return;
        }

        res.status(200).json({ success: true, data: product });
    };

    private addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    private removeProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const productToDelete = await Product.findByPk(id);
        await productToDelete.destroy();

        res.status(200).json({ success: true });
    };

    private updateProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { title, description, price, imageUrl, category, stock } = req.body;

        const updatedProducts = await Product.findOne({ where: { id } });

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
}

export default ProductController;
