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
    userDocument.password = user.password;
    userDocument.resetPasswordToken = user.resetPasswordToken;
    userDocument.resetPasswordExpirationDate = user.resetPasswordExpirationDate;

    return userDocument;
};

const fromUserDocumentToModel = (userDocument: UserFullDocument): User => {
    const avatar: Avatar | null = userDocument.avatar
        ? new Avatar({
              id: userDocument.avatar.remoteId,
              publicId: userDocument.avatar.publicId,
              url: userDocument.avatar.url,
          })
        : null;

    const cart: Cart | null = userDocument.cart
        ? new Cart({
              id: userDocument.cart.remoteId,
              itemsPrice: userDocument.cart.itemsPrice,
              taxPrice: userDocument.cart.taxPrice,
              totalPrice: userDocument.cart.totalPrice,
          })
        : null;

    const user: User = new User({
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

export { fromUserToDao, updateUserDocument, fromUserDocumentToModel };
