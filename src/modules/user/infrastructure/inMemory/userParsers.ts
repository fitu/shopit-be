import User from "@user/domain/User";
import { fromAvatarDaoToModel, fromModelToAvatarDao } from "@avatar/infrastructure/inMemory/avatarParsers";
import { fromCartDaoToModel, fromModelToCartDao } from "@cart/infrastructure/inMemory/cartParsers";
import { fromModelToProductDao, fromProductDaoToModel } from "@product/infrastructure/inMemory/productParsers";
import { fromModelToReviewDao, fromReviewDaoToModel } from "@review/infrastructure/inMemory/reviewParsers";
import {
    fromModelToShippingInfoDao,
    fromShippingInfoDaoToModel,
} from "@shippingInfo/infrastructure/inMemory/shippingInfoParsers";
import UserDao from "@user/infrastructure/inMemory/UserDao";

const fromUserDaoToModel = (userDao: UserDao): User => {
    const user = new User({
        id: userDao.id,
        firstName: userDao.firstName,
        lastName: userDao.lastName,
        email: userDao.email,
        role: userDao.role,
        password: userDao.password,
        resetPasswordToken: userDao.resetPasswordToken,
        resetPasswordExpirationDate: userDao.resetPasswordExpirationDate,
        cart: userDao.cart && fromCartDaoToModel(userDao.cart),
        avatar: userDao.avatar && fromAvatarDaoToModel(userDao.avatar),
        products: userDao.products?.map((product) => fromProductDaoToModel(product)),
        reviews: userDao.reviews?.map((review) => fromReviewDaoToModel(review)),
        shippingsInfo: userDao.shippingsInfo?.map((shippingsInfo) => fromShippingInfoDaoToModel(shippingsInfo)),
    });

    return user;
};

const fromModelToUserDao = (user: User): UserDao => {
    const userDao = new UserDao({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: user.password,
        resetPasswordToken: user.resetPasswordToken,
        resetPasswordExpirationDate: user.resetPasswordExpirationDate,
        cart: user.cart && fromModelToCartDao(user.cart),
        avatar: user.avatar && fromModelToAvatarDao(user.avatar),
        products: user.products?.map((product) => fromModelToProductDao(product)),
        reviews: user.reviews?.map((review) => fromModelToReviewDao(review)),
        shippingsInfo: user.shippingsInfo?.map((shippingsInfo) => fromModelToShippingInfoDao(shippingsInfo)),
    });

    return userDao;
};

export { fromUserDaoToModel, fromModelToUserDao };
