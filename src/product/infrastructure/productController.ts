import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { body, param } from "express-validator";

import Controller from "../../shared/Controller";
import isAuth from "../../shared/middlewares/isAuth";
import ProductData from "../application/ProductData";
import CreateProductInteractor from "../application/CreateProductInteractor";
import GetAllProductsInteractor from "../application/GetAllProductsInteractor";
import GetProductByIdInteractor from "../application/GetProductByIdInteractor";
import DeleteProductByIdInteractor from "../application/DeleteProductByIdInteractor";
import UpdateProductByIdInteractor from "../application/UpdateProductByIdInteractor";
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
        this.router.get(`${this.path}/:id`, param("id").notEmpty().isUUID(), this.getProductById);
        this.router.post(
            this.path,
            isAuth,
            [
                body("title").notEmpty().isString().isLength({ min: 5 }).trim(),
                body("description").notEmpty().isString().isLength({ min: 10, max: 400 }).trim(),
                body("price").notEmpty().isNumeric(),
                body("imageUrl").notEmpty().isURL(),
                body("category")
                    .notEmpty()
                    .custom((value) => {
                        // TODO: remove hardcoded
                        if (
                            value !== "Electronics" &&
                            value !== "Cameras" &&
                            value !== "Laptops" &&
                            value !== "Accessories" &&
                            value !== "Headphones" &&
                            value !== "Food" &&
                            value !== "Books" &&
                            value !== "Clothes/Shoes" &&
                            value !== "Beauty/Health" &&
                            value !== "Sports" &&
                            value !== "Outdoor" &&
                            value !== "Home"
                        ) {
                            // TODO: remove hardcoded
                            throw new Error("Invalid category input");
                        }
                        return true;
                    }),
                body("stock").notEmpty().isNumeric(),
            ],
            this.createProduct
        );
        this.router.delete(`${this.path}/:id`, isAuth, param("id").notEmpty().isUUID(), this.removeProductById);
        this.router.put(
            `${this.path}/:id`,
            isAuth,
            [
                param("id").notEmpty().isUUID(),
                body("title").isString().isLength({ min: 5 }).trim(),
                body("description").isString().isLength({ min: 10, max: 400 }).trim(),
                body("price").isNumeric(),
                body("imageUrl").isURL(),
                body("category").custom((value) => {
                    // TODO: remove hardcoded
                    if (
                        value !== "Electronics" &&
                        value !== "Cameras" &&
                        value !== "Laptops" &&
                        value !== "Accessories" &&
                        value !== "Headphones" &&
                        value !== "Food" &&
                        value !== "Books" &&
                        value !== "Clothes/Shoes" &&
                        value !== "Beauty/Health" &&
                        value !== "Sports" &&
                        value !== "Outdoor" &&
                        value !== "Home"
                    ) {
                        // TODO: remove hardcoded
                        throw new Error("Invalid category input");
                    }
                    return true;
                }),
                body("stock").isNumeric(),
            ],
            this.updateProductById
        );
    };

    private getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const interactor = new GetAllProductsInteractor(this.productService);
        const result = await interactor.execute();

        const allProducts = result.map((product) => ProductViewModel.fromData(product));

        res.status(httpStatus.OK).json({ success: true, data: allProducts });
    };

    private getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;

        const data = { productId: id };

        const interactor = new GetProductByIdInteractor(this.productService);
        const result = await interactor.execute(data);

        if (!result) {
            res.status(httpStatus.NOT_FOUND).json({ success: false });
            return;
        }

        const product = ProductViewModel.fromData(result);

        res.status(httpStatus.OK).json({ success: true, data: product });
    };

    private createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // TODO: add validations

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
        const userId = "79ab1f50-5d32-4cb4-aeea-76fec5e5cc91"; // TODO: remove hardcoded

        const productData = new ProductData({
            title,
            description,
            price,
            imageUrl,
            category,
            stock,
        });
        const data = { productData, userId };

        const interactor = new CreateProductInteractor(this.productService);
        const result = await interactor.execute(data);

        const newProduct = ProductViewModel.fromData(result);

        res.status(httpStatus.OK).json({ success: true, data: newProduct });
    };

    private removeProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;

        const data = { productId: id };

        const interactor = new DeleteProductByIdInteractor(this.productService);
        await interactor.execute(data);

        res.status(httpStatus.OK).json({ success: true });
    };

    private updateProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // TODO: add validations

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

        const data = { productId: id, productData };

        const interactor = new UpdateProductByIdInteractor(this.productService);
        const result = await interactor.execute(data);

        if (!result) {
            res.status(httpStatus.NOT_FOUND).json({ success: false });
            return;
        }

        const updatedProduct = ProductViewModel.fromData(result);

        res.status(httpStatus.OK).json({ success: true, data: updatedProduct });
    };
}

export default ProductController;
