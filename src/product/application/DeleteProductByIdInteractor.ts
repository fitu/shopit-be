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

        const productOwnerId = product?.user?.id;
        await this.userService.checkUserPermissions(userId, productOwnerId);

        await this.productService.deleteProductById(productId);
    }
}

export type { DeleteProductByIdData };
export default DeleteProductByIdInteractor;
