import { expect } from "chai";

import NotFoundError from "../../../../src/shared/error/BaseNotFoundError";
import { Repository as ProductRepository } from "../../../../src/modules/product/infrastructure/Repository";
import ProductService from "../../../../src/modules/product/domain/ProductService";
import Product from "../../../../src/modules/product/domain/Product";
import Page from "../../../../src/shared/Page";
import { getMockPage } from "../../../shared/utils/PageFactory";
import { getRandomProduct, getRandomProductWithId } from "../../../shared/utils/ProductFactory";

describe("ProductService", function () {
    let repository: ProductRepository;
    let service: ProductService;

    beforeEach(() => {
        repository = <ProductRepository>{};
        service = new ProductService(repository);
    });

    // TODO: test pagination here, because it's not gonna be tested in repository
    it("getAllProducts should return an empty list if there were no product", async function () {
        // Given
        const products = [];
        const page = 1;

        repository.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const result = await service.getAllProducts(page, -1);

        // Then
        const { data, total, currentPage } = result;

        expect(data).to.be.instanceOf(Array).that.is.empty;
        expect(total).to.be.eq(products.length);
        expect(currentPage).to.be.eq(page);
    });

    it("getAllProducts should return an all products if were products", async function () {
        // Given
        const products = [getRandomProduct(), getRandomProduct()];
        const page = 1;

        repository.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const result = await service.getAllProducts(page, -1);

        // Then
        const { data, total, currentPage } = result;

        expect(data).to.be.instanceOf(Array).with.lengthOf(products.length);
        expect(total).to.be.eq(products.length);
        expect(currentPage).to.be.eq(page);
    });

    it("getProductById should throw NotFoundError if product not found", async function () {
        // Given
        repository.getProductById = async (productId: string): Promise<Product | null> => {
            return null;
        };

        try {
            // When
            await service.getProductById("foo");
        } catch (error: any) {
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
