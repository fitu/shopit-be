import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { noop } from "lodash";
import { expect } from "chai";

import ProductController from "../../../src/product/infrastructure/ProductController";
import ProductService from "../../../src/product/domain/ProductService";
import ProductViewModel from "../../../src/product/infrastructure/ProductViewModel";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import { getEmptyProductWithId } from "../../shared/utils/ProductFactory";

describe("ProductController", function () {
    let req: Partial<Request>;
    let res: Partial<Response> & {
        success: boolean;
        error?: string;
        data?: ProductViewModel | Array<ProductViewModel>;
    };
    let next: NextFunction;

    let service: ProductService;
    let controller: ProductController;

    beforeEach(() => {
        req = {};
        res = {
            statusCode: 500,
            success: false,
            error: undefined,
            data: undefined,
            status: function (code: number) {
                this.statusCode = code;
                return this;
            },
            json: function (data: any): Response<any> {
                this.success = data.success;
                this.error = data.error;
                this.data = data.data;
                return this;
            },
        };
        next = noop;

        service = <ProductService>{};
        controller = new ProductController(service);
    });

    it("getProductById should return false and 404 if product not found", async function () {
        // Given
        req = {
            params: {
                id: "foo",
            },
        };

        service.getProductById = async (productId: string): Promise<Product> => {
            throw new NotFoundError("foo");
        };

        // When
        await controller.getProductById(req as Request, res as Response, next);

        // Then
        const { success, statusCode, error } = res;

        expect(success).to.be.false;
        expect(statusCode).to.be.equal(httpStatus.NOT_FOUND);
        expect(error).to.be.not.undefined;
    });

    it("getProductById should return success and 200 if product found", async function () {
        // Given
        const productId = "foo";

        req = {
            params: {
                id: productId,
            },
        };

        service.getProductById = async (productId: string): Promise<Product> => {
            return getEmptyProductWithId(productId);
        };

        // When
        await controller.getProductById(req as Request, res as Response, next);

        // Then
        const { success, statusCode, data } = res;
        const productViewModel = data as ProductViewModel;

        expect(success).to.be.true;
        expect(statusCode).to.be.equal(httpStatus.OK);
        expect(productViewModel.id).to.be.equal(productId);
    });
});
