import { omit } from "lodash";

import Product from "../../domain/Product";

import { ProductDao, ProductFullDocument } from "./ProductDao";

const fromProductDocumentToModel = (productDocument: ProductFullDocument): Product => {
    const product: Product = new Product({
        id: productDocument.remoteId,
        title: productDocument.title,
        description: productDocument.description,
        price: productDocument.price,
        ratings: productDocument.ratings,
        imageUrl: productDocument.imageUrl,
        category: productDocument.category,
        stock: productDocument.stock,
    });

    return product;
};

const fromProductToDao = (product: Product, userId: string): ProductDao => {
    const remoteId = product.id;
    const productWithoutId = omit(product, "id");
    const productWithoutIdAndUser = omit(productWithoutId, "user");

    const productDao: ProductDao = {
        userId,
        remoteId,
        ...productWithoutIdAndUser,
    };

    return productDao;
};

const fromProductDaoToModel = (productDao: ProductDao): Product => {
    const product = new Product({
        id: productDao.remoteId,
        title: productDao.title,
        description: productDao.description,
        price: productDao.price,
        ratings: productDao.ratings,
        imageUrl: productDao.imageUrl,
        category: productDao.category,
        stock: productDao.stock,
    });

    return product;
};

export { fromProductToDao, fromProductDocumentToModel, fromProductDaoToModel };
