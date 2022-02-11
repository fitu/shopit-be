import { expect } from "chai";

import GetProductByIdInteractor from "../../../src/product/application/GetProductByIdInteractor";
import ProductService from "../../../src/product/domain/ProductService";
import Product from "../../../src/product/domain/Product";
import { NotFoundError } from "../../../src/shared/error/NotFoundError";
import { getEmptyProduct } from "../../shared/utils/ProductFactory";
import ProductData from "../../../src/product/application/ProductData";

describe("GetProductByIdInteractor", function () {
    let service: ProductService;

    beforeEach(() => {
        service = <ProductService>{};
    });

    it("getProductById should throw NotFoundError if product not found", async function () {
        // Given
        const interactor = new GetProductByIdInteractor(service);

        service.getProductById = async (productId: string): Promise<Product | null> => {
            throw new NotFoundError("foo");
        };

        const data = { productId: "foo" };

        try {
            // When
            await interactor.execute(data);
        } catch (error) {
            // Then
            expect(error).instanceOf(NotFoundError);
        }
    });

    it("getProductById should returns a product if found", async function () {
        // Given
        const interactor = new GetProductByIdInteractor(service);

        service.getProductById = async (productId: string): Promise<Product | null> => {
            return getEmptyProduct();
        };

        const data = { productId: "foo" };

        // When
        const product = await interactor.execute(data);

        // Then
        expect(product).to.be.instanceOf(ProductData);
    });
});
