import Product from "../../product/domain/Product";
import Review from "../../review/domain/Review";
import Avatar from "../../avatar/domain/Avatar";
import Cart from "../../cart/domain/Cart";

type UserRole = "user" | "admin";

class User {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public role: UserRole,
        public password: string,
        public resetPasswordToken: string | null,
        public resetPasswordExpire: Date | null,
        public cart?: Cart,
        public avatar?: Avatar,
        public products?: Array<Product>,
        public reviews?: Array<Review>,
    ) {}
}

export type { UserRole };
export default User;
