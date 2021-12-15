import ProductModel from "../domain/Product";
import Product from "./product";

interface Repository {
    createProduct: (product: ProductModel) => Promise<ProductModel>;
    setUser: (product: ProductModel, userId: number) => Promise<void>;
}

class ProductRepository implements Repository {
    public createProduct = async (product: ProductModel): Promise<ProductModel> => {
        const newProduct = await Product.create({
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            ratings: product.ratings,
            category: product.category,
            stock: product.stock,
        });

        return newProduct;
    };

    public setUser = async (product: ProductModel, userId: number): Promise<void> => {
        const foundProduct = await Product.findByPk(product.id);
        await foundProduct.setUser(1);
    };
}

export type { Repository };
export default ProductRepository;
