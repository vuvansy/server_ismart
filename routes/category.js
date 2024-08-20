var express = require("express");
var router = express.Router();
var categoryModel = require("../models/categories/CategoryModels");
const authen = require("../middleware/authen");
const multer = require("multer");

//UPLOAD FILE
// Cấu hình lưu trữ file

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/categories"); //Đương dẫn nơi lưu file hinh ảnh
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

//[POST] /categories/ có upload hình môn Nextjs
router.post(
    "/",
    [upload.single("profile_pic")],
    async function (req, res, next) {
        try {
            const { name } = req.body;

            const imageUrl = `http://localhost:3000/images/categories/${req.file.filename}`;

            const data = await categoryModel.create({
                name,
                image: imageUrl,
                status: "0",
            });

            res.json({ status: 200, message: "Thêm thành công" });
        } catch (error) {
            res.json({ status: 500, message: "Thêm mới thất bại" });
        }
    }
);

router.put("/:id", [upload.single("profile_pic")], async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        let item = await categoryModel.findById(id);

        if (!item) {
            return res
                .status(404)
                .json({ status: 404, message: "Không tìm thấy sản phẩm" });
        }

        // Nếu có file ảnh mới được gửi lên
        if (req.file) {
            const imageUrl = `http://localhost:3000/images/categories/${req.file.filename}`;
            item.image = imageUrl;
        }
        item.name = name ? name : item.name;
        await item.save();

        res.json({ status: 200, message: "Cập nhật sản phẩm thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Cập nhật sản phẩm thất bại",
        });
    }
});

/* GET category listing. */
// router.get("/", [authen], async function (req, res, next) {
//     const data = await categoryModel.find();

//     res.json(data);
// });
router.get("/", async function (req, res, next) {
    try {
        const data = await categoryModel.find();
        res.json(data);
    } catch {
        res.json({ status: error, message: "Lấy dữ liệu thất bại" });
    }
});


//[DELETE] categories/:id/delete
router.delete("/delete/:id", async function (req, res, next) {
    try {
        var id = req.params.id;
        await categoryModel.findByIdAndDelete(id);
        res.json({ status: 200, message: "Xóa sản phẩm thành công" });
    } catch (err) {
        res.json({ status: 400, message: "Xóa sản phẩm thất bại", err: err });
    }
});

// [GET] category:id
router.get("/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const data = await categoryModel.findById({ _id: id });
        res.json(data);
        // console.log(data);
    } catch {
        res.json({ status: false });
    }
});

module.exports = router;


