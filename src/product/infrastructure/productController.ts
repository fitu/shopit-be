import { Router, Request, Response, NextFunction } from "express";

import Controller from "../../shared/Controller";
import ProductData from "../application/ProductData";
import AddProductInteractor from "../application/AddProductInteractor";
import ProductService from "../domain/ProductService";

import ProductDao from "./ProductDao";
import ProductViewModel from "./ProductViewModel";

class ProductController implements Controller {
    public path = "/products";
    public router = Router();

    private productService: ProductService;

    constructor(productService: ProductService) {
        this.initializeRoutes();
        this.productService = productService;
    }

    private initializeRoutes = (): void => {
        this.router.get(this.path, this.getProducts);
        this.router.get(`${this.path}/:id`, this.getProductById);
        this.router.post(this.path, this.addProduct);
        this.router.delete(`${this.path}/:id`, this.removeProductById);
        this.router.put(`${this.path}/:id`, this.updateProductById);
    };

    private getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const allProducts = await ProductDao.findAll();

        res.status(200).json({ success: true, data: allProducts });
    };

    private getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;

        const product = await ProductDao.findByPk(id);

        if (!product) {
            res.status(404).json({ success: false });
            return;
        }

        res.status(200).json({ success: true, data: product });
    };

    private addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { title, description, price, imageUrl, category, stock } = req.body;
        const userId = 1; // TODO: remove hardcoded

        const productData = new ProductData(title, description, price, imageUrl, category, stock);
        const data = {
            data: productData,
            userId,
        };

        const interactor = new AddProductInteractor(data, this.productService);
        const result = await interactor.execute();
        const newProduct = ProductViewModel.fromData(result);

        res.status(200).json({ success: true, data: newProduct });
    };

    private removeProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const productToDelete = await ProductDao.findByPk(id);
        await productToDelete.destroy();

        res.status(200).json({ success: true });
    };

    private updateProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { title, description, price, imageUrl, category, stock } = req.body;

        const updatedProducts = await ProductDao.findOne({ where: { id } });

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
