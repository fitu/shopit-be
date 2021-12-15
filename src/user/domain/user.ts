type UserRole = "user" | "admin";

interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    resetPasswordToken: string | null;
    resetPasswordExpire: Date | null;
}

class User implements UserAttributes {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public role: UserRole,
        public password: string,
        public resetPasswordToken: string | null,
        public resetPasswordExpire: Date | null
    ) {}
}

export type { UserRole, UserAttributes };
export default User;
