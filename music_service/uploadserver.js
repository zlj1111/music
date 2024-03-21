const express = require("express");
const cors = require("cors");

const uuid = require("uuid");
const app = express();

app.listen(9000, () => {
    console.log("9000端口已启动");
});

app.use(cors()); //允许跨域
// 设置托管目录
app.use(express.static("static"));
// 引入文件上传模块：multer
const multer = require("multer");
// 创建一个负责文件上传操作的对象
var upload = multer({
    //   diskStorage:生成硬盘的存储配置项
    storage: multer.diskStorage({
        destination: "static", //用于配置文件存放位置
        // 把接受请求的参数和文件信息，通过回调函数返回 希望的文件名
        filename(req, file, cb) {
            console.log("file:", file);
            var fn = file.originalname;
            var ext = fn.substr(fn.lastIndexOf("."));
            cb(null, uuid.v4() + ext);
        },
    }),
});


// <input type="file" name="avatar">
// let BASE = 'http://yf666.top:9000/'
let BASE = 'http://localhost:9000/'
app.post("/upload", upload.single("file"), (req, res) => {
    let url = BASE + req.file.filename;
    console.log(req.file);
    res.send(url);
});



