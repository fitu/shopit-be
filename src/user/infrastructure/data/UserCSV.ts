import AvatarCSV from "../../../avatar/infrastructure/data/AvatarCSV";
import CartCSV from "../../../cart/infrastructure/data/CartCSV";
import User, { UserRole } from "../../domain/User";

class UserCSV {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public role: UserRole,
        public password: string,
        public resetPasswordToken: string,
        public resetPasswordExpire: Date
    ) {}

    static toModel(userCSV: UserCSV): User {
        const cart = CartCSV.toModel({
            id: userCSV["cart/id"],
            itemsPrice: +userCSV["cart/itemsPrice"],
            taxPrice: +userCSV["cart/taxPrice"],
            totalPrice: +userCSV["cart/totalPrice"],
        });

        const avatar = userCSV["avatar/id"]
            ? AvatarCSV.toModel({
                  id: userCSV["avatar/id"],
                  publicId: userCSV["avatar/publicId"],
                  url: userCSV["avatar/url"],
              })
            : null;

        return {
            id: userCSV.id,
            firstName: userCSV.firstName,
            lastName: userCSV.lastName,
            email: userCSV.email,
            role: userCSV.role,
            password: userCSV.password,
            resetPasswordToken: userCSV.resetPasswordToken,
            resetPasswordExpire: userCSV.resetPasswordExpire,
            cart,
            avatar,
        };
    }
}

export default UserCSV;
