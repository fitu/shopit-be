import { expect } from "chai";

import GetProductByIdInteractor from "../../../src/product/application/GetProductByIdInteractor";
import ProductService from "../../../src/product/domain/ProductService";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import { getRandomProductWithId } from "../../shared/utils/ProductFactory";
import ProductData from "../../../src/product/application/ProductData";

describe("GetProductByIdInteractor", function () {
    let service: ProductService;
    let interactor: GetProductByIdInteractor;

    beforeEach(() => {
        service = <ProductService>{};
        interactor = new GetProductByIdInteractor(service);
    });

    it("getProductById should throw NotFoundError if product not found", async function () {
        // Given
        const errorMessage = "foo";
        service.getProductById = async (productId: string): Promise<Product | null> => {
            throw new NotFoundError(errorMessage);
        };

        const data = { productId: "foo" };

        try {
            // When
            await interactor.execute(data);
        } catch (error: any) {
            // Then
            expect(error).instanceOf(NotFoundError);
            expect(error.message).to.be.equal(errorMessage);
        }
    });

    it("getProductById should return a product if found", async function () {
        // Given
        service.getProductById = async (productId: string): Promise<Product | null> => {
            return getRandomProductWithId(productId);
        };

        const productId = "foo";
        const data = { productId };

        // When
        const product = await interactor.execute(data);

        // Then
        expect(product).to.be.instanceOf(ProductData);
        expect(product.id).to.be.equal(productId);
    });
});
