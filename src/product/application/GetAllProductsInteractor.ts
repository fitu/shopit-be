import Page from "../../shared/Page";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";


interface GetAllProductsData {
    page: number;
    itemsPerPage: number;
}

class GetAllProductsInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute({ page, itemsPerPage }: GetAllProductsData): Promise<Page<Array<ProductData>>> {
        const allProducts = await this.productService.getAllProducts(page, itemsPerPage);

        return {
            ...allProducts,
            data: allProducts.data.map((product) => ProductData.fromModel(product)),
        };
    }
}

export type { GetAllProductsData };
export default GetAllProductsInteractor;
