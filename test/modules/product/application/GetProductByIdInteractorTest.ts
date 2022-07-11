import { expect } from "chai";

import NotFoundError from "../../../../src/shared/error/BaseNotFoundError";
import GetProductByIdInteractor, {
    GetProductByIdData,
} from "../../../../src/modules/product/application/GetProductByIdInteractor";
import ProductService from "../../../../src/modules/product/domain/ProductService";
import Product from "../../../../src/modules/product/domain/Product";
import ProductData from "../../../../src/modules/product/application/ProductData";
import { getRandomProductWithId } from "../../../shared/utils/ProductFactory";

describe("GetProductByIdInteractor", function () {
    let service: ProductService;
    let interactor: GetProductByIdInteractor;

    beforeEach(() => {
        service = <ProductService>{};
        interactor = new GetProductByIdInteractor(service);
    });

    it("getProductById should throw NotFoundError if product not found", async function () {
        // Given
        service.getProductById = async (productId: string): Promise<Product | null> => {
            return null;
        };

        const inputData: GetProductByIdData = { productId: "foo" };

        try {
            // When
            await interactor.execute(inputData);
        } catch (error: any) {
            // Then
            expect(error).instanceOf(NotFoundError);
        }
    });

    it("getProductById should return a product if found", async function () {
        // Given
        service.getProductById = async (productId: string): Promise<Product | null> => {
            return getRandomProductWithId(productId);
        };

        const productId = "foo";
        const inputData: GetProductByIdData = { productId: "foo" };

        // When
        const product = await interactor.execute(inputData);

        // Then
        expect(product).to.be.instanceOf(ProductData);
        expect(product.id).to.be.equal(productId);
    });
});
