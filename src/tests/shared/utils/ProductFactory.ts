import { faker } from "@faker-js/faker";

import Product, { ProductCategory } from "@product/domain/Product";
import User from "@user/domain/User";
import { getRandomUser } from "./UserFactory";

const getRandomProduct = (): Product => {
    const product = new Product({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
        ratings: +faker.random.numeric(),
        imageUrl: faker.system.directoryPath(),
        category: ProductCategory.ELECTRONICS,
        stock: +faker.random.numeric(),
    });

    return product;
};

const getRandomProductWithId = (productId: string): Product => {
    const product = new Product({
        ...getRandomProduct(),
        id: productId,
    });

    return product;
};

const getRandomProductWithUser = (): Product => {
    const product = new Product({
        ...getRandomProduct(),
        user: getRandomUser(),
    });

    return product;
};

const getProductWithData = ({
    id,
    title,
    description,
    price,
    imageUrl,
    category,
    stock,
    user,
}: {
    id?: string;
    title?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    category?: ProductCategory;
    stock?: number;
    user?: User;
}): Product => {
    const product = new Product({
        id,
        title: title || faker.commerce.productName(),
        description: description || faker.commerce.productDescription(),
        price: price ?? +faker.commerce.price(),
        ratings: 0,
        imageUrl: imageUrl || faker.system.directoryPath(),
        category: category || ProductCategory.ELECTRONICS,
        stock: stock ?? +faker.random.numeric(),
        user: user || getRandomUser(),
    });

    return product;
};

export { getRandomProduct, getRandomProductWithId, getProductWithData, getRandomProductWithUser };
