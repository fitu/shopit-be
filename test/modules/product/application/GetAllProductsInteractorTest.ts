import { expect } from "chai";

import Page from "../../../../src/shared/Page";
import GetAllProductsInteractor, {
    GetAllProductsData,
} from "../../../../src/modules/product/application/GetAllProductsInteractor";
import ProductService from "../../../../src/modules/product/domain/ProductService";
import Product from "../../../../src/modules/product/domain/Product";
import { getRandomProduct } from "../../../shared/utils/ProductFactory";
import { getMockPage } from "../../../shared/utils/PageFactory";

describe("GetAllProductsInteractor", function () {
    let service: ProductService;
    let interactor: GetAllProductsInteractor;

    beforeEach(() => {
        service = <ProductService>{};
        interactor = new GetAllProductsInteractor(service);
    });

    it("getAllProducts should return an empty list of products if no products were found", async function () {
        // Given
        const products = [];
        const page = 1;
        const inputData: GetAllProductsData = { page, itemsPerPage: -1 };

        service.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const result = await interactor.execute(inputData);

        // Then
        const { data, total, currentPage } = result;

        expect(data).to.be.instanceOf(Array).that.is.empty;
        expect(total).to.be.eq(products.length);
        expect(currentPage).to.be.eq(page);
    });

    it("getAllProducts should return a list of products if there are products", async function () {
        // Given
        const products = [getRandomProduct(), getRandomProduct()];
        const page = 1;
        const inputData: GetAllProductsData = { page, itemsPerPage: -1 };

        service.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const result = await interactor.execute(inputData);

        // Then
        const { data, total, currentPage } = result;

        expect(data).to.be.instanceOf(Array).with.lengthOf(products.length);
        expect(total).to.be.eq(products.length);
        expect(currentPage).to.be.eq(page);
    });
});
