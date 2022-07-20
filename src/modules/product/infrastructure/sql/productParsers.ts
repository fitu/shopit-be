import Product from "@product/domain/Product";
import ProductDao from "@product/infrastructure/sql/ProductDao";

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

export { fromProductDaoToModel };
