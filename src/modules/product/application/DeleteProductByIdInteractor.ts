import UserHasNotPermissionsError from "../../user/application/error/UserHasNotPermissionsError";
import UserService from "../../user/domain/UserService";
import ProductService from "../domain/ProductService";
import ProductNotFoundError from "./error/ProductNotFoundError";

interface DeleteProductByIdData {
    productId: string;
    userId: string;
}

class DeleteProductByIdInteractor {
    private productService: ProductService;
    private userService: UserService;

    constructor(productService: ProductService, userService: UserService) {
        this.productService = productService;
        this.userService = userService;
    }

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
