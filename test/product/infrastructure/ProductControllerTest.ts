import httpStatus from "http-status";
import { expect } from "chai";
import supertest from "supertest";
import { Server } from "http";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";

import ProductController from "../../../src/product/infrastructure/ProductController";
import ProductService from "../../../src/product/domain/ProductService";
import ProductViewModel from "../../../src/product/infrastructure/ProductViewModel";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import fileUpload from "../../../src/shared/middlewares/fileUploaderMiddleware";
import App from "../../../src/app";
import Page from "../../../src/shared/Page";
import { getRandomProduct, getRandomProductWithId } from "../../shared/utils/ProductFactory";
import { getMockPage } from "../../shared/utils/PageFactory";
import TestRequest from "../../shared/utils/requests";

describe("ProductController", function () {
    let service: ProductService;
    let server: Server;
    let api: TestRequest;

    before(async () => {
        service = <ProductService>{};
        const controller = new ProductController(service);
        const app = new App([controller]);
    
        await app.init();
        server = await app.listen();
        const testApi = await supertest(server);
        api = new TestRequest(testApi);
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
        const { success, data } = body;
        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(productViewModel.id).to.be.equal(productId);
    });

    after(() => {
        server.close();
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

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("createProduct should return success and 200 if image is set", async function () {
        // Given
        const productTitle = 'title';
        const productDescription = 'description';
        const productPrice = 11.11;
        const productCategory = 'category';
        const productStock = 1;
        const productImageUrl = 'test/shared/fixtures/random.jpg';

        service.create = async (product: Product, userId: string): Promise<Product> => {
            return product;
        };
        
        // Mock image upload
        sinon.stub(fileUpload).call(
            () => {
              return {
                any() {
                  return (req, res: Response, next: NextFunction) => {
                    req.files = [{ location: 'images', key: 'foo-' }];
                    next();
                  };
                },
              };
            },
        );

        // When
        const response = await api.post('/products')
            .field({
                title: productTitle,
                description: productDescription,
                price: productPrice,
                category: productCategory,
                stock: productStock
            })
            .attach('image', productImageUrl);
        
        // Then
        const {body, statusCode} = response;
        const {success, data} = body;

        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(productViewModel.title).to.be.equal(productTitle);
        expect(productViewModel.description).to.be.equal(productDescription);
        expect(+productViewModel.price).to.be.equal(productPrice);
        expect(productViewModel.category).to.be.equal(productCategory);
        expect(+productViewModel.stock).to.be.equal(productStock);
        expect(productViewModel.ratings).to.be.equal(0);
    });
});
