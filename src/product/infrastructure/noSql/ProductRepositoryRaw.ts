import { zip } from "lodash";
import mongoose, { Types } from "mongoose";

import Page from "../../../shared/Page";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import { ProductDao, PRODUCT_DOCUMENT } from "./ProductDao";
import { fromProductToDao } from "./productParsers";

class ProductRepositoryRaw implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        const productToSave: ProductDao = fromProductToDao(product, userId);

        const newProductDocument: any = await mongoose.connection.db
            .collection(PRODUCT_DOCUMENT)
            .insertOne(productToSave);

        return newProductDocument.toModel();
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsAndUserIds: Array<[Product, string]> = zip(products, userIds);
        const productsToSave: Array<ProductDao> = productsAndUserIds.map(([product, userId]) =>
            fromProductToDao(product, userId)
        );

        const insertedProductDocuments: any = await mongoose.connection.db
            .collection(PRODUCT_DOCUMENT)
            .insertMany(productsToSave);

        const insertedProducts: Array<Product> = insertedProductDocuments.map((insertedProductDocument) =>
            insertedProductDocument.toModel()
        );

        return insertedProducts;
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        const productDao: ProductDao = fromProductToDao(product, product.user.id);

        const foo = await mongoose.connection.db
            .collection(PRODUCT_DOCUMENT)
            .updateOne({ remoteId: productId }, productDao);
        console.log(foo);

        return product;
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const foo = await mongoose.connection.db.collection(PRODUCT_DOCUMENT).findOneAndDelete({ remoteId: productId });

        console.log(foo);

        return true;
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const productsDao: Array<any> = await mongoose.connection.db.collection(PRODUCT_DOCUMENT).find().toArray();

        const products = productsDao.map((productDao) => productDao.toModel());
        const totalDocuments = products.length;

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        return new Promise(() => {});
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const productDao: any = await mongoose.connection.db
            .collection(PRODUCT_DOCUMENT)
            .findOne({ remoteId: productId });

        return productDao;
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        return new Promise(() => {});
    }
}

export default ProductRepositoryRaw;
