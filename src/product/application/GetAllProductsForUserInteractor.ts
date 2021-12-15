import Interactor from "../../shared/Interactor";
import ProductService from "../domain/ProductService";

import ProductData from "./ProductData";

interface GetAllProductsForUserData {
    userId: number;
}

class GetAllProductsForUserInteractor implements Interactor {
    private data: GetAllProductsForUserData;

    private productService: ProductService;

    constructor(data: GetAllProductsForUserData, productService: ProductService) {
        this.data = data;
        this.productService = productService;
    }

    public async execute(): Promise<Array<ProductData>> {
        // TODO: Validate

        const allProducts = await this.productService.getAllProductsForUser(this.data.userId);

        return allProducts.map((product) => ProductData.fromModel(product));
    }
}

export type { GetAllProductsForUserData };
export default GetAllProductsForUserInteractor;
