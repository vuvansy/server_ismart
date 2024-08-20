const mongoose = require("mongoose"); //Import mongoose vào

//Trỏ về database
async function connect() {
    // try {
    //     await mongoose.connect("mongodb://localhost:27017/f8_education_dev", {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     });

    //     console.log("Kết nối thành công!");
    // } catch (error) {
    //     console.log("Kết nối thất bại!");
    // }
    try {
        mongoose.connect(
            "mongodb+srv://syvv819:vEuw2Mgy8dPqnf3Z@cluster0.zzeuovk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        );

        console.log("Kết nối DB thành công!!!");
    } catch (error) {
        console.log("Kết nối DB Thất bại!!!");
    }
}

module.exports = { connect };
