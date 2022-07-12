import { faker } from "@faker-js/faker";

import User, { UserRole } from "@user/domain/User";

const getRandomUser = (): User => {
    const user = new User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        role: UserRole.USER,
        password: faker.random.alpha(10),
        resetPasswordToken: null,
        resetPasswordExpirationDate: null,
        cart: null,
        avatar: null,
        products: null,
        reviews: null,
        shippingsInfo: null,
    });

    return user;
};

const getRandomUserWithId = (userId: string): User => {
    const user = new User({
        ...getRandomUser(),
        id: userId,
    });

    return user;
};

export { getRandomUser, getRandomUserWithId };
