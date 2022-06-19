import { zip } from "lodash";

import UserDocument from "../../../user/infrastructure/noSql/UserDao";
import Page from "../../../shared/Page";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDocument, { fromProductToDao, ProductDao } from "./ProductDao";

class ProductRepository implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        const productToSave: ProductDao = fromProductToDao(product, userId);

        const newProduct = await ProductDocument.create(productToSave);

        return newProduct.toModel();
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsUsers: Array<[Product, string]> = zip(products, userIds);
        const productsToSave: Array<ProductDao> = productsUsers.map(([product, userId]) =>
            fromProductToDao(product, userId)
        );

        const insertedProducts = await ProductDocument.insertMany(productsToSave);
        const newProducts: Array<Product> = insertedProducts.map((insertedProduct) => insertedProduct.toModel());

        return newProducts;
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const storedProducts = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const products: Array<Product> = storedProducts.map((storedProduct) => storedProduct.toModel());
        const totalDocuments: number = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const storedProducts = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const productsWithUsersPromises = storedProducts.map(async (storedProduct) => {
            const user = await UserDocument.findById(storedProduct.userId).exec();

            const productWithUser: Product = { ...storedProduct.toModel(), user: user.toModel() };
            return productWithUser;
        });

        const products = await Promise.all(productsWithUsersPromises);
        const totalDocuments: number = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return ProductDocument.findById(productId).exec();
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        const product = await ProductDocument.findById(productId).exec();
        const user = await UserDocument.findById(product.userId).exec();

        const productWithUser = { ...product.toModel(), user: user.toModel() };
        return productWithUser;
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const deletedProduct = await ProductDocument.findByIdAndRemove(productId).exec();

        const success = !!deletedProduct;
        return success;
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        const oldProduct = await ProductDocument.findByIdAndUpdate(productId, product).exec();

        if (!oldProduct) {
            return null;
        }

        return product;
    }
}

export default ProductRepository;
