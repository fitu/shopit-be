import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import Avatar from "../../avatar/domain/Avatar";
import Cart from "../../cart/domain/Cart";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";

type UserRole = 'user' | 'admin';

class User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    resetPasswordToken?: string | null;
    resetPasswordExpirationDate?: Date | null;
    cart?: Cart | null;
    avatar?: Avatar | null;
    products?: Array<Product> | null;
    reviews?: Array<Review> | null;
    shippingsInfo?: Array<ShippingInfo> | null;

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
        cart?: Cart | null;
        avatar?: Avatar | null;
        products?: Array<Product> | null;
        reviews?: Array<Review> | null;
        shippingsInfo?: Array<ShippingInfo> | null;
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
}

export type { UserRole };
export default User;
