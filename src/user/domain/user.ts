import Cart from "cart/domain/Cart";

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
        // TODO: is this ?
        public cart?: Cart
    ) {}
}

export type { UserRole };
export default User;
