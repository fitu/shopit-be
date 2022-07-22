import UserHasNotPermissionsError from "@user/application/error/UserHasNotPermissionsError";
import UserService from "@user/domain/UserService";
import ProductService from "@product/domain/ProductService";
import ProductNotFoundError from "@product/application/error/ProductNotFoundError";

type DeleteProductByIdData = {
    readonly productId: string;
    readonly userId: string;
};

class DeleteProductByIdInteractor {
    constructor(private readonly productService: ProductService, private readonly userService: UserService) {}

    public async execute({ productId, userId }: DeleteProductByIdData): Promise<void> {
        const product = await this.productService.getProductById(productId);

        if (!product) {
            throw new ProductNotFoundError();
        }

        const productOwnerId = product?.user?.id;
        const hasUserPermissions = await this.userService.hasUserPermissions(userId, productOwnerId);

        if (!hasUserPermissions) {
            throw new UserHasNotPermissionsError();
        }

        await this.productService.deleteProductById(productId);
    }
}

export type { DeleteProductByIdData };
export default DeleteProductByIdInteractor;
