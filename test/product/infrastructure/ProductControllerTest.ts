import httpStatus from "http-status";
import { expect } from "chai";
import supertest from "supertest";
import { Server } from "http";
import sinon, { SinonSandbox } from "sinon";
import { Response, NextFunction } from "express";

import ProductController from "../../../src/product/infrastructure/ProductController";
import ProductService from "../../../src/product/domain/ProductService";
import ProductViewModel from "../../../src/product/infrastructure/ProductViewModel";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import fileUploadMiddleware, { MulterRequest } from "../../../src/shared/middlewares/fileUploaderMiddleware";
import App from "../../../src/app";
import Page from "../../../src/shared/Page";
import { getRandomProduct, getRandomProductWithId } from "../../shared/utils/ProductFactory";
import { getMockPage } from "../../shared/utils/PageFactory";
import TestRequest from "../../shared/utils/requests";

describe("ProductController", function () {
    let service: ProductService;
    let server: Server;
    let api: TestRequest;
    let sandbox: SinonSandbox;

    before(async () => {
        service = <ProductService>{};
        const controller = new ProductController(service);
        const app = new App([controller]);
    
        await app.init();
        server = await app.listen();
        const testApi = await supertest(server);
        api = new TestRequest(testApi);
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(fileUploadMiddleware, "fileUpload").callsFake(
            (): any => {
              return {
                any() {
                  return (req: MulterRequest, res: Response, next: NextFunction) => {
                    req.files = [{ location: 'images', key: 'foo-' }];
                    next();
                  };
                },
              };
            },
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        server.close();
    });

    it("getProductById should return false and 404 if product not found", async function () {
        // Given
        const productId = 'foo';

        service.getProductById = async (productId: string): Promise<Product> => {
            throw new NotFoundError(productId);
        };

        // When
        const response = await api.get(`/products/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        // Expect
        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(error).to.be.not.undefined;
    });

    it("getProductById should return success and 200 if product found", async function () {
        // Given
        const productId = 'foo';

        service.getProductById = async (productId: string): Promise<Product> => {
            return getRandomProductWithId(productId);
        };

        // When
        const response = await api.get(`/products/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, data } = body;
        const productViewModel = data as ProductViewModel;

        // Expect
        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(productViewModel.id).to.be.equal(productId);
    });

    it("getProducts should return success, 200 and empty list if no products founds", async function () {
        // Given
        const products = [];

        service.getAllProducts = async (page?: number, itemsPerPage?: number): Promise<Page<Array<Product>>>  => {
            return getMockPage(products);
        };

        // When
        const response = await api.get('/products');

        // Then
        const {body, statusCode} = response;
        const {success, data, total} = body;
        const productViewModels = data as Array<ProductViewModel>;

        // Expect
        expect(success).to.be.true;
        expect(total).to.be.eq(0);
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(productViewModels).to.be.empty;
    });

    it("getProducts should return success, 200 and list with products", async function () {
        // Given
        const products = [getRandomProduct(), getRandomProduct()];

        service.getAllProducts = async (page?: number, itemsPerPage?: number): Promise<Page<Array<Product>>>  => {
            return getMockPage(products);
        };

        // When
        const response = await api.get('/products');

        // Then
        const {body, statusCode} = response;
        const {success, data, total} = body;

        const productViewModels = data as Array<ProductViewModel>;

        // Expect
        expect(success).to.be.true;
        expect(total).to.be.eq(2);
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(productViewModels.length).to.be.eq(2);
    });

    it("createProduct should return false and 422 if image is missing", async function () {
        // When
        const response = await api.post('/products');

        // Then
        const {body, statusCode} = response;
        const {success} = body;

        // Expect
        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("createProduct should return false and 501 if something went wrong", async function () {
        // Given
        service.create = async (product: Product, userId: string): Promise<Product> => {
            throw new Error();
        };

        // When
        const response = await api.post('/products');

        // Then
        const { body, statusCode } = response;
        const { success } = body;

        // Expect
        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("createProduct should return success and 200 if image is set", async function () {
        // Given
        const title = 'title';
        const description = 'description';
        const price = 11.11;
        const category = 'category';
        const stock = 1;
        const imageUrl = 'test/shared/fixtures/random.jpg';

        service.create = async (product: Product, userId: string): Promise<Product> => {
            return product;
        };
        
        // When
        const response = await api.post('/products')
            .field({
                title,
                description,
                price,
                category,
                stock
            })
            .attach('image', imageUrl);
        
        // Then
        const {body, statusCode} = response;
        const {success, data} = body;

        const productViewModel = data as ProductViewModel;

        // Expect
        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(productViewModel).to.contain(
            {
                title,
                description,
                price: price.toString(),
                category,
                stock: stock.toString(),
                ratings: 0
            }
        )
    });

    it.only("createProduct should return false and XXX if title is not set", async function () {
        // Given
        const description = 'description';
        const price = 11.11;
        const category = 'category';
        const stock = 1;
        const imageUrl = 'test/shared/fixtures/random.jpg';

        service.create = async (product: Product, userId: string): Promise<Product> => {
            return product;
        };
        
        // When
        const response = await api.post('/products')
            .field({
                description,
                price,
                category,
                stock
            })
            .attach('image', imageUrl);
        
        // Then
        const {body, statusCode} = response;
        const {success, data} = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.false;
       // expect(statusCode).to.be.equal(httpStatus.OK);
    });

    // body("title").notEmpty().isString().isLength({ min: 5 }).trim(),
    // body("description").notEmpty().isString().isLength({ min: 10, max: 400 }).trim(),
    // body("price").notEmpty().isNumeric(),
    // body("category")
    //     .notEmpty()
    //     .custom((value) => {
    //         // TODO: remove hardcoded
    //         if (
    //             value !== "Electronics" &&
    //             value !== "Cameras" &&
    //             value !== "Laptops" &&
    //             value !== "Accessories" &&
    //             value !== "Headphones" &&
    //             value !== "Food" &&
    //             value !== "Books" &&
    //             value !== "Clothes/Shoes" &&
    //             value !== "Beauty/Health" &&
    //             value !== "Sports" &&
    //             value !== "Outdoor" &&
    //             value !== "Home"
    //         ) {
    //             // TODO: remove hardcoded
    //             throw new Error("Invalid category input");
    //         }
    //         return true;
    //     }),
    // body("stock").notEmpty().isNumeric(),
});
