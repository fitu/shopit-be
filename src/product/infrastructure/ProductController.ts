import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { body, param, query, validationResult } from "express-validator";

import Controller from "../../shared/Controller";
import isAuthMiddleware from "../../shared/middlewares/isAuthMiddleware";
import fileUploadMiddleware from "../../shared/middlewares/fileUploaderMiddleware";
import Page, { getPageAndItemsPerPage } from "../../shared/Page";
import { generateImageUploaderConfig } from "../../shared/utils/imageUtils";
import ProductData from "../application/ProductData";
import CreateProductInteractor from "../application/CreateProductInteractor";
import GetAllProductsInteractor from "../application/GetAllProductsInteractor";
import GetProductByIdInteractor from "../application/GetProductByIdInteractor";
import DeleteProductByIdInteractor from "../application/DeleteProductByIdInteractor";
import UpdateProductByIdInteractor from "../application/UpdateProductByIdInteractor";
import ProductService from "../domain/ProductService";
import { ProductCategory } from "../domain/Product";
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
        this.router.get(
            this.path,
            [
                query('page').isNumeric().optional({ nullable: true }),
                query('itemsPerPage').isNumeric().optional({ nullable: true }),
            ],
            this.getProducts
        );
        this.router.get(
            `${this.path}/:id`,
            param('id').notEmpty().isUUID(), 
            this.getProductById
        );
        this.router.post(
            this.path,
            isAuthMiddleware,
            fileUploadMiddleware.fileUpload(generateImageUploaderConfig()).single('image'),
            [
                body('title').notEmpty().isString().isLength({ min: 5 }).trim(),
                body('description').notEmpty().isString().isLength({ min: 10, max: 400 }).trim(),
                body('price').notEmpty().isNumeric(),
                body('category')
                    .notEmpty()
                    .custom((value) => {
                        // TODO: remove hardcoded
                        if (
                            value !== 'Electronics' &&
                            value !== 'Cameras' &&
                            value !== 'Laptops' &&
                            value !== 'Accessories' &&
                            value !== 'Headphones' &&
                            value !== 'Food' &&
                            value !== 'Books' &&
                            value !== 'Clothes/Shoes' &&
                            value !== 'Beauty/Health' &&
                            value !== 'Sports' &&
                            value !== 'Outdoor' &&
                            value !== 'Home'
                        ) {
                            // TODO: remove hardcoded
                            throw new Error('Invalid category input');
                        }
                        return true;
                    }),
                body('stock').notEmpty().isNumeric(),
            ],
            this.createProduct
        );
        this.router.delete(
            `${this.path}/:id`,
            isAuthMiddleware,
            param('id').notEmpty().isUUID(),
            this.removeProductById
        );
        this.router.put(
            `${this.path}/:id`,
            isAuthMiddleware,
            fileUploadMiddleware.fileUpload(generateImageUploaderConfig()).single('image'),
            [
                param('id').notEmpty().isUUID(),
                body('title').isString().isLength({ min: 5 }).trim(),
                body('description').isString().isLength({ min: 10, max: 400 }).trim(),
                body('price').isNumeric(),
                body('imageUrl').isString(),
                body('category').custom((value) => {
                    // TODO: remove hardcoded
                    if (
                        value !== 'Electronics' &&
                        value !== 'Cameras' &&
                        value !== 'Laptops' &&
                        value !== 'Accessories' &&
                        value !== 'Headphones' &&
                        value !== 'Food' &&
                        value !== 'Books' &&
                        value !== 'Clothes/Shoes' &&
                        value !== 'Beauty/Health' &&
                        value !== 'Sports' &&
                        value !== 'Outdoor' &&
                        value !== 'Home'
                    ) {
                        // TODO: remove hardcoded
                        throw new Error('Invalid category input');
                    }
                    return true;
                }),
                body('stock').isNumeric(),
            ],
            this.updateProductById
        );
    };

    private getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const validations = validationResult(req);
        if (!validations.isEmpty()) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, error: validations.array()})
            return;
        }

        const [page, itemsPerPage] = getPageAndItemsPerPage(req);

        const interactor = new GetAllProductsInteractor(this.productService);
        const result = await interactor.execute(page, itemsPerPage);

        const productsWithMetadata = result as Page<Array<ProductData>>;
        const allProducts = {
            ...productsWithMetadata,
            data: productsWithMetadata.data.map((product) => ProductViewModel.fromData(product)),
        };

        res.status(httpStatus.OK).json({ success: true, ...allProducts });
    };

    private getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const validations = validationResult(req);
        if (!validations.isEmpty()) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, error: validations.array()})
            return;
        }

        const { id } = req.params;
        const data = { productId: id };

        try {
            const interactor = new GetProductByIdInteractor(this.productService);
            const result = await interactor.execute(data);
            const product = ProductViewModel.fromData(result);
            res.status(httpStatus.OK).json({ success: true, data: product });
        } catch (error: any) {
            res.status(httpStatus.NOT_FOUND).json({ success: false, error: error.message });
        }
    };

    private createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            title,
            description,
            price,
            category,
            stock,
        }: {
            title: string;
            description: string;
            price: number;
            category: ProductCategory;
            stock: number;
        } = req.body;
        const validations = validationResult(req);
        if (!validations.isEmpty()) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, error: validations.array()})
            return;
        }

        const imageUri = req.file?.filename;
        if (!imageUri) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, error: 'There was an error with the image' });
            return;
        }

        const userId = '79ab1f505d324cb4aeea76fe'; // TODO: remove hardcoded
        const productData = new ProductData({
            title,
            description,
            price,
            imageUrl: imageUri,
            category,
            stock,
        });
        const data = { productData, userId };

        const interactor = new CreateProductInteractor(this.productService);
        const result = await interactor.execute(data);

        const newProduct = ProductViewModel.fromData(result);

        res.status(httpStatus.CREATED).json({ success: true, data: newProduct });
    };

    private removeProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const validations = validationResult(req);
        if (!validations.isEmpty()) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, error: validations.array()})
            return;
        }

        const { id } = req.params;
        const data = { productId: id };

        try {
            const interactor = new DeleteProductByIdInteractor(this.productService);
            await interactor.execute(data);
            res.status(httpStatus.OK).json({ success: true });
        } catch (error: any) {
            res.status(httpStatus.NOT_FOUND).json({ success: false, error: error.message });
        }
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
        const validations = validationResult(req);
        if (!validations.isEmpty()) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, error: validations.array()})
            return;
        }

        const imageUri = req.file?.filename;
        if (!imageUri) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, error: 'There was an error with the image' });
            return;
        }

        const productData = new ProductData({ title, description, price, imageUrl, category, stock });
        const data = { productId: id, productData };

        try {
            const interactor = new UpdateProductByIdInteractor(this.productService);
            const result = await interactor.execute(data);
            const updatedProduct = ProductViewModel.fromData(result);
            res.status(httpStatus.OK).json({ success: true, data: updatedProduct });
        } catch (error: any) {
            res.status(httpStatus.NOT_FOUND).json({ success: false, error: error.message });
        }
    };
}


    // TODO: validate ID
    // TODO: validate image for update
    // TODO: errors with messages and translated

export default ProductController;
