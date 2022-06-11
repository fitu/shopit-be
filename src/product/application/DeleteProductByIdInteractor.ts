import Product from "../../product/domain/Product";
import { NotFoundError } from "../../shared/error/NotFoundError";
import { NotAllowError } from "../../shared/error/NotAllowError";
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
            // TODO: do not hardcode this
            throw new NotFoundError('Product not found');
        }

        const isAllowToDelete = await this.hasPermissions(product, userId);
        if (!isAllowToDelete) {
            // TODO: do not hardcode this
            throw new NotAllowError('You are not allow to do this action');
        }

        await this.productService.deleteProductById(productId);
    }

    private async hasPermissions(product: Product, userId: string): Promise<boolean> {
        if (product?.user?.id === userId) {
            return true;
        }

        const isAdmin = await this.userService.isAdmin(userId);
        return isAdmin;
    }
}

export type { DeleteProductByIdData };
export default DeleteProductByIdInteractor;
