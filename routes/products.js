var express = require("express");
var router = express.Router();

const multer = require("multer");
const authen = require("../middleware/authen");
var productModel = require("../models/products/ProductModels");

router.get("/", async function (req, res, next) {
    const data = await productModel.find();
    res.json(data);
});

router.get("/hot", async function (req, res, next) {
    try {
        const data = await productModel.find({ role: 1 });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

//Tìm kiếm sản phẩm
router.get("/search", async function (req, res, next) {
    const { keyword } = req.query;
    const data = await productModel.find({
        name: { $regex: keyword, $options: "i" },
    });
    res.json(data);
});

router.get("/new/category/:id", async function (req, res, next) {
    try {
        const id = req.params.id;
        const data = await productModel
            .find({ categoryId: id })
            .sort({ createdAt: -1 })
            .limit(8);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

//Lấy ra danh sách sản phẩm sắp hết quantity <10
router.get("/quantity/", async function (req, res, next) {
    try {
        const data = await productModel.find({ quantity: { $lte: 5 } });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// Router để cập nhật số lượng sản phẩm
router.patch("/:productId/update-stock", async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        // Tìm sản phẩm theo ID
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        // Cập nhật số lượng sản phẩm
        product.quantity += quantity; // Giả sử bạn có thuộc tính stock để lưu trữ số lượng sản phẩm

        // Lưu sản phẩm sau khi cập nhật
        await product.save();

        res.status(200).json({
            message: "Cập nhật số lượng thành công",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Có lỗi xảy ra khi cập nhật số lượng sản phẩm",
        });
    }
});

//UPLOAD FILE
// Cấu hình lưu trữ file

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images"); //Đương dẫn nơi lưu file hinh ảnh
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

// const upload = multer({ dest: "./public/images" });
const upload = multer({ storage: storage });

router.post(
    "/upload",
    [upload.single("profile_pic")],
    async (req, res, next) => {
        // Xử lý yêu cầu upload file
        try {
            const { file } = req;
            // Kiểm tra xem có file được gửi lên hay không
            if (!file) {
                return res.json({ status: 0, link: "" });
            } else {
                // Tạo URL để truy cập vào file đã upload
                const url = `http://localhost:3000/public/images/${file.filename}`;
                console.log(url);
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log("Upload image error: ", error);
            return res.json({ status: 0, link: "" });
        }
    }
);

//UPLOADS nhiều file hình
router.post(
    "/uploadAll",
    [upload.array("multiple_images", 9)],
    async (req, res, next) => {
        try {
            const files = req.files;
            if (!files) {
                return res.json({ status: 0, link: [] });
            } else {
                const url = [];
                for (const singleFile of files) {
                    url.push(
                        `http://localhost:3000/public/images/${singleFile.filename}`
                    );
                }
                return res.json({ status: 1, urls: url });
            }
        } catch (error) {
            console.log("Upload image error: ", error);
            return res.json({ status: 0, link: [] });
        }
    }
);

// [GET] /products/categories/:id
router.get("/categories/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const data = await productModel.find({ categoryId: id });
        res.json(data);
    } catch {
        res.json({ status: false });
    }
});

router.get("/cate/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 8;
        const skip = (page - 1) * limit;

        const data = await productModel
            .find({ categoryId: id })
            .skip(skip)
            .limit(limit);

        const count = await productModel.countDocuments({ categoryId: id });
        const totalPages = Math.ceil(count / limit);

        res.json({
            data,
            currentPage: page,
            totalPages,
            totalItems: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Lỗi server" });
    }
});

// giá < 5000

router.get("/filter/:max", async function (req, res, next) {
    try {
        const { max } = req.params;
        const data = await productModel.findById({ price: { $lte: max } });
        res.json(data);
    } catch {
        res.json({ status: false });
    }
});

//[POST] /products/
router.post(
    "/",
    [upload.single("profile_pic")],
    async function (req, res, next) {
        try {
            const {
                name,
                price_new,
                price_old,
                quantity,
                description,
                categoryId,
            } = req.body;

            const imageUrl = `http://localhost:3000/images/${req.file.filename}`;

            const data = await productModel.create({
                name,
                price_new,
                price_old,
                quantity,
                product_image: imageUrl,
                description,
                categoryId,
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
        const {
            name,
            price_new,
            price_old,
            quantity,
            description,
            categoryId,
        } = req.body;

        let item = await productModel.findById(id);

        if (!item) {
            return res
                .status(404)
                .json({ status: 404, message: "Không tìm thấy sản phẩm" });
        }

        // Nếu có file ảnh mới được gửi lên
        if (req.file) {
            const productImageUrl = `http://localhost:3000/images/${req.file.filename}`;
            item.product_image = productImageUrl;
        }

        item.name = name ? name : item.name;
        item.price_old = price_old ? price_old : item.price_old;
        item.price_new = price_new ? price_new : item.price_new;
        item.quantity = quantity ? quantity : item.quantity;
        item.categoryId = categoryId ? categoryId : item.categoryId;
        item.description = description ? description : item.description;

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

//[DELETE] products/:id/delete
router.delete("/delete/:id", async function (req, res, next) {
    try {
        var id = req.params.id;
        await productModel.findByIdAndDelete(id);
        res.json({ status: 1, message: "Xóa sản phẩm thành công" });
    } catch (err) {
        res.json({ status: 0, message: "Xóa sản phẩm thất bại", err: err });
    }
});

//[GET] /products/:id
router.get("/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const data = await productModel.findById({ _id: id });
        res.json(data);
    } catch {
        res.json({ status: false });
    }
});

module.exports = router;
