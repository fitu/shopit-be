import Product from "@product/domain/Product";
import ProductDao from "@product/infrastructure/inMemory/ProductDao";

const fromProductDaoToModel = (productDao: ProductDao): Product => {
    const product = new Product({
        id: productDao.id,
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

const fromModelToProductDao = (product: Product): ProductDao => {
    const productDao = new ProductDao({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        ratings: product.ratings,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
    });

    return productDao;
};

export { fromProductDaoToModel, fromModelToProductDao };
