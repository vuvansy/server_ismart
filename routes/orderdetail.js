var express = require("express");
var router = express.Router();
var orderDetailModel = require("../models/orderDetails/OrderdetailModels");

/* GET orderDetail listing. */
//[GET] orderDetails/
router.get("/", async function (req, res, next) {
    const data = await orderDetailModel.find();
    res.json(data);
});

// [GET] /orderDetails/productId/:id
router.get("/order/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const data = await orderDetailModel
            .find({ orderId: id })
            .populate("productId");
        res.json(data);
    } catch {
        res.json({ status: false });
    }
});

//[POST] /orderDetails/
//Tạo nhiều bản ghi
router.post("/", async function (req, res, next) {
    try {
        const orderDetails = req.body;
        const data = await orderDetailModel.create(orderDetails);

        res.json({ status: 200, message: "Thêm thành công" });
    } catch {
        res.json({ status: 500, message: "Thêm mới thất bại" });
    }
});



//[GET] /orderDetails/:id
router.get("/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const data = await orderDetailModel.findById({ _id: id });
        res.json(data);
    } catch {
        res.json({ status: false });
    }
});

module.exports = router;
