const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema(
    {
        id: { type: ObjectId },
        username: { type: String },
        fullname: { type: String },
        email: { type: String },
        password: { type: String },
        phone: { type: String, required: true, match: /^[0-9]{10}$/ },
        role: { type: String },
        address: { type: String },
        //Token chỉ được dùng một lần duy nhất, token có giới hạn thời gian
        reset_token: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.models.user || mongoose.model("user", user);
