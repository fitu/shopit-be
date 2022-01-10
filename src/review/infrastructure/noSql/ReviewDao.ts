import mongoose from "mongoose";

import Review from "../../../review/domain/Review";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
});

schema.methods.toModel = function (): Review {
    return {
        id: this._id.toString(),
        name: this.name,
        rating: this.rating,
        comment: this.comment,
    };
};

const model = mongoose.model("Review", schema);

export default model;
