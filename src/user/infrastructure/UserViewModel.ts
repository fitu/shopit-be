import Avatar from "../../avatar/domain/Avatar";
import Cart from "../../cart/domain/Cart";
import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import ShippingInfo from "../../shippingInfo/domain/ShippingInfo";
import UserData from "../application/UserData";
import { UserRole } from "../domain/User";

class UserViewModel {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;
    readonly resetPasswordToken: string | null;
    readonly resetPasswordExpirationDate: Date | null;
    readonly cart: Cart | null;
    readonly avatar: Avatar | null;
    readonly products: Array<Product> | null;
    readonly reviews: Array<Review> | null;
    readonly shippingsInfo: Array<ShippingInfo> | null;

    constructor({
        id,
        firstName,
        lastName,
        email,
        role,
        resetPasswordToken,
        resetPasswordExpirationDate,
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
        resetPasswordToken: string | null;
        resetPasswordExpirationDate: Date | null;
        cart: Cart | null;
        avatar: Avatar | null;
        products: Array<Product> | null;
        reviews: Array<Review> | null;
        shippingsInfo: Array<ShippingInfo> | null;
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.resetPasswordToken = resetPasswordToken;
        this.resetPasswordExpirationDate = resetPasswordExpirationDate;
        this.cart = cart;
        this.avatar = avatar;
        this.products = products;
        this.reviews = reviews;
        this.shippingsInfo = shippingsInfo;
    }

    public static fromData(userData: UserData): UserViewModel {
        return new UserViewModel({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
            resetPasswordToken: userData.resetPasswordToken,
            resetPasswordExpirationDate: userData.resetPasswordExpirationDate,
            cart: userData.cart,
            avatar: userData.avatar,
            products: userData.products,
            reviews: userData.reviews,
            shippingsInfo: userData.shippingsInfo,
        });
    }
}

export default UserViewModel;
