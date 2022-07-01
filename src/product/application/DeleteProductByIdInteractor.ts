import NotAllowError from "../../shared/error/NotAllowError";
import NotFoundError from "../../shared/error/NotFoundError";
import UserService from "../../user/domain/UserService";
import ProductService from "../domain/ProductService";

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
            // TODO: do not hardcode strings
            throw new NotFoundError("Product not found");
        }

        const productOwnerId = product?.user?.id;
        const hasUserPermissions = await this.userService.hasUserPermissions(userId, productOwnerId);

        if (!hasUserPermissions) {
            // TODO: do not hardcode this
            throw new NotAllowError("You are not allow to do this action");
        }

        await this.productService.deleteProductById(productId);
    }
}

export type { DeleteProductByIdData };
export default DeleteProductByIdInteractor;
