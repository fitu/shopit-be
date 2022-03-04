import httpStatus from "http-status";
import { expect } from "chai";
import request from "supertest";
import { Server } from "http";

import ProductController from "../../../src/product/infrastructure/ProductController";
import ProductService from "../../../src/product/domain/ProductService";
import ProductViewModel from "../../../src/product/infrastructure/ProductViewModel";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import { getEmptyProductWithId } from "../../shared/utils/ProductFactory";
import App, { BASE_VERSION } from "../../../src/app";

describe("ProductController", function () {
    let service: ProductService;
    let server: Server;

    before(async () => {
        service = <ProductService>{};
        const controller = new ProductController(service);
        const app = new App([controller]);
        await app.init();
        server = await app.listen();
    });

    it("getProductById should return false and 404 if product not found", async function () {
        // Given
        const productId = "foo";

        service.getProductById = async (productId: string): Promise<Product> => {
            throw new NotFoundError(productId);
        };

        // When
        const response = await request(server).get(`${BASE_VERSION}/products/${productId}`);

        // Then
        const { body, statusCode } = response;
        const { success, error } = body;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(error).to.be.not.undefined;
    });

    it("getProductById should return success and 200 if product found", async function () {
        // Given
        const productId = "foo";

        service.getProductById = async (productId: string): Promise<Product> => {
            return getEmptyProductWithId(productId);
        };

        // When
        const response = await request(server).get(`${BASE_VERSION}/products/${productId}`);

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
});
