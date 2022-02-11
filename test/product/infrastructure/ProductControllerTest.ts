import { Request, Response, NextFunction } from "express";
import { noop } from "lodash";
import { expect } from "chai";

import ProductController from "../../../src/product/infrastructure/ProductController";
import { Repository as ProductRepository } from "../../../src/product/infrastructure/Repository";
import ProductService from "../../../src/product/domain/ProductService";
import ProductViewModel from "../../../src/product/infrastructure/ProductViewModel";
import Product from "../../../src/product/domain/Product";

describe("ProductController", function () {
    let req: Partial<Request>;
    let res: Partial<Response> & { success: boolean; data?: ProductViewModel | Array<ProductViewModel> };
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            statusCode: 500,
            success: false,
            data: undefined,
            status: function (code: number) {
                this.statusCode = code;
                return this;
            },
            json: function (data: any): Response<any> {
                this.success = data.success;
                return this;
            },
        };
        next = noop;
    });

    // FIXME: uncomment this
    // it("should work", async function () {
    //     // Given
    //     const repository = <ProductRepository>{};
    //     const service = new ProductService(repository);
    //     const controller = new ProductController(service);

    //     req = {
    //         params: {
    //             id: "foo",
    //         },
    //     };

    //     repository.getProductById = async (productId: string): Promise<Product> => {
    //         return <Product>{};
    //     };

    //     try {
    //         // When
    //         await controller.getProductById(req as Request, res as Response, next);

    //         // Then
    //         expect(res.statusCode).to.be.equal(200);
    //         expect(res.success).to.be.true;
    //         await Promise.resolve();
    //     } catch (error: any) {
    //         console.log({ error });
    //         await Promise.reject();
    //     }
    // });
});
