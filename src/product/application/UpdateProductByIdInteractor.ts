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

        const productOwnerId = product?.user?.id;
        await this.userService.checkUserPermissions(userId, productOwnerId);

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
