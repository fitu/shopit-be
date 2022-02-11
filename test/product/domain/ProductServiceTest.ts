import { expect } from "chai";

import { Repository as ProductRepository } from "../../../src/product/infrastructure/Repository";
import ProductService from "../../../src/product/domain/ProductService";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import { emptyProduct } from "../../shared/utils/ProductFactory";

describe("ProductService", function () {
    it("getProductById should throw NotFoundError if product not found", async function () {
        // Given
        const repository = <ProductRepository>{};
        const service = new ProductService(repository);

        repository.getProductById = async (productId: string): Promise<Product | null> => {
            return null;
        };

        const productId = "foo";

        try {
            // When
            await service.getProductById(productId);
        } catch (error) {
            // Then
            expect(error).instanceOf(NotFoundError);
        }
    });

    it("getProductById should returns an object if found", async function () {
        // Given
        const repository = <ProductRepository>{};
        const service = new ProductService(repository);

        repository.getProductById = async (productId: string): Promise<Product | null> => {
            return emptyProduct;
        };

        const productId = "foo";

        // When
        const product = await service.getProductById(productId);

        // Then
        expect(product).to.be.instanceOf(Product);
    });
});
