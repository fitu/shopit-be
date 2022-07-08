import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { body, param, query } from "express-validator";

import { ErrorHandler } from "../../shared/error/ErrorHandler";
import NotFoundError from "../../shared/error/NotFoundError";
import NotAllowError from "../../shared/error/NotAllowError";
import Controller from "../../shared/Controller";
import isValid from "../../shared/middlewares/validationMiddleware";
import isAuthMiddleware from "../../shared/middlewares/isAuthMiddleware";
import fileUploadMiddleware from "../../shared/middlewares/fileUploaderMiddleware";
import Page, { getPageAndItemsPerPage } from "../../shared/Page";
import { generateImageUploaderConfig } from "../../shared/utils/imageUtils";
import UserService from "../../user/domain/UserService";
import ProductData from "../application/ProductData";
import CreateProductInteractor, { CreateProductData } from "../application/CreateProductInteractor";
import GetAllProductsInteractor, { GetAllProductsData } from "../application/GetAllProductsInteractor";
import GetProductByIdInteractor, { GetProductByIdData } from "../application/GetProductByIdInteractor";
import DeleteProductByIdInteractor, { DeleteProductByIdData } from "../application/DeleteProductByIdInteractor";
import UpdateProductByIdInteractor, { UpdateProductByIdData } from "../application/UpdateProductByIdInteractor";
import ProductService from "../domain/ProductService";
import { ProductCategory, validProductCategories } from "../domain/Product";

import ProductViewModel from "./ProductViewModel";

class ProductController implements Controller {
    /*
     * Variables and constructor
     */

    public path = "/products";
    public router = Router();

    private productService: ProductService;
    private userService: UserService;

    constructor(productService: ProductService, userService: UserService) {
        this.initializeRoutes();

        this.productService = productService;
        this.userService = userService;
    }

    /*
     * Route's validations
     */

    private validations = {
        getOne: [param("id").notEmpty().isUUID()],
        getAll: [
            query("page").isNumeric().optional({ nullable: true }),
            query("itemsPerPage").isNumeric().optional({ nullable: true }),
        ],
        createOne: [
            body("title").notEmpty().isString().isLength({ min: 5 }).trim(),
            body("description").notEmpty().isString().isLength({ min: 10, max: 400 }).trim(),
            body("price").notEmpty().isNumeric(),
            body("category")
                .notEmpty()
                .custom((value) => {
                    if (!validProductCategories.includes(value)) {
                        // TODO: remove hardcoded
                        throw new Error("Invalid category input");
                    }
                    return true;
                }),
            body("stock").notEmpty().isNumeric(),
        ],
        updateOne: [
            param("id").notEmpty().isUUID(),
            body("title").isString().isLength({ min: 5 }).trim(),
            body("description").isString().isLength({ min: 10, max: 400 }).trim(),
            body("price").isNumeric(),
            body("imageUrl").isString(),
            body("category").custom((value) => {
                if (!validProductCategories.includes(value)) {
                    // TODO: remove hardcoded
                    throw new Error("Invalid category input");
                }
                return true;
            }),
            body("stock").isNumeric(),
        ],
        deleteOne: [param("id").notEmpty().isUUID()],
    };

    /*
     * Routes
     */

    private initializeRoutes = (): void => {
        this.router.get(this.path, this.validations.getAll, isValid, this.getProducts);
        this.router.get(`${this.path}/:id`, this.validations.getOne, isValid, this.getProductById);
        this.router.post(
            this.path,
            isAuthMiddleware,
            fileUploadMiddleware.fileUpload(generateImageUploaderConfig()).single("image"),
            this.validations.createOne,
            isValid,
            this.createProduct
        );
        this.router.delete(
            `${this.path}/:id`,
            isAuthMiddleware,
            this.validations.deleteOne,
            isValid,
            this.deleteProductById
        );
        this.router.put(
            `${this.path}/:id`,
            isAuthMiddleware,
            fileUploadMiddleware.fileUpload(generateImageUploaderConfig()).single("image"),
            this.validations.updateOne,
            isValid,
            this.updateProductById
        );
    };

    private getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const [page, itemsPerPage] = getPageAndItemsPerPage(req);
        const data: GetAllProductsData = { page, itemsPerPage };

        try {
            const interactor = new GetAllProductsInteractor(this.productService);
            const result = await interactor.execute(data);

            const productsWithMetadata = result as Page<Array<ProductData>>;
            const allProducts = {
                ...productsWithMetadata,
                data: productsWithMetadata.data.map((product) => ProductViewModel.fromData(product)),
            };

            res.status(httpStatus.OK).json({ success: true, ...allProducts });
        } catch (error: any) {
            next(error);
        }
    };

    private getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const data: GetProductByIdData = { productId: id };

        try {
            const interactor = new GetProductByIdInteractor(this.productService);
            const result = await interactor.execute(data);
            const product = ProductViewModel.fromData(result);
            res.status(httpStatus.OK).json({ success: true, data: product });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            next(error);
        }
    };

    // FIXME: not image url, use always an image
    private createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const imageUri = req.file?.filename;
        if (!imageUri) {
            // TODO: remove hardcoded
            next(new ErrorHandler(httpStatus.UNPROCESSABLE_ENTITY, "There was an error with the image"));
            return;
        }

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
        const userId = req.userId;
        const productData = new ProductData({
            title,
            description,
            price,
            imageUrl: imageUri,
            category,
            stock,
        });
        const data: CreateProductData = { productData, userId };

        try {
            const interactor = new CreateProductInteractor(this.productService);
            const result = await interactor.execute(data);

            const newProduct = ProductViewModel.fromData(result);

            res.status(httpStatus.CREATED).json({ success: true, data: newProduct });
        } catch (error: any) {
            next(error);
        }
    };

    private deleteProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { userId } = req;

        const data: DeleteProductByIdData = { productId: id, userId };

        try {
            const interactor = new DeleteProductByIdInteractor(this.productService, this.userService);
            await interactor.execute(data);
            res.status(httpStatus.OK).json({ success: true });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                const translatedMessage = req.t(error.message);
                next(new ErrorHandler(httpStatus.NOT_FOUND, translatedMessage));
                return;
            }
            if (error instanceof NotAllowError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error.message));
                return;
            }
            next(new Error(error));
        }
    };

    // FIXME: not image url, use always an image
    private updateProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const imageUri = req.file?.filename;
        if (!imageUri) {
            // TODO: remove hardcoded
            next(new ErrorHandler(httpStatus.UNPROCESSABLE_ENTITY, "There was an error with the image"));
            return;
        }

        const { id } = req.params;
        const { userId } = req;
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
        const data: UpdateProductByIdData = { productId: id, productData, userId };

        try {
            const interactor = new UpdateProductByIdInteractor(this.productService, this.userService);
            const result = await interactor.execute(data);
            const updatedProduct = ProductViewModel.fromData(result);
            res.status(httpStatus.OK).json({ success: true, data: updatedProduct });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error.message));
                return;
            }
            if (error instanceof NotAllowError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error.message));
                return;
            }
            next(new Error(error));
        }
    };
}

export default ProductController;
