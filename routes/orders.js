var express = require("express");
var router = express.Router();
var orderModel = require("../models/orders/OrderModels");

/* GET order listing. */

router.get("/", async function (req, res, next) {
    const data = await orderModel.find();
    res.json(data);
});

// [GET] /orders/user/:id
router.get("/user/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const data = await orderModel.find({ userId: id });
        res.json(data);
    } catch {
        res.status(500).json({ error: "Lỗi khi lấy dữ liệu đơn hàng" });
    }
});

// [GET] /orders/:status
router.get("/status/:status", async function (req, res, next) {
    try {
        const { status } = req.params;
        const data = await orderModel.find({ status });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

//[POST] /orders/
router.post("/", async function (req, res, next) {
    try {
        const {
            fullname,
            email,
            phone,
            address,
            note,
            total,
            quantity,
            status,
            paymentMethod,
            userId,
        } = req.body;
        const data = await orderModel.create({
            fullname,
            email,
            phone,
            address,
            note,
            total,
            quantity,
            status,
            paymentMethod,
            userId,
        });
        res.json({ status: 200, message: "Đặt hàng thành công", data });
    } catch {
        res.json({ status: 500, message: "Thêm mới thất bại" });
    }
});

//[PUT] orders/edit
router.patch("/:id", async function (req, res, next) {
    try {
        var id = req.params.id;
        const { status } = req.body;

        var item = await orderModel.findById(id);
        if (item) {
            item.status = status ? status : item.status;
            item.updatedAt = new Date(); // Cập nhật trường updatedAt

            await item.save();
            res.json({ status: 1, message: "Cập nhật thành công thành công" });
        }
    } catch (err) {
        res.json({ status: 0, message: "Sửa sản phẩm thất bại" });
    }
});

//[GET] /orders/:id
router.get("/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const data = await orderModel.findById({ _id: id });
        res.json(data);
    } catch {
        res.json({ status: false });
    }
});

module.exports = router;
