import { omit } from "lodash";
import mongoose, { Document, Types } from "mongoose";
import ShippingInfo from "shippingInfo/domain/ShippingInfo";

import { doPasswordsMatch, hashPassword } from "../../../shared/utils/hashUtils";
import User, { UserRole } from "../../domain/User";

const USER_SCHEMA = "User";

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
}

interface UserDocument extends Document {
    toModel: () => User;
    validatePassword(password: string): boolean;
}

type UserFullDocument = UserDao & UserDocument;

interface ShippingInfoDao {
    _id?: Types.ObjectId;
    remoteId?: string;
    address: string;
    city: string;
    phone: string;
    postalCode: string;
    country: string;
}

// TODO: Do i need document for shipping info?

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
    resetPasswordExpirationDate: {
        type: Date,
    },
    shippingsInfo: [shippingInfoSchema],
    // TODO: add avatar, paymentInfo, cart
});

userSchema.methods.toModel = function (): User {
    const userDocument = this as UserFullDocument;

    return {
        id: userDocument.remoteId,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        email: userDocument.email,
        role: userDocument.role,
        password: userDocument.password,
        resetPasswordToken: userDocument.resetPasswordToken,
        resetPasswordExpirationDate: userDocument.resetPasswordExpirationDate,
        cart: null,
        avatar: null,
        products: [],
        reviews: [],
        shippingsInfo: null,
    };
};

userSchema.methods.validatePassword = async function (password: string) {
    return doPasswordsMatch(password, this.user.password);
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

const fromShippingInfoToDao = (shippingInfo: ShippingInfo): ShippingInfoDao => {
    const remoteId = shippingInfo.id;
    const shippingInfoWithoutId = omit(shippingInfo, "id");

    return {
        ...shippingInfoWithoutId,
        remoteId,
    };
};

const fromUserToDao = (user: User): UserDao => {
    const remoteId = user.id;
    const userWithoutId = omit(user, "id");

    const shippingsInfosDao: Array<ShippingInfoDao> =
        user.shippingsInfo?.map((shippingInfo) => ({
            ...fromShippingInfoToDao(shippingInfo),
        })) ?? [];

    return {
        ...userWithoutId,
        remoteId,
        shippingsInfo: shippingsInfosDao,
    };
};

const updateUserDocument = (userDocument: UserFullDocument, user: User): UserFullDocument => {
    userDocument.remoteId = user.id;
    userDocument.firstName = user.firstName;
    userDocument.lastName = user.lastName;
    userDocument.email = user.email;
    userDocument.role = user.role;
    userDocument.password = user.password;
    userDocument.resetPasswordToken = user.resetPasswordToken;
    userDocument.resetPasswordExpirationDate = user.resetPasswordExpirationDate;

    return userDocument;
};

const model = mongoose.model<UserFullDocument>(USER_SCHEMA, userSchema);

export type { UserFullDocument, UserDao, ShippingInfoDao };
export { USER_SCHEMA, fromUserToDao, updateUserDocument };
export default model;
