import UserHasNotPermissionsError from "@user/application/error/UserHasNotPermissionsError";
import UserService from "@user/domain/UserService";
import ProductService from "@product/domain/ProductService";
import Product from "@product/domain/Product";
import ProductData from "@product/application/ProductData";
import ProductNotFoundError from "@product/application/error/ProductNotFoundError";

type UpdateProductByIdData = {
    readonly productId: string;
    readonly productData: ProductData;
    readonly userId: string;
};

class UpdateProductByIdInteractor {
    constructor(private readonly productService: ProductService, private readonly userService: UserService) {}

    public async execute({ productId, productData, userId }: UpdateProductByIdData): Promise<ProductData> {
        const product = await this.productService.getProductWithUserById(productId);

        if (!product) {
            throw new ProductNotFoundError();
        }

        const productOwnerId = product?.user?.id;
        const hasUserPermissions = await this.userService.hasUserPermissions(userId, productOwnerId);

        if (!hasUserPermissions) {
            throw new UserHasNotPermissionsError();
        }

        const productDataWithoutNulls = ProductData.filterNulls(productData);
        const productToUpdate = new Product({
            ...product,
            ...productDataWithoutNulls,
        });

        const updatedProduct = await this.productService.updateProductById(productId, productToUpdate);
        return ProductData.fromModel(updatedProduct);
    }
}

export type { UpdateProductByIdData };
export default UpdateProductByIdInteractor;
