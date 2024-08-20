const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;
const product = new Schema(
    {
        id: { type: ObjectId },
        name: { type: String },
        price_new: { type: Number },
        price_old: { type: Number },
        quantity: { type: Number },
        description: { type: String },
        product_image: { type: String },
        categoryId: { type: ObjectId, ref: "category" }, //Khóa ngoại
    },
    { timestamps: true }
);

module.exports = mongoose.models.product || mongoose.model("product", product);
