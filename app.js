var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");



//mongoose
const mongoose = require("mongoose");
require("./models/categories/CategoryModels");
require("./models/products/ProductModels");
require("./models/users/UserModels");
require("./models/orderDetails/OrderdetailModels");
require("./models/orders/OrderModels");

//Kết nối mongoose database
//mongodb+srv://syvv819:vEuw2Mgy8dPqnf3Z@cluster0.zzeuovk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb://127.0.0.1:27017/db_ismart
mongoose
    .connect("mongodb://127.0.0.1:27017/db_ismart", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(">>>>>>>>>> DB Connected ✅!!"))
    .catch((err) => console.log(">>>>>>>>> DB Error: ❎", err));

//Khai báo Router
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/products");
var categoryRouter = require("./routes/category");
var orderRouter = require("./routes/orders");
var orderDetailRouter = require("./routes/orderdetail");
var mailerRouter = require("./routes/mailer");

var app = express();

var corsOptionsDelegate = function (req, callback) {
    var corsOptions = { origin: true };
    callback(null, corsOptions); 
};
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //Phục vụ các tập tin tĩnh

//Sử dụng Router (URL) Nơi show dữ liệu (API)
//http://localhost:3000/products
app.use(cors(corsOptionsDelegate));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", cors(corsOptionsDelegate), productRouter);
app.use("/categories", cors(corsOptionsDelegate), categoryRouter);
app.use("/users", cors(corsOptionsDelegate), usersRouter);
app.use("/orders", cors(corsOptionsDelegate), orderRouter);
app.use("/orderDetails", cors(corsOptionsDelegate), orderDetailRouter);
app.use("/mailer", cors(corsOptionsDelegate), mailerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
