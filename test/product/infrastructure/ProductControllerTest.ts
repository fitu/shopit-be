import httpStatus from "http-status";
import { expect } from "chai";
import supertest from "supertest";
import { Server } from "http";
import sinon, { SinonSandbox } from "sinon";
import { Response, NextFunction } from "express";

import ProductNotFoundError from "../../../src/product/application/error/ProductNotFoundError";
import ProductController from "../../../src/product/infrastructure/ProductController";
import ProductService from "../../../src/product/domain/ProductService";
import UserService from "../../../src/user/domain/UserService";
import ProductViewModel from "../../../src/product/infrastructure/ProductViewModel";
import Product, { ProductCategory } from "../../../src/product/domain/Product";
import { getRandomUserWithId } from "../../shared/utils/UserFactory";
import fileUploadMiddleware, { MulterRequest } from "../../../src/shared/middlewares/fileUploaderMiddleware";
import { getProductWithData, getRandomProduct, getRandomProductWithId } from "../../shared/utils/ProductFactory";
import { getMockPage } from "../../shared/utils/PageFactory";
import TestRequest, { FAKE_JWT_USER_ID } from "../../shared/utils/requests";
import Page from "../../../src/shared/Page";
import App from "../../../src/app/app";

describe("ProductController", function () {
    let productService: ProductService;
    let userService: UserService;
    let server: Server;
    let api: TestRequest;
    let sandbox: SinonSandbox;

    let path: string;

    beforeEach(async () => {
        productService = <ProductService>{};
        userService = <UserService>{};
        const controller = new ProductController(productService, userService);
        const middlewares = [];
        path = controller.path;
        const app = new App([controller], middlewares);

        await app.init();
        server = await app.listen(false);
        const testApi = await supertest(server);
        api = new TestRequest(testApi);

        sandbox = sinon.createSandbox();
        sandbox.stub(fileUploadMiddleware, "fileUpload").callsFake((): any => {
            return {
                any() {
                    return (req: MulterRequest, res: Response, next: NextFunction) => {
                        req.files = [{ location: "images", key: "foo-" }];
                        next();
                    };
                },
            };
        });
    });

    afterEach(() => {
        sandbox.restore();
        server.close();
    });

    it("getProductById should return false and 422 if product id is not uuid", async function () {
        // Given
        const productId = "foo";

        // When
        const response = await api.get(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("getProductById should return false and 404 if product is not found", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";

        productService.getProductById = async (productId: string): Promise<Product | null> => {
            return null;
        };

        // When
        const response = await api.get(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(errors).to.be.not.undefined;
    });

    it("getProductById should return success and 200 if product is found", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";

        productService.getProductById = async (productId: string): Promise<Product | null> => {
            return getRandomProductWithId(productId);
        };

        // When
        const response = await api.get(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, data, errors } = body;
        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
        expect(productViewModel.id).to.be.equal(productId);
    });

    it("getProducts should return success, 200 and empty list if no products founds", async function () {
        // Given
        const products = [];

        productService.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const response = await api.get(`${path}`);

        // Then
        const { body, statusCode } = response;
        const { success, data, total, errors } = body;
        const productViewModels = data as Array<ProductViewModel>;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
        expect(total).to.be.eq(0);
        expect(productViewModels).to.be.empty;
    });

    it("getProducts should return success, 200 and list with products", async function () {
        // Given
        const products = [getRandomProduct(), getRandomProduct()];

        productService.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const response = await api.get(`${path}`);

        // Then
        const { body, statusCode } = response;
        const { success, data, total, errors } = body;

        const productViewModels = data as Array<ProductViewModel>;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
        expect(total).to.be.eq(2);
        expect(productViewModels.length).to.be.eq(2);
    });

    it("getProducts should return success, 200 and list with products", async function () {
        // Given
        const products = [getRandomProduct(), getRandomProduct()];

        productService.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const response = await api.get(`${path}`);

        // Then
        const { body, statusCode } = response;
        const { success, data, total, errors } = body;

        const productViewModels = data as Array<ProductViewModel>;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
        expect(total).to.be.eq(2);
        expect(productViewModels.length).to.be.eq(2);
    });

    // TODO: does this apply to any?
    it("createProduct should return false and 501 if something went wrong", async function () {
        // Given
        productService.insert = async (product: Product, userId: string): Promise<Product> => {
            throw new Error();
        };

        // When
        const response = await api.post(`${path}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if image is missing", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;

        // When
        const response = await api.post(`${path}`).field({
            title,
            description,
            price,
            category,
            stock,
        });

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if title is not set", async function () {
        // Given
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if description is too short", async function () {
        // Given
        const title = "title";
        const description = "foo";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if description is too long", async function () {
        // Given
        const title = "title";
        const description =
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. \
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. \
            Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if price is not set", async function () {
        // Given
        const title = "title";
        const description = "description";
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if price is not numeric", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = "foo";
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if category is not set", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = 11.11;
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if category is not a predefined one", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "foo";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if category is not a predefined one", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "foo";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if stock is not set", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return false and 422 if stock is not numeric", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = "foo";
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("createProduct should return success and 201 if image is set", async function () {
        // Given
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        productService.insert = async (product: Product, userId: string): Promise<Product> => {
            return product;
        };

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, data, errors } = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.CREATED);
        expect(errors).to.be.undefined;
        expect(productViewModel).to.contain({
            title,
            description,
            price: price.toString(),
            category,
            stock: stock.toString(),
            ratings: 0,
        });
    });

    it("createProduct should return success and 201 and trim title and description", async function () {
        // Given
        const title = "   title   ";
        const description = "   description   ";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        productService.insert = async (product: Product, userId: string): Promise<Product> => {
            return product;
        };

        // When
        const response = await api
            .post(`${path}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, data, errors } = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.CREATED);
        expect(errors).to.be.undefined;
        expect(productViewModel).to.contain({
            title: title.trim(),
            description: description.trim(),
            price: price.toString(),
            category,
            stock: stock.toString(),
            ratings: 0,
        });
    });

    it("deleteProductById should return false and 422 if id is not uuid", async function () {
        // Given
        const productId = "foo";

        // When
        const response = await api.delete(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("deleteProductById should return false and 404 if product is not found", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";

        productService.getProductById = async (productId: string): Promise<Product | null> => {
            return null;
        };

        // When
        const response = await api.delete(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(errors).to.be.not.undefined;
    });

    it("deleteProductById should return false and 422 if product is found but user is not admin nor the owner", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";

        productService.getProductById = async (productId: string): Promise<Product | null> => {
            return getRandomProduct();
        };

        userService.hasUserPermissions = async (userId: string, userIdToCheck?: string): Promise<boolean> => {
            return false;
        };

        // When
        const response = await api.delete(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNAUTHORIZED);
        expect(errors).to.be.not.undefined;
    });

    it("deleteProductById should return true and 200 if product is found and user is admin", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";

        productService.getProductById = async (productId: string): Promise<Product | null> => {
            return getRandomProduct();
        };

        userService.hasUserPermissions = async (userId: string, userIdToCheck?: string): Promise<boolean> => {
            return true;
        };

        productService.deleteProductById = async (productId: string): Promise<void> => {
            return;
        };

        // When
        const response = await api.delete(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
    });

    it("deleteProductById should return true and 200 if product is found and user is the owner", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const userId = FAKE_JWT_USER_ID;
        const user = getRandomUserWithId(userId);

        productService.getProductById = async (productId: string): Promise<Product | null> => {
            return getProductWithData({ user });
        };

        userService.hasUserPermissions = async (userId: string, userIdToCheck?: string): Promise<boolean> => {
            return true;
        };

        productService.deleteProductById = async (productId: string): Promise<void> => {
            return;
        };

        // When
        const response = await api.delete(`${path}/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
    });

    it("updateProductById should return false and 422 if title is not set", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if description is too short", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "foo";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if description is too long", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description =
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \
            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. \
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. \
            Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if price is not set", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if price is not numeric", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = "foo";
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if category is not set", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if category is not a predefined one", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "foo";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if category is not a predefined one", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "foo";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if stock is not set", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if stock is not numeric", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = "foo";
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if image is missing", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        // When
        const response = await api.put(`${path}/${productId}`).field({
            title,
            description,
            price,
            category,
            stock,
            imageUrl,
        });

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 404 if product is not found before checking permissions", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        productService.getProductWithUserById = async (productId: string): Promise<Product | null> => {
            return null;
        };

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
                imageUrl,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 404 if product is not found", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = ProductCategory.ELECTRONICS;
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        productService.getProductWithUserById = async (productId: string): Promise<Product | null> => {
            return getProductWithData({ id: productId, title, description, price, category, stock, imageUrl });
        };

        userService.hasUserPermissions = async (userId: string, userIdToCheck?: string): Promise<boolean> => {
            return true;
        };

        productService.updateProductById = async (productId: string, product: Product): Promise<Product> => {
            throw new ProductNotFoundError();
        };

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
                imageUrl,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return false and 422 if product is found but user is not admin nor the owner", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = "Electronics";
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        productService.getProductWithUserById = async (productId: string): Promise<Product | null> => {
            return getRandomProduct();
        };

        userService.hasUserPermissions = async (userId: string, userIdToCheck?: string): Promise<boolean> => {
            return false;
        };

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
                imageUrl,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, errors } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNAUTHORIZED);
        expect(errors).to.be.not.undefined;
    });

    it("updateProductById should return true and 200 if product is found and user is admin", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = ProductCategory.ELECTRONICS;
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        productService.getProductWithUserById = async (productId: string): Promise<Product | null> => {
            return getRandomProduct();
        };

        userService.hasUserPermissions = async (userId: string, userIdToCheck?: string): Promise<boolean> => {
            return true;
        };

        productService.updateProductById = async (productId: string, product: Product): Promise<Product> => {
            return getProductWithData({ id: productId, title, description, price, category, stock, imageUrl });
        };

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
                imageUrl,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, data, errors } = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
        expect(productViewModel).to.contain({
            id: productId,
            title,
            description,
            price,
            category,
            stock,
            imageUrl,
            ratings: 0,
        });
    });

    it("updateProductById should return true and 200 if product is found and user is the owner", async function () {
        // Given
        const productId = "d487e446-9da0-4754-8f89-d22e278e1541";
        const title = "title";
        const description = "description";
        const price = 11.11;
        const category = ProductCategory.ELECTRONICS;
        const stock = 1;
        const imageUrl = "test/shared/fixtures/random.jpg";

        const userId = FAKE_JWT_USER_ID;
        const user = getRandomUserWithId(userId);

        productService.getProductWithUserById = async (productId: string): Promise<Product | null> => {
            return getProductWithData({ user });
        };

        userService.hasUserPermissions = async (userId: string, userIdToCheck?: string): Promise<boolean> => {
            return true;
        };

        productService.updateProductById = async (productId: string, product: Product): Promise<Product> => {
            return getProductWithData({ id: productId, title, description, price, category, stock, imageUrl });
        };

        // When
        const response = await api
            .put(`${path}/${productId}`)
            .field({
                title,
                description,
                price,
                category,
                stock,
                imageUrl,
            })
            .attach("image", imageUrl);

        // Then
        const { body, statusCode } = response;
        const { success, data, errors } = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(errors).to.be.undefined;
        expect(productViewModel).to.contain({
            id: productId,
            title,
            description,
            price,
            category,
            stock,
            imageUrl,
            ratings: 0,
        });
    });
});
