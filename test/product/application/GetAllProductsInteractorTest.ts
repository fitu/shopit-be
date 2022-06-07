import { expect } from "chai";

import { getRandomProduct } from "../../shared/utils/ProductFactory";
import { getMockPage } from "../../shared/utils/PageFactory";
import Page from "../../../src/shared/Page";
import GetAllProductsInteractor from "../../../src/product/application/GetAllProductsInteractor";
import ProductService from "../../../src/product/domain/ProductService";
import Product from "../../../src/product/domain/Product";

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
        const itemsPerPage = 5;

        service.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const result = await interactor.execute(page, itemsPerPage);

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
        const itemsPerPage = 5;

        service.getAllProducts = async (page: number, itemsPerPage: number): Promise<Page<Array<Product>>> => {
            return getMockPage(products);
        };

        // When
        const result = await interactor.execute(page, itemsPerPage);

        // Then
        const { data, total, currentPage } = result;

        expect(data).to.be.instanceOf(Array).with.lengthOf(products.length);
        expect(total).to.be.eq(products.length);
        expect(currentPage).to.be.eq(page);
    });
});
