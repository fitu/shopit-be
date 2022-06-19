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

        const newProducts = await ProductDocument.insertMany(productsToSave);

        return newProducts.map((newProduct) => newProduct.toModel());
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const products = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);
        const productModels = products.map((product) => product.toModel());

        const totalDocuments = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const products = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);
        const productsWithUsersPromises = products.map(async (product) => {
            const user = await UserDocument.findById(product.userId).exec();
            return { ...product.toModel(), user };
        });

        const productModels = await Promise.all(productsWithUsersPromises);
        const totalDocuments = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return ProductDocument.findById(productId).exec();
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        return new Promise(() => {});
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        return new Promise(() => {});
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        return new Promise(() => {});
    }
}

export default ProductRepository;
