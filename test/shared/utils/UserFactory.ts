import { faker } from "@faker-js/faker";

import User from "../../../src/user/domain/User";

const getRandomUser = (): User => {
    return new User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        // TODO: do not hardcode this
        role: "user",
        password: faker.random.alpha(10),
        resetPasswordToken: null,
        resetPasswordExpirationDate: null,
        cart: null,
        avatar: null,
        products: null,
        reviews: null,
        shippingsInfo: null,
    });
};

const getRandomUserWithId = (userId: string): User => {
    return new User({
        ...getRandomUser(),
        id: userId,
    });
};

export { getRandomUser, getRandomUserWithId };
