import Page from "@shared/Page";
import ProductService from "@product/domain/ProductService";
import ProductData from "@product/application/ProductData";

type GetAllProductsData = {
    readonly page: number;
    readonly itemsPerPage: number;
};

class GetAllProductsInteractor {
    constructor(private readonly productService: ProductService) {}

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
