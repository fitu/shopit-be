import crypto from "crypto";
import mongoose, { Document } from "mongoose";

import User, { UserRole } from "../../domain/User";

interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    resetPasswordToken: string;
    resetPasswordExpire: Date;
    toModel: () => User;
    validatePassword(password: string): boolean;
}

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
            message: "Please select correct role",
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

schema.methods.validatePassword = async function (password: string) {
    // FIXME: fix this
    return true;
};

schema.methods.toModel = function (): User {
    const user = this as UserDocument;

    return {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: user.password,
        resetPasswordToken: user.resetPasswordToken,
        resetPasswordExpire: user.resetPasswordExpire,
        cart: null,
        avatar: null,
        products: [],
        reviews: [],
        shippingsInfo: null,
    };
};

schema.pre("save", function (next) {
    const user = this as UserDocument;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    const hash = crypto.createHash("md5").update(user.password).digest("hex");
    user.password = hash;
    next();
});

const model = mongoose.model<UserDocument>("User", schema);

export type { UserDocument };
export default model;
