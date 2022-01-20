import User, { UserRole } from "../domain/User";
import Avatar from "../../avatar/domain/Avatar";
import Cart from "../../cart/domain/Cart";
import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";

class UserData {
    readonly id?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;
    readonly password: string;
    readonly resetPasswordToken?: string | null;
    readonly resetPasswordExpirationDate?: Date | null;
    readonly cart?: Cart;
    readonly avatar?: Avatar;
    readonly products?: Array<Product>;
    readonly reviews?: Array<Review>;
    readonly shippingsInfo?: Array<ShippingInfo>;

    constructor({
        id,
        firstName,
        lastName,
        email,
        role,
        password,
        resetPasswordToken,
        resetPasswordExpirationDate,
        cart,
        avatar,
        products,
        reviews,
        shippingsInfo,
    }: {
        id?: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        password: string;
        resetPasswordToken?: string | null;
        resetPasswordExpirationDate?: Date | null;
        cart?: Cart;
        avatar?: Avatar;
        products?: Array<Product>;
        reviews?: Array<Review>;
        shippingsInfo?: Array<ShippingInfo>;
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
        this.resetPasswordToken = resetPasswordToken;
        this.resetPasswordExpirationDate = resetPasswordExpirationDate;
        this.cart = cart;
        this.avatar = avatar;
        this.products = products;
        this.reviews = reviews;
        this.shippingsInfo = shippingsInfo;
    }

    public static fromModel(user: User): UserData {
        return new UserData({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            resetPasswordToken: user.resetPasswordToken,
            resetPasswordExpirationDate: user.resetPasswordExpirationDate,
            cart: user.cart,
            avatar: user.avatar,
            products: user.products,
            reviews: user.reviews,
            shippingsInfo: user.shippingsInfo,
        });
    }
}

export default UserData;
