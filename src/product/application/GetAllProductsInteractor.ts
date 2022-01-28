import Page from "../../shared/Page";
import Product from "../domain/Product";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

class GetAllProductsInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute(page?: number, itemsPerPage?: number): Promise<Array<ProductData> | Page<Array<ProductData>>> {
        const allProducts = await this.productService.getAllProducts(page, itemsPerPage);

        if (!page) {
            return (allProducts as Array<Product>).map((product) => ProductData.fromModel(product));
        }

        return {
            ...allProducts,
            data: (allProducts as Page<Array<Product>>).data.map((product) => ProductData.fromModel(product)),
        };
    }
}

export default GetAllProductsInteractor;
