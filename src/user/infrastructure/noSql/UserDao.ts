import bcrypt from 'bcrypt';
import mongoose, { Document } from "mongoose";

import User, { UserRole } from "../../domain/User";

interface UserDao {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    resetPasswordToken: string;
    resetPasswordExpire: Date;
    shippingsInfo?: Array<ShippingInfoDao>;
}

interface UserDocument extends Document {
    toModel: () => User;
    validatePassword(password: string): boolean;
}

type UserFullDocument = UserDao & UserDocument;

interface ShippingInfoDao {
    _id: string;
    address: string;
    city: string;
    phone: string;
    postalCode: string;
    country: string;
}

// TODO: Do i need document for shipping info?

const shippingInfoSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});

const userSchema = new mongoose.Schema({
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
    shippingsInfo: [shippingInfoSchema],
    // TODO: add avatar, paymentInfo, cart
});

userSchema.methods.validatePassword = async function (password: string) {
    const passwordsMatch = await bcrypt.compare(password, this.user.password)
    return passwordsMatch;
};

userSchema.methods.toModel = function (): User {
    const user = this as UserFullDocument;

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

userSchema.pre("save", async function (next) {
    const user = this as UserFullDocument;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
        
    next();
});

const model = mongoose.model<UserFullDocument>("User", userSchema);

export type { UserDao, ShippingInfoDao };
export default model;
