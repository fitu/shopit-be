import mongoose from "mongoose";

import User from "../../../user/domain/User";

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

schema.methods.toModel = function (): User {
    return {
        id: this._id.toString(),
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        role: this.role,
        password: this.password,
        resetPasswordToken: this.resetPasswordToken,
        resetPasswordExpire: this.resetPasswordExpire,
        cart: null,
        avatar: null,
        products: [],
        reviews: [],
        shippingsInfo: null,
    };
};

const model = mongoose.model("User", schema);

export default model;
