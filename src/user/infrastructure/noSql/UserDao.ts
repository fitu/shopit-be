import mongoose, { Model, Mongoose } from "mongoose";

class UserDao {
    private static model: Model<UserDao>;

    constructor() {}

    public init(instance: Mongoose): void {
        const schema = new mongoose.Schema({
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true,
                enum: {
                    // TODO: remove hardcoded
                    values: ["user", "admin"],
                    message: "Please select correct category for product",
                },
            },
            password: {
                type: String,
                required: true,
            },
            resetPasswordToken: {
                type: String,
            },
            resetPasswordExpire: {
                type: Date,
            },
            // TODO: add shippingInfo, avatar, paymentInfo, cart
        });

        UserDao.model = instance.model("User", schema);
    }

    public static getModel(): Model<UserDao> {
        return UserDao.model;
    }
}

export default UserDao;
