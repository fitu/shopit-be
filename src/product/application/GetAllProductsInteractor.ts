import Page from "../../shared/Page";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

class GetAllProductsInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute(page: number, itemsPerPage: number): Promise<Page<Array<ProductData>>> {
        const allProducts = await this.productService.getAllProducts(page, itemsPerPage);

        return {
            ...allProducts,
            data: allProducts.data.map((product) => ProductData.fromModel(product)),
        };
    }
}

export default GetAllProductsInteractor;
