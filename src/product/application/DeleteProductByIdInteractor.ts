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
            throw new NotFoundError("error.product_not_found");
        }

        const productOwnerId = product?.user?.id;
        const hasUserPermissions = await this.userService.hasUserPermissions(userId, productOwnerId);

        if (!hasUserPermissions) {
            // TODO: remove hardcoded
            throw new NotAllowError("You are not allow to do this action");
        }

        await this.productService.deleteProductById(productId);
    }
}

export type { DeleteProductByIdData };
export default DeleteProductByIdInteractor;
