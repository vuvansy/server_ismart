const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;
const order = new Schema(
    {
        id: { type: ObjectId },
        fullname: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        note: { type: String },
        total: { type: Number },
        quantity: { type: Number },
        status: { type: String },
        paymentMethod: { type: String },
        //Khóa ngoại
        userId: { type: ObjectId, ref: "user" }, //Khóa ngoại
    },
    { timestamps: true }
);

module.exports = mongoose.models.order || mongoose.model("order", order);
