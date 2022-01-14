import { Router, Request, Response, NextFunction } from "express";

import Controller from "../../shared/Controller";
import ProductData from "../application/ProductData";
import AddProductInteractor from "../application/AddProductInteractor";
import GetAllProductsInteractor from "../application/GetAllProductsInteractor";
import GetProductByIdInteractor from "../application/GetProductByIdInteractor";
import DeleteProductByIdInteractor from "../application/DeleteProductByIdInteractor";
import UpdateProductByIdInteractor from "../application/UpdateProductById";
import ProductService from "../domain/ProductService";

import ProductViewModel from "./ProductViewModel";
import { ProductCategory } from "product/domain/Product";

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
        const interactor = new GetAllProductsInteractor(this.productService);
        const result = await interactor.execute();

        const allProducts = result.map((product) => ProductViewModel.fromData(product));

        res.status(200).json({ success: true, data: allProducts });
    };

    private getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        // TODO: validate
        const data = { productId: id };

        const interactor = new GetProductByIdInteractor(data, this.productService);
        const result = await interactor.execute();

        if (!result) {
            res.status(404).json({ success: false });
            return;
        }

        const product = ProductViewModel.fromData(result);

        res.status(200).json({ success: true, data: product });
    };

    private addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            title,
            description,
            price,
            imageUrl,
            category,
            stock,
        }: {
            title: string;
            description: string;
            price: number;
            imageUrl: string;
            category: ProductCategory;
            stock: number;
        } = req.body;
        const userId = "bf889d9c59a9401ca581f5be"; // TODO: remove hardcoded

        const productData = new ProductData({
            title,
            description,
            price,
            imageUrl,
            category,
            stock,
        });
        const data = { productData, userId };

        const interactor = new AddProductInteractor(data, this.productService);
        const result = await interactor.execute();

        const newProduct = ProductViewModel.fromData(result);

        res.status(200).json({ success: true, data: newProduct });
    };

    private removeProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        // TODO: validate
        const data = { productId: id };

        const interactor = new DeleteProductByIdInteractor(data, this.productService);
        await interactor.execute();

        res.status(200).json({ success: true });
    };

    private updateProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const {
            title,
            description,
            price,
            imageUrl,
            category,
            stock,
        }: {
            title: string;
            description: string;
            price: number;
            imageUrl: string;
            category: ProductCategory;
            stock: number;
        } = req.body;

        const productData = new ProductData({ title, description, price, imageUrl, category, stock });
        // TODO: validate
        const data = { productId: id, productData };

        const interactor = new UpdateProductByIdInteractor(data, this.productService);
        const result = await interactor.execute();

        if (!result) {
            res.status(404).json({ success: false });
            return;
        }

        const updatedProduct = ProductViewModel.fromData(result);

        res.status(200).json({ success: true, data: updatedProduct });
    };
}

export default ProductController;
