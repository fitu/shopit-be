import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

class GetAllProductsInteractor {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async execute(): Promise<Array<ProductData>> {
        // TODO: Validate

        const allProducts = await this.productService.getAllProducts();

        return allProducts.map((product) => ProductData.fromModel(product));
    }
}

export default GetAllProductsInteractor;
