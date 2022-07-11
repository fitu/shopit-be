import Product from "../../domain/Product";

import ProductDao from "./ProductDao";

const fromProductDaoToModel = (productDao: ProductDao): Product => {
    return new Product({
        id: productDao.id,
        title: productDao.title,
        description: productDao.description,
        price: productDao.price,
        ratings: productDao.ratings,
        imageUrl: productDao.imageUrl,
        category: productDao.category,
        stock: productDao.stock,
    });
};

export { fromProductDaoToModel };
