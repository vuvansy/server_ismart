var express = require("express");
var router = express.Router();
var userModel = require("../models/users/UserModels.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* GET users listing. */

//[GET] /users
router.get("/", async function (req, res, next) {
    data = await userModel.find();
    res.json(data);
});

router.post("/register", async function (req, res, next) {
    try {
        const {
            username,
            fullname,
            email,
            password,
            phone,
            address,
            confirm_password,
            role = "0", // set default role to "0"
        } = req.body;

        if (password !== confirm_password) {
            throw new Error("Mật khẩu không trùng khớp");
        }

        // kiểm tra xem username đã tồn tại chưa
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            throw new Error("Tên đăng nhập đã được sử dụng.");
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const user = new userModel({
            username,
            fullname,
            email,
            phone,
            address,
            password: hash,
            role,
        });
        await user.save();
        res.json({
            status: 200,
            data: user,
            message: "Đăng ký tài khoản thành công!",
        });
    } catch (error) {
        res.json({
            status: 400,
            message: "Thêm mới thất bại",
            error: error.message,
        });
    }
});

router.patch("/update/:id", async (req, res) => {
    const id = req.params.id;
    const {
        username,
        fullname,
        email,
        phone,
        address,
        password,
        confirm_password,
        role,
    } = req.body;

    try {
        const user = await userModel.findById(id);
        // console.log(user);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
            });
        }
        user.username = username;
        user.fullname = fullname;
        user.email = email;
        user.phone = phone;
        user.address = address;
        user.role = role;

        if (password && confirm_password) {
            if (password !== confirm_password) {
                return res.status(400).json({
                    message: "Mật khẩu và xác nhận mật khẩu không khớp",
                });
            }

            // Mã hóa mật khẩu mới
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            user.password = hashedPassword; // Lưu mật khẩu đã băm
        }
        await user.save();

        res.json({
            status: 200,
            data: user,
            message: "Cập nhật người dùng thành công!",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//+Dùng cho Angular
router.put("/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        const {
            username,
            fullname,
            email,
            phone,
            address,
            password,
            confirm_password,
        } = req.body;

        // Kiểm tra xem password và confirm_password có trùng khớp không
        if (password !== confirm_password) {
            throw new Error("Mật khẩu không trùng khớp");
        }

        // Kiểm tra xem username đã tồn tại chưa (trừ trường hợp chính người dùng đó)
        const existingUser = await userModel.findOne({
            username,
            _id: { $ne: userId },
        });
        if (existingUser) {
            throw new Error("Tên đăng nhập đã được sử dụng");
        }

        // Mã hóa mật khẩu mới
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Cập nhật thông tin người dùng
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                username,
                fullname,
                email,
                phone,
                address,
                password: hash,
            },
            { new: true }
        );

        res.json({
            status: 200,
            data: updatedUser,
            message: "Cập nhật tài khoản thành công",
        });
    } catch (error) {
        res.json({
            status: 400,
            message: "Cập nhật tài khoản thất bại",
            error: error.message,
        });
    }
});

router.patch("/password/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Kiểm tra xem password và confirm_password có trùng khớp không
        if (newPassword !== confirmNewPassword) {
            return res.json({
                status: 404,
                message: "Mật khẩu mới không trùng khớp",
            });
        }

        // Tìm người dùng bằng id
        const user = await userModel.findById(userId);

        // Kiểm tra mật khẩu hiện tại
        const isMatch = bcrypt.compareSync(currentPassword, user.password);
        if (!isMatch) {
            return res.json({
                status: 500,
                message: "Mật khẩu hiện tại không đúng",
            });
        }

        // Mã hóa mật khẩu mới
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        // Cập nhật mật khẩu
        user.password = hashedPassword;
        await user.save();

        res.json({
            status: 200,
            message: "Đổi mật khẩu thành công",
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Đổi mật khẩu thất bại",
            error: error.message,
        });
    }
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, fullname, email, phone, address } = req.body;

    try {
        // Find the user by id
        const user = await userModel.findById(id);

        if (!user) {
            return res.json({
                status: 404,
                message: "Không tìm thấy người dùng",
            });
        }

        // Update the user's information
        user.username = username;
        user.fullname = fullname;
        user.email = email;
        user.phone = phone;
        user.address = address;

        // Save the updated user
        await user.save();

        // Return the updated user
        res.json({
            status: 200,
            data: user,
            message: "Cập nhật người dùng thành công!",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/checktoken", async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            // Xác thực token
            const data = jwt.verify(token, "shhhhh");
            // Trả về dữ liệu người dùng bao gồm cả role
            res.json({ data: data.data });
        } else {
            res.status(401).json({ error: "Not authorized" });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

//lấy thông tin chi tiết user qua token
router.get("/detailuser", async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const data = jwt.verify(token, "shhhhh");
            // console.log(data);
            const userInfo = await userModel.findOne({
                username: data.data.username,
            });
            if (userInfo) {
                res.status(200).json(userInfo);
            } else {
                res.status(404).json({ message: "Không tìm thấy user" });
            }
        } else {
            res.status(401).json({ error: "Not authorized!!" });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        const data = await userModel.findOne({ username });
        // kiểm tra password đã mã hóa
        if (data && bcrypt.compareSync(password, data.password)) {
            const access_token = jwt.sign({ data }, "shhhhh", {
                expiresIn: 90 * 24 * 60 * 60,
            });
            const refresh_token = jwt.sign({ data }, "shhhhh", {
                expiresIn: 90 * 24 * 60 * 60,
            });
            // access token là chuỗi ngẫu nhiên, dùng để xác thực người dùng
            // refresh token là chuỗi ngẫu nhiên, dùng để lấy lại access token
            res.json({
                status: 200,
                data,
                access_token,
                refresh_token,
                message: "Đăng nhập thành công!",
            });
        } else {
            res.json({
                status: 300,
                message: "Sai tên đăng nhập hoặc mật khẩu",
            });
        }
    } catch (error) {
        res.json({ status: 500, message: "Lỗi bên server" });
    }
});

router.post("/refresh-token", async function (req, res, next) {
    try {
        let { refresh_token } = req.body;
        const data = jwt.verify(refresh_token, "shhhhh");
        const access_token = jwt.sign({ user: data.user }, "shhhhh", {
            expiresIn: 1 * 60,
        });
        refresh_token = jwt.sign({ user: data.user }, "shhhhh", {
            expiresIn: 90 * 24 * 60 * 60,
        });
        res.status(200).json({ user: data.user, access_token, refresh_token });
    } catch (error) {
        res.status(414).json({ error: error.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        const userId = req.params.id;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "Lỗi khi xóa người dùng" });
        }
        res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        next(error);
    }
});

//[GET] /users/:id
router.get("/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        data = await userModel.findById({ _id: id });
        res.json(data);
    } catch {
        res.json({ status: false });
    }
});

module.exports = router;
