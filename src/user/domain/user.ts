import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import Avatar from "../../avatar/domain/Avatar";
import Cart from "../../cart/domain/Cart";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";

type UserRole = "user" | "admin";

class User {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;
    readonly password: string;
    readonly resetPasswordToken: string | null;
    readonly resetPasswordExpire: Date | null;
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
        resetPasswordExpire,
        cart,
        avatar,
        products,
        reviews,
        shippingsInfo,
    }: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        password: string;
        resetPasswordToken: string | null;
        resetPasswordExpire: Date | null;
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
        this.resetPasswordExpire = resetPasswordExpire;
        this.cart = cart;
        this.avatar = avatar;
        this.products = products;
        this.reviews = reviews;
        this.shippingsInfo = shippingsInfo;
    }
}

export type { UserRole };
export default User;
