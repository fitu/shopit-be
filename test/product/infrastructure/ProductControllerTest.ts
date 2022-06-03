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
        const { success, data, error } = body;
        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(error).to.be.undefined;
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
        const { body, statusCode } = response;
        const { success, data, total, error } = body;
        const productViewModels = data as Array<ProductViewModel>;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(error).to.be.undefined;
        expect(total).to.be.eq(0);
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
        const { body, statusCode } = response;
        const { success, data, total, error } = body;

        const productViewModels = data as Array<ProductViewModel>;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(error).to.be.undefined;
        expect(total).to.be.eq(2);
        expect(productViewModels.length).to.be.eq(2);
    });

    it("createProduct should return false and 422 if image is missing", async function () {
        // When
        const response = await api.post('/products');

        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
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
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return success and 200 if image is set", async function () {
        // Given
        const title = 'title';
        const description = 'description';
        const price = 11.11;
        const category = 'Electronics';
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
        const { body, statusCode } = response;
        const { success, data, error } = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(error).to.be.undefined;
        expect(productViewModel).to.contain(
            {
                title,
                description,
                price: price.toString(),
                category,
                stock: stock.toString(),
                ratings: 0
            }
        );
    });

    it("createProduct should return success and 200 and trim title and description", async function () {
        // Given
        const title = '   title   ';
        const description = '   description   ';
        const price = 11.11;
        const category = 'Electronics';
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
        const { body, statusCode } = response;
        const { success, data, error } = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(error).to.be.undefined;
        expect(productViewModel).to.contain(
            {
                title: title.trim(),
                description: description.trim(),
                price: price.toString(),
                category,
                stock: stock.toString(),
                ratings: 0
            }
        );
    });

    it("createProduct should return false and 422 if title is not set", async function () {
        // Given
        const description = 'description';
        const price = 11.11;
        const category = 'Electronics';
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
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if description is too short", async function () {
        // Given
        const title = 'title';
        const description = 'foo';
        const price = 11.11;
        const category = 'Electronics';
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
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if description is too long", async function () {
        // Given
        const title = 'title';
        const description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. \
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. \
            Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,";
        const price = 11.11;
        const category = 'Electronics';
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
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if price is not set", async function () {
        // Given
        const title = 'title';
        const description = "description";
        const category = 'Electronics';
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
                category,
                stock
            })
            .attach('image', imageUrl);
        
        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if price is not numeric", async function () {
        // Given
        const title = 'title';
        const description = "description";
        const price = 'foo';
        const category = 'Electronics';
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
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if category is not set", async function () {
        // Given
        const title = 'title';
        const description = "description";
        const price = 11.11;
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
                stock
            })
            .attach('image', imageUrl);
        
        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if category is not a predefined one", async function () {
        // Given
        const title = 'title';
        const description = "description";
        const price = 11.11;
        const category = 'foo';
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
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if category is not a predefined one", async function () {
        // Given
        const title = 'title';
        const description = "description";
        const price = 11.11;
        const category = 'foo';
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
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if stock is not set", async function () {
        // Given
        const title = 'title';
        const description = "description";
        const price = 11.11;
        const category = 'Electronics';
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
            })
            .attach('image', imageUrl);
        
        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if stock is not numeric", async function () {
        // Given
        const title = 'title';
        const description = "description";
        const price = 11.11;
        const category = 'Electronics';
        const stock = 'foo';
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
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(error).to.be.not.undefined;
    });

    it("removeProductId should return false and 404 if product not found", async function () {
        // Given
        const productId = 'foo';

        service.deleteProductById = async (productId: string): Promise<void> => {
            throw new NotFoundError(productId);
        };

        // When
        const response = await api.delete(`/products/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(error).to.be.not.undefined;
    });

    it("removeProductId should return true and 200 if product was found", async function () {
        // Given
        const productId = 'foo';

        service.deleteProductById = async (productId: string): Promise<void> => {
            return;
        };

        // When
        const response = await api.delete(`/products/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(error).to.be.undefined;
    });
});
