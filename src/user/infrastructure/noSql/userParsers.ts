import { omit } from "lodash";

import Avatar from "../../../avatar/domain/Avatar";
import ShippingInfo from "../../../shippingInfo/domain/ShippingInfo";
import Cart from "../../../cart/domain/Cart";
import User from "../../domain/User";

import { AvatarDao, CartDao, ShippingInfoDao, UserDao, UserFullDocument } from "./UserDao";

const fromShippingInfoToDao = (shippingInfo: ShippingInfo): ShippingInfoDao => {
    const remoteId = shippingInfo.id;
    const shippingInfoWithoutId = omit(shippingInfo, "id");

    const shippingInfoDao: ShippingInfoDao = {
        ...shippingInfoWithoutId,
        remoteId,
    };

    return shippingInfoDao;
};

const fromAvatarToDao = (avatar: Avatar): AvatarDao => {
    const remoteId = avatar.id;
    const avatarWithoutId = omit(avatar, "id");

    const avatarDao: AvatarDao = {
        ...avatarWithoutId,
        remoteId,
    };

    return avatarDao;
};

const fromCartToDao = (cart: Cart): CartDao => {
    const remoteId = cart.id;
    const cartWithoutId = omit(cart, "id");

    const cartDao: CartDao = {
        ...cartWithoutId,
        remoteId,
    };

    return cartDao;
};

const fromUserToDao = (user: User): UserDao => {
    const remoteId = user.id;
    const userWithoutId = omit(user, "id");

    const shippingsInfosDao: Array<ShippingInfoDao> =
        user.shippingsInfo?.map((shippingInfo) => ({
            ...fromShippingInfoToDao(shippingInfo),
        })) ?? [];

    const avatarDao: AvatarDao | null = user.avatar ? fromAvatarToDao(user.avatar) : null;
    const cartDao: CartDao | null = user.cart ? fromCartToDao(user.cart) : null;
    const userDao: UserDao = {
        ...userWithoutId,
        remoteId,
        shippingsInfo: shippingsInfosDao,
        cart: cartDao,
        avatar: avatarDao,
    };

    return userDao;
};

const updateUserDocument = (userDocument: UserFullDocument, user: User): UserFullDocument => {
    userDocument.remoteId = user.id;
    userDocument.firstName = user.firstName;
    userDocument.lastName = user.lastName;
    userDocument.email = user.email;
    userDocument.role = user.role;
    userDocument.password = null;
    userDocument.resetPasswordToken = user.resetPasswordToken;
    userDocument.resetPasswordExpirationDate = user.resetPasswordExpirationDate;

    return userDocument;
};

const fromUserDocumentToModel = (userDocument: UserFullDocument): User => {
    const avatar = userDocument.avatar
        ? new Avatar({
              id: userDocument.avatar.remoteId,
              publicId: userDocument.avatar.publicId,
              url: userDocument.avatar.url,
          })
        : null;

    const cart = userDocument.cart
        ? new Cart({
              id: userDocument.cart.remoteId,
              itemsPrice: userDocument.cart.itemsPrice,
              taxPrice: userDocument.cart.taxPrice,
              totalPrice: userDocument.cart.totalPrice,
          })
        : null;

    const user = new User({
        id: userDocument.remoteId,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        email: userDocument.email,
        role: userDocument.role,
        password: userDocument.password,
        resetPasswordToken: userDocument.resetPasswordToken,
        resetPasswordExpirationDate: userDocument.resetPasswordExpirationDate,
        cart,
        avatar,
        products: [],
        reviews: [],
        shippingsInfo: null,
    });

    return user;
};

const fromUserDaoToModel = (userDao: UserDao): User => {
    const avatar = userDao.avatar
        ? new Avatar({
              id: userDao.avatar.remoteId,
              publicId: userDao.avatar.publicId,
              url: userDao.avatar.url,
          })
        : null;

    const cart = userDao.cart
        ? new Cart({
              id: userDao.cart.remoteId,
              itemsPrice: userDao.cart.itemsPrice,
              taxPrice: userDao.cart.taxPrice,
              totalPrice: userDao.cart.totalPrice,
          })
        : null;

    const shippingsInfo: Array<ShippingInfo> =
        userDao.shippingsInfo?.map(
            (shippingInfoDao) =>
                new ShippingInfo({
                    id: shippingInfoDao.remoteId,
                    address: shippingInfoDao.address,
                    city: shippingInfoDao.city,
                    phone: shippingInfoDao.phone,
                    postalCode: shippingInfoDao.postalCode,
                    country: shippingInfoDao.country,
                })
        ) ?? [];

    const user = new User({
        id: userDao.remoteId,
        firstName: userDao.firstName,
        lastName: userDao.lastName,
        email: userDao.email,
        role: userDao.role,
        password: userDao.password,
        resetPasswordToken: userDao.resetPasswordToken,
        resetPasswordExpirationDate: userDao.resetPasswordExpirationDate,
        cart,
        avatar,
        shippingsInfo,
        products: [],
        reviews: [],
    });

    return user;
};

export { fromUserToDao, updateUserDocument, fromUserDocumentToModel, fromUserDaoToModel };
