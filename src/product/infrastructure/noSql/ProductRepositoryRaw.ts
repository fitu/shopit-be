import { zip } from "lodash";
import mongoose from "mongoose";

import User from "../../../user/domain/User";
import { UserDao, USER_DOCUMENT } from "../../../user/infrastructure/noSql/UserDao";
import { fromUserDaoToModel } from "../../../user/infrastructure/noSql/userParsers";
import Page from "../../../shared/Page";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import { ProductDao, PRODUCT_DOCUMENT } from "./ProductDao";
import { fromProductDaoToModel, fromProductToDao } from "./productParsers";

class ProductRepositoryRaw implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        const productToSave: ProductDao = fromProductToDao(product, userId);

        await mongoose.connection.db.collection(PRODUCT_DOCUMENT).insertOne(productToSave);

        return product;
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsAndUserIds: Array<[Product, string]> = zip(products, userIds);
        const productsToSave: Array<ProductDao> = productsAndUserIds.map(([product, userId]) =>
            fromProductToDao(product, userId)
        );

        await mongoose.connection.db.collection(PRODUCT_DOCUMENT).insertMany(productsToSave);

        return products;
    }

    // FIXME: fix this
    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        const productDao: ProductDao = fromProductToDao(product, product.user.id);

        console.log(productDao, " foo");
        const foo = await mongoose.connection.db
            .collection(PRODUCT_DOCUMENT)
            .updateOne({ remoteId: productId }, productDao);
        console.log(foo);

        return product;
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const { value } = await mongoose.connection.db
            .collection(PRODUCT_DOCUMENT)
            .findOneAndDelete({ remoteId: productId });

        const success = !!value;

        return success;
    }

    // TODO: paginate this & check if there are no entries
    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const queryResults = await mongoose.connection.db.collection(PRODUCT_DOCUMENT).find().toArray();

        const products: Array<Product> = queryResults.map((queryResult) => {
            const productDao = queryResult as ProductDao;
            const product: Product = fromProductDaoToModel(productDao);

            return product;
        });
        const totalDocuments = products.length;

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    // TODO: paginate this & check if there are no entries
    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const productQueryResults = await mongoose.connection.db.collection(PRODUCT_DOCUMENT).find().toArray();

        const productsDao: Array<ProductDao> = productQueryResults.map((productQueryResult) => {
            return productQueryResult as ProductDao;
        });

        const productsWithUsersPromises = productsDao.map(async (productDao) => {
            const userQueryResult = await mongoose.connection.db
                .collection(USER_DOCUMENT)
                .findOne({ remoteId: productDao.userId });

            const userDao = userQueryResult as UserDao;
            const user: User = fromUserDaoToModel(userDao);
            const product: Product = fromProductDaoToModel(productDao);

            const productWithUser: Product = { ...product, user };
            return productWithUser;
        });

        const products: Array<Product> = await Promise.all(productsWithUsersPromises);
        const totalDocuments: number = await products.length;

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const queryResult = await mongoose.connection.db.collection(PRODUCT_DOCUMENT).findOne({ remoteId: productId });

        if (!queryResult) {
            return null;
        }

        const productDao = queryResult as ProductDao;
        const product: Product = fromProductDaoToModel(productDao);

        return product;
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        const productQueryResult = await mongoose.connection.db
            .collection(PRODUCT_DOCUMENT)
            .findOne({ remoteId: productId });

        if (!productQueryResult) {
            return null;
        }

        const productDao = productQueryResult as ProductDao;

        const userQueryResult = await mongoose.connection.db
            .collection(USER_DOCUMENT)
            .findOne({ remoteId: productDao.userId });

        if (!userQueryResult) {
            return null;
        }

        const userDao = userQueryResult as UserDao;
        const user: User = fromUserDaoToModel(userDao);
        const product: Product = fromProductDaoToModel(productDao);
        const productWithUser: Product = { ...product, user };

        return productWithUser;
    }
}

export default ProductRepositoryRaw;
