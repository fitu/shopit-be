import mongoose, { Document, Types } from "mongoose";

import { hashPassword } from "../../../../shared/utils/hashUtils";
import User, { UserRole, validUserRoles } from "../../domain/User";

import { fromUserDocumentToModel } from "./userParsers";

const USER_SCHEMA = "User";
const USER_DOCUMENT = "users";
// TODO: add "columns"

interface UserDao {
    _id?: Types.ObjectId;
    remoteId?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    resetPasswordToken?: string | null;
    resetPasswordExpirationDate?: Date | null;
    shippingsInfo?: Array<ShippingInfoDao> | null;
    avatar?: AvatarDao | null;
    cart?: CartDao | null;
}

interface UserDocument extends Document {
    toModel: () => User;
    validatePassword(password: string): boolean;
}

type UserFullDocument = UserDao & UserDocument;

interface ShippingInfoDao {
    remoteId?: string;
    address: string;
    city: string;
    phone: string;
    postalCode: string;
    country: string;
}

interface CartDao {
    remoteId?: string;
    itemsPrice: number;
    taxPrice: number;
    totalPrice: number;
}

interface AvatarDao {
    remoteId?: string;
    publicId: string;
    url: string;
}

const shippingInfoSchema = new mongoose.Schema({
    remoteId: {
        type: String,
        required: true,
    },
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

const cartSchema = new mongoose.Schema({
    remoteId: {
        type: String,
        required: true,
    },
    itemsPrice: {
        type: Number,
        required: true,
    },
    taxPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
});

const avatarSchema = new mongoose.Schema({
    remoteId: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    remoteId: {
        type: String,
        required: true,
    },
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
            values: validUserRoles,
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
    resetPasswordExpirationDate: {
        type: Date,
    },
    shippingsInfo: [shippingInfoSchema],
    cart: cartSchema,
    avatar: avatarSchema,
    // TODO: add paymentInfo, reviews and products
});

userSchema.methods.toModel = function (): User {
    return fromUserDocumentToModel(this);
};

userSchema.pre("save", async function (next) {
    const user = this as UserFullDocument;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;

    next();
});

userSchema.pre("insertMany", async function (next, docs) {
    const usersPromises = docs.map(async function (user) {
        const hashedPassword = await hashPassword(user.password);
        user.password = hashedPassword;
        return user;
    });

    docs = await Promise.all(usersPromises);

    next();
});

const model = mongoose.model<UserFullDocument>(USER_SCHEMA, userSchema);

export type { UserFullDocument, UserDao, AvatarDao, CartDao, ShippingInfoDao };
export { USER_SCHEMA, USER_DOCUMENT };
export default model;
