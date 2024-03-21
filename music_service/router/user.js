/**
 * 用户模块
 */

const express = require('express');
const router = express.Router()
const pool = require('../utils/pool.js');
const joi = require("joi");
const jwt = require('jsonwebtoken');
const secret_key = 'my_secret_key'

// 用户注册
router.post('/addUser',(req,res,next)=>{
    let {nickname,password,age,sex,phone} = req.body
    let schema = joi.object({
        nickname: joi.string().required(),
        password: joi.string().required(),
        age:joi.number().required(),
        sex:joi.string().required(),
        phone:joi.string().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'insert into user set ?'
    pool.query(sql,[{nickname,password,age,sex,phone}],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'添加成功'})
        }
    })
})

// 修改用户信息
router.post('/resetUser',(req,res,next)=>{
    let {nickname,password,age,sex,phone,id} = req.body
    let schema = joi.object({
        nickname: joi.string().required(),
        password: joi.string().required(),
        age:joi.number().required(),
        sex:joi.string().required(),
        phone:joi.string().required(),
        id:joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'update user set ? where id = ?'
    pool.query(sql,[{nickname,password,age,sex,phone},id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'修改成功'})
        }
    })
})

// 用户登录
router.post("/user/login", (req, resp,next)=>{
    let{phone, password} = req.body
    // 表单验证
    let schema = joi.object({
      phone: joi.string().required(), // 必填
      password: joi.string().required().pattern(new RegExp('^\\w{6,15}$')), // 必填
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
      resp.send({code:400,msg:error});
      return; // 结束
    }
    // 查询数据库，账号密码是否填写正确
    let sql = "select * from user where phone=? and password=?"
    pool.query(sql, [phone, password], (error, result)=>{
      if (error) {
       return next(error)
      }
      if(result.length==0){
        resp.send({code:1001, msg:'账号密码输入错误'});
      }else{
        // 获取登录用户对象
        let user = result[0]
        // 为该用户颁发一个token字符串，未来该客户端若做发送其他请求，则需要在请求Header中携带token，完成状态管理。
        let payload = {id: user.id, nickname: user.nickname}
        let token = jwt.sign(payload, secret_key, {expiresIn: '2d'})
        // 返回user对象与token字符串
        user.password = undefined
        resp.send({code : 200,msg:'ok',data:{user, token}});
      }
    })
  });

// 查询所有的用户
router.get('/allUsers',(req,res,next)=>{
    let { page, pagesize } = req.query;
    let schema = joi.object({
        page: joi.number().required(), // page必须是数字，必填
        pagesize: joi.number().integer().required(), // pagesize必须是不大于100的数字，必填
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from user limit ?,?',[start,size],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,data:r,msg:'查询成功'})
        }
    })
})

// 根据姓名查找某一用户
router.get('/userByName',(req,res,next)=>{
    let { nickname  } = req.query;
    let schema = joi.object({
        nickname: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = `select *from user where nickname like ?`
    pool.query(sql,[nickname],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'查询成功',data:r})
        }
    })
})

// 根据id查找某一用户
router.get('/userById',(req,res,next)=>{
    let { id  } = req.query;
    let schema = joi.object({
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'select *from user where id=?'
    pool.query(sql,[id],(err,r,next)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'查询成功',data:r})
        }
    })
})

// 删除用户
router.get('/delUserById',(req,res,next)=>{
    let { id  } = req.query;
    let schema = joi.object({
        id: joi.number().required()
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    id = Number(id)
    let sql = 'delete  from user where id=?'
    pool.query(sql,[id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'删除成功',data:r})
        }
    })
})

// 修改用户个人信息
router.post('/resetUserMsg',(req,res,next)=>{
    let {nickname,age,sex,avatar,id} = req.body
    let schema = joi.object({
        nickname: joi.string().required(),
        age:joi.number().required(),
        sex:joi.string().required(),
        avatar:joi.string().required(),
        id:joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'update user set ? where id = ?'
    pool.query(sql,[{nickname,age,sex,avatar},id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'修改成功'})
        }
    })
})

// 添加用户图片
router.post('/addPhoto',(req,res,next)=>{
    let {photo,user_id} = req.body
    let schema = joi.object({
        photo: joi.string().required(),
        user_id:joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'insert into person_photo set ?'
    pool.query(sql,[{photo,user_id}],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'添加成功'})
        }
    })
})

// 修改用户图片信息
router.post('/restPhoto',(req,res,next)=>{
    let {photo,id} = req.body
    let schema = joi.object({
        photo: joi.string().required(),
        id:joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'update person_photo set ? where id = '
    pool.query(sql,[{photo,id}],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'修改成功'})
        }
    })
})

// 查看用户图片
router.get('/getPhoto',(req,res,next)=>{
    let user_id= Number(req.query.user_id) 
    let schema = joi.object({
        user_id:joi.number().required()
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'select * from person_photo where user_id = ?';
    pool.query(sql,[user_id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'查询成功',data:r})
        }
    })
})

// 删除用户图片
router.get('/delPhoto',(req,res,next)=>{
    let id= Number(req.query.id) 
    let schema = joi.object({
        id:joi.number().required()
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'delete from person_photo where id = ?';
    pool.query(sql,[id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'删除成功'})
        }
    })
})

// 修改用户个人简介
router.post('/personalText',(req,res,next)=>{
    let {personalText,id} = req.body
    let schema = joi.object({
        personalText: joi.string().required(),
        id:joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'update user set ? where id = ?'
    pool.query(sql,[{personalText},id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'修改成功'})
        }
    })
})

// 用户总数
router.get("/countUser", (req, res, next) => {
    
    pool.query('select count(*) count from user', (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功',data:r })
        }
    })
})

// 查询各年龄段的人
router.get("/ageUser", (req, res, next) => {
    
    pool.query('select  age from user', (err, r) => {
        if (err) {
            return next(err)
        } else {
            let data = {}
            let arr1 = []
            let arr2 = []
            let arr3 = []
            let arr4 = []
            r.forEach(element => {
                element.age>=16&&element.age<=30?arr1.push(element.age):''
                element.age>30&&element.age<=40?arr2.push(element.age):''
                element.age>40&&element.age<=60?arr3.push(element.age):''
                element.age>60?arr4.push(element.age):''
            });
            data.arr1 = arr1.length
            data.arr2 = arr2.length
            data.arr3 = arr3.length
            data.arr4 = arr4.length
            res.send({ code: 200, msg: '查询成功',data:data })
        }
    })
})

// 查询男女人数
router.get("/sexUser", (req, res, next) => {
    
    pool.query('select  sex from user', (err, r) => {
        if (err) {
            return next(err)
        } else {
           let man = []
           let woman = []
           let data = {}
           r.forEach(item=>{
            if(item.sex === '男'){
                man.push(item.sex)
            }else{
                woman.push(item.sex)
            }
           })
           data.man = man.length
           data.woman = woman.length
            res.send({ code: 200, msg: '查询成功',data:data })
        }
    })
})

  

module.exports = router