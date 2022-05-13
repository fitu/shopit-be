import { expect } from "chai";

import { Repository as ProductRepository } from "../../../src/product/infrastructure/Repository";
import ProductService from "../../../src/product/domain/ProductService";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import { getRandomProductWithId } from "../../shared/utils/ProductFactory";
import Page from "../../../src/shared/Page";

describe("ProductService", function () {
    let repository: ProductRepository;
    let service: ProductService;

    beforeEach(() => {
        repository = <ProductRepository>{};
        service = new ProductService(repository);
    });

    it("getAllProducts should return an empty list if there are no product", async function () {
        // Given
        repository.getAllProducts = async (page?: number, itemsPerPage?: number): Promise<Page<Array<Product>>> => {
            return new Page({
                data: [],
                currentPage: page,
                totalNumberOfDocuments: 0,
                itemsPerPage: itemsPerPage,
            });
        };

        // When
        const products = await service.getAllProducts(-1, -1);

        // Then
        expect(products.data).to.be.empty;
    });

    it("getAllProducts should return an all products if there are products", async function () {
        // Given
        repository.getAllProducts = async (page?: number, itemsPerPage?: number): Promise<Page<Array<Product>>> => {
            return new Page({
                data: [getRandomProductWithId("foo"), getRandomProductWithId("bar")],
                currentPage: page,
                totalNumberOfDocuments: 2,
                itemsPerPage: itemsPerPage,
            });
        };

        // When
        const products = await service.getAllProducts(-1, -1);

        // Then
        expect(products.data).to.not.be.empty;
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

    it("getProductById should return a product if found", async function () {
        // Given
        repository.getProductById = async (productId: string): Promise<Product | null> => {
            return getRandomProductWithId(productId);
        };

        const productId = "foo";

        // When
        const product = await service.getProductById(productId);

        // Then
        expect(product).to.be.instanceOf(Product);
        expect(product.id).to.be.equal(productId);
    });
});
