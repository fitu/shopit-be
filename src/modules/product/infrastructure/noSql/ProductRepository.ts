import { zip } from "lodash";

import Page from "@shared/Page";
import UserDocument, { UserFullDocument } from "@user/infrastructure/noSql/UserDao";
import Product from "@product/domain/Product";
import { Repository } from "@product/infrastructure/Repository";
import ProductDocument, { ProductFullDocument, ProductDao } from "@product/infrastructure/noSql/ProductDao";
import { fromProductToDao } from "@product/infrastructure/noSql/productParsers";

class ProductRepository implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        const productToSave: ProductDao = fromProductToDao(product, userId);

        const newProductDocument: ProductFullDocument = await ProductDocument.create(productToSave);

        const newProductModel = newProductDocument.toModel();
        return newProductModel;
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsAndUserIds: Array<[Product, string]> = zip(products, userIds);
        const productsToSave: Array<ProductDao> = productsAndUserIds.map(([product, userId]) =>
            fromProductToDao(product, userId)
        );

        const insertedProductDocuments: Array<ProductFullDocument> = await ProductDocument.insertMany(productsToSave);
        const newProductModels: Array<Product> = insertedProductDocuments.map((insertedProductDocument) =>
            insertedProductDocument.toModel()
        );

        return newProductModels;
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        const oldProductDocument: ProductFullDocument = await ProductDocument.findOneAndUpdate(
            { remoteId: productId },
            product
        ).exec();

        if (!oldProductDocument) {
            return null;
        }

        return product;
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const deletedProductDocument: ProductFullDocument = await ProductDocument.findOneAndDelete({
            remoteId: productId,
        }).exec();

        const success = !!deletedProductDocument;
        return success;
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const productDocuments: Array<ProductFullDocument> = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const products: Array<Product> = productDocuments.map((productDocument) => productDocument.toModel());
        const totalDocuments: number = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const productDocuments: Array<ProductFullDocument> = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const productsWithUsersPromises = productDocuments.map(async (productDocument) => {
            const userDocument: UserFullDocument = await UserDocument.findOne({
                remoteId: productDocument.userId,
            }).exec();

            const productWithUser: Product = { ...productDocument.toModel(), user: userDocument.toModel() };
            return productWithUser;
        });

        const products: Array<Product> = await Promise.all(productsWithUsersPromises);
        const totalDocuments: number = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const productDocument: ProductFullDocument | null = await ProductDocument.findOne({
            remoteId: productId,
        }).exec();

        const product = productDocument?.toModel();
        return product;
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        const productDocument: ProductFullDocument | null = await ProductDocument.findOne({
            remoteId: productId,
        }).exec();
        const userDocument: UserFullDocument | null = await UserDocument.findOne({
            remoteId: productDocument.userId,
        }).exec();

        if (!productDocument || !userDocument) {
            return null;
        }

        const productWithUser: Product = { ...productDocument.toModel(), user: userDocument.toModel() };
        return productWithUser;
    }
}

export default ProductRepository;
