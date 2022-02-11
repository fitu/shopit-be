import { expect } from "chai";

import { Repository as ProductRepository } from "../../../src/product/infrastructure/Repository";
import ProductService from "../../../src/product/domain/ProductService";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import { getEmptyProductWithId } from "../../shared/utils/ProductFactory";

describe("ProductService", function () {
    let repository: ProductRepository;
    let service: ProductService;

    beforeEach(() => {
        repository = <ProductRepository>{};
        service = new ProductService(repository);
    });

    it("getProductById should throw NotFoundError if product not found", async function () {
        // Given
        repository.getProductById = async (productId: string): Promise<Product | null> => {
            return null;
        };

        try {
            // When
            await service.getProductById("foo");
        } catch (error) {
            // Then
            expect(error).instanceOf(NotFoundError);
        }
    });

    it("getProductById should returns a product if found", async function () {
        // Given
        repository.getProductById = async (productId: string): Promise<Product | null> => {
            return getEmptyProductWithId(productId);
        };

        const productId = "foo";

        // When
        const product = await service.getProductById(productId);

        // Then
        expect(product).to.be.instanceOf(Product);
        expect(product.id).to.be.equal(productId);
    });
});
