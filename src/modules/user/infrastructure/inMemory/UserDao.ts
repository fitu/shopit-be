import User, { UserRole } from "@user/domain/User";
import AvatarDao from "@avatar/infrastructure/inMemory/AvatarDao";
import CartDao from "@cart/infrastructure/inMemory/CartDao";
import ShippingInfoDao from "@shippingInfo/infrastructure/inMemory/ShippingInfoDao";
import ReviewDao from "@review/infrastructure/inMemory/ReviewDao";
import ProductDao from "@product/infrastructure/inMemory/ProductDao";
import { fromModelToUserDao, fromUserDaoToModel } from "@user/infrastructure/inMemory/userParsers";

class UserDao {
    readonly id?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;
    readonly password: string;
    readonly resetPasswordToken?: string | null;
    readonly resetPasswordExpirationDate?: Date | null;
    readonly cart?: CartDao | null;
    readonly avatar?: AvatarDao | null;
    readonly products?: Array<ProductDao> | null;
    readonly reviews?: Array<ReviewDao> | null;
    readonly shippingsInfo?: Array<ShippingInfoDao> | null;

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
        cart?: CartDao | null;
        avatar?: AvatarDao | null;
        products?: Array<ProductDao> | null;
        reviews?: Array<ReviewDao> | null;
        shippingsInfo?: Array<ShippingInfoDao> | null;
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

    public toModel(): User {
        return fromUserDaoToModel(this);
    }

    public toDao(user: User): UserDao {
        return fromModelToUserDao(user);
    }
}

export default UserDao;
