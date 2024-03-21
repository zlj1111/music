const express = require("express");
const router = express.Router();
const Joi = require("joi");

const pool = require("../utils/pool");
const jwt = require("jsonwebtoken") //引入jsontoken
let secret_key = 'my_secret_key' //盐 自定义

// 处理管理员登录
router.post('/admin/login', (req, res, next) => {
    let { phone, password } = req.body
    // 表单验证
    let schema = Joi.object({
        phone: Joi.number().required(),
        password: Joi.string().required().pattern(new RegExp('^\\w{3,15}$')),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, msg: error });
        return; // 结束
    }
    let sql = "select * from admin where phone=?  and password = ?"
    pool.query(sql, [phone, password], (err, r) => {
        if (err) {
            return next(err)
        }
        if (r.length == 0) {
            res.send({ code: 1001, msg: '账号密码输入错误' });
        } else {
            // 获取用户登录对象
            let admin = r[0]
            // 为该用户办法token字符串
            let payload = { id: admin.id, admin_name: admin.admin_name }
            let token = jwt.sign(payload, secret_key, { expiresIn: '1d' })
            // 返回 user 对象与token字符串
            admin.password = undefined
            res.send({ code: 200, msg: 'ok', admin: { admin, token } })
        }
    })
})

// 修改管理员信息
router.post('/admin/alter',(req,res,next)=>{
    let {admin_name,phone,address,avatar,id} = req.body
    // 表单验证
    let schema = Joi.object({
        admin_name:Joi.string().required(),
        address:Joi.string().required(),
        avatar:Joi.string().required(),
        phone: Joi.number().required(),
        id: Joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, msg: error });
        return; // 结束
    }
    let sql = 'update admin set ? where id=?'
    pool.query(sql,[{admin_name,phone,address,avatar},id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'更改成功'})
        }
    })
})


module.exports = router



