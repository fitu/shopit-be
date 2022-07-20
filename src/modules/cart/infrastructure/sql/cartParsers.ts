import Cart from "@cart/domain/Cart";
import CartDao from "@cart/infrastructure/sql/CartDao";

const fromCartDaoToModel = (cartDao: CartDao): Cart => {
    const cart = new Cart({
        id: cartDao.id,
        itemsPrice: cartDao.itemsPrice,
        taxPrice: cartDao.taxPrice,
        totalPrice: cartDao.totalPrice,
    });

    return cart;
};

export { fromCartDaoToModel };
