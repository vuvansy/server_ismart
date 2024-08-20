const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;
const order_detail = new Schema(
    {
        id: { type: ObjectId },
        od_quantity: { type: Number },
        od_price: { type: Number },
        od_total: { type: Number },
        orderId: { type: ObjectId, ref: "order" },
        productId: { type: ObjectId, ref: "product" },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.order_detail ||
    mongoose.model("order_detail", order_detail);
