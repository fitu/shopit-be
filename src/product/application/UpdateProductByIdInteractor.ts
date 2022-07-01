import NotAllowError from "../../shared/error/NotAllowError";
import NotFoundError from "../../shared/error/NotFoundError";
import UserService from "../../user/domain/UserService";
import ProductService from "../domain/ProductService";
import Product from "../domain/Product";

import ProductData from "./ProductData";

interface UpdateProductByIdData {
    productId: string;
    productData: ProductData;
    userId: string;
}

class UpdateProductByIdInteractor {
    private productService: ProductService;
    private userService: UserService;

    constructor(productService: ProductService, userService: UserService) {
        this.productService = productService;
        this.userService = userService;
    }

    public async execute({ productId, productData, userId }: UpdateProductByIdData): Promise<ProductData> {
        const product = await this.productService.getProductWithUserById(productId);

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
