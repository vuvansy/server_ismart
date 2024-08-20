const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;
const category = new Schema(
    {
        id: { type: ObjectId },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxLength: 255,
            default: "No name",
        },
        image: { type: String },
        status: { type: String },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.category || mongoose.model("category", category);
