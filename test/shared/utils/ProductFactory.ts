import { faker } from '@faker-js/faker';
import Product from "../../../src/product/domain/Product";

const getRandomProduct = (): Product => {
    return new Product({
        title: faker.random.alpha.toString(),
        description: faker.random.alpha.toString(),
        price: +faker.random.numeric,
        ratings: +faker.random.numeric,
        imageUrl: faker.system.directoryPath.toString(),
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

export { getRandomProduct, getRandomProductWithId };
