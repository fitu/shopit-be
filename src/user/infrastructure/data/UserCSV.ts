import User, { UserRole } from "../../domain/User";

class UserCSV {
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

    static toModel(userCSV: UserCSV): User {
        return {
            id: userCSV.id,
            firstName: userCSV.firstName,
            lastName: userCSV.lastName,
            email: userCSV.email,
            role: userCSV.role,
            password: userCSV.password,
            resetPasswordToken: userCSV.resetPasswordToken,
            resetPasswordExpire: userCSV.resetPasswordExpire,
        };
    }
}

export default UserCSV;
