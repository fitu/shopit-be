import { faker } from '@faker-js/faker';

import Product, { ProductCategory } from "../../../src/product/domain/Product";

const getRandomProduct = (): Product => {
    return new Product({
        title: faker.random.alpha(10),
        description: faker.random.alpha(10),
        price: +faker.random.numeric,
        ratings: +faker.random.numeric,
        imageUrl: faker.system.directoryPath(),
        // TODO: do not hardcode this
        category: "Electronics",
        stock: +faker.random.numeric,
    });
};

const getRandomProductWithId = (productId: string): Product => {
    return new Product({
        ...getRandomProduct(),
        id: productId,
    });
};

const getProductWithData = ({
        id,
        title,
        description,
        price,
        imageUrl,
        category,
        stock,
    }: {
        id?: string;
        title?: string;
        description?: string;
        price?: number;
        imageUrl?: string;
        category?: ProductCategory;
        stock?: number;
    }): Product => {
    return new Product({
        id,
        title: title ?? faker.random.alpha(10),
        description: description ?? faker.random.alpha(10),
        price: price ?? +faker.random.numeric,
        ratings: 0,
        imageUrl: imageUrl ?? faker.system.directoryPath(),
        // TODO: do not hardcode this
        category: category ?? "Electronics",
        stock: stock ?? +faker.random.numeric,
    });
};

export { getRandomProduct, getRandomProductWithId, getProductWithData };