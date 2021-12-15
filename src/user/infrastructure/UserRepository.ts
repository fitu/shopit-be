import CartModel from "../../cart/domain/Cart";
import Cart from "../../cart/infrastructure/cart";
import UserModel from "../domain/User";

import User from "./user";

interface Repository {
    createUser: (user: UserModel) => Promise<UserModel>;
    setCartToUser: (user: UserModel, cart: CartModel) => Promise<void>;
}

class UserRepository implements Repository {
    public createUser = async (user: UserModel): Promise<UserModel> => {
        const newUser = await User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            resetPasswordToken: user.resetPasswordToken,
            resetPasswordExpire: new Date(user.resetPasswordExpire),
        });
        return newUser;
    };

    public setCartToUser = async (user: UserModel, cart: CartModel): Promise<void> => {
        const foundUser = await User.findByPk(user.id);
        const newCart = await Cart.create();
        await foundUser.setCart(newCart);
    };
}

export type { Repository };
export default UserRepository;
