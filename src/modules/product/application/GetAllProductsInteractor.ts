import Page from "@shared/Page";
import ProductService from "@product/domain/ProductService";
import ProductData from "@product/application/ProductData";

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
        const allProductsWithMetadata = await this.productService.getAllProducts(page, itemsPerPage);

        return {
            ...allProductsWithMetadata,
            data: allProductsWithMetadata.data.map((product) => ProductData.fromModel(product)),
        };
    }
}

export type { GetAllProductsData };
export default GetAllProductsInteractor;
