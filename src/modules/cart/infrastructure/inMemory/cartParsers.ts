import Cart from "@cart/domain/Cart";
import CartDao from "@cart/infrastructure/inMemory/CartDao";

const fromCartDaoToModel = (cartDao: CartDao): Cart => {
    const cart = new Cart({
        id: cartDao.id,
        itemsPrice: cartDao.itemsPrice,
        taxPrice: cartDao.taxPrice,
        totalPrice: cartDao.totalPrice,
    });

    return cart;
};

const fromModelToCartDao = (cart: Cart): CartDao => {
    const cartDao = new CartDao({
        id: cart.id,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
    });

    return cartDao;
};

export { fromCartDaoToModel, fromModelToCartDao };
