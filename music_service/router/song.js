const express = require('express');
const router = express.Router()
const pool = require('../utils/pool.js');
const joi = require("joi");

// 管理员添加音乐
router.post("/addSongs",(req,res,next)=>{
    let {  song_name,singer, song_surface,song_address,songSheetName } = req.body;
    let schema = joi.object({
        song_name: joi.string().required(),
        singer: joi.string().required(),
        song_surface:joi.string().required(),
        song_address:joi.string().required(),
        songSheetName:joi.string().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let check = 1
    pool.query('insert into song set ?',[{ song_name,singer, song_surface,song_address,songSheetName,check }],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'添加成功'})
        }
    })
})

// 用户添加音乐
router.post("/userAddSongs",(req,res,next)=>{
    let {  song_name,singer, song_surface,song_address } = req.body;
    let schema = joi.object({
        song_name: joi.string().required(),
        singer: joi.string().required(),
        song_surface:joi.string().required(),
        song_address:joi.string().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let check = 0
    pool.query('insert into song set ?',[{ song_name,singer, song_surface,song_address,check }],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'添加成功'})
        }
    })
})

// 管理员审核音乐
router.post("/checkSongs",(req,res,next)=>{
    let {id,check} = req.body
    if(check==0){check = 1}else{
        check = 0
    }
    pool.query('update song set song.check = ? where id = ?',[check ,id],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'修改成功'})
        }
    })
})

// 修改音乐信息
router.post("/resetSongs",(req,res,next)=>{
    let {  id,song_name,singer, song_surface,songSheetName } = req.body;
    let schema = joi.object({
        song_name: joi.string().required(),
        singer: joi.string().required(),
        song_surface:joi.string().required(),
        id:joi.number().required(),
        songSheetName:joi.string().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('update song set ? where id = ?',[{ song_name,singer, song_surface,songSheetName},id],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'修改成功'})
        }
    })
})

// 查询审核通过的音乐列表
router.get("/getSongs",(req,res,next)=>{
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
    pool.query('select * from song where song.check = 1  limit ?,? ',[start,size],(err,r)=>{
        if(err){
            return next(err)
        }else{
            r = r.reverse()
           res.send({code:200,msg:'请求成功',data:r})
        }
    })
})

// 查询未审核通过的音乐列表
router.get("/getCheckSongs",(req,res,next)=>{
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
    pool.query('select * from song where song.check = 0  limit ?,? ',[start,size],(err,r)=>{
        if(err){
            return next(err)
        }else{
            r = r.reverse()
           res.send({code:200,msg:'请求成功',data:r})
        }
    })
})

// 通过id查询音乐
router.get("/getSongsId",(req,res,next)=>{
    let {id} = req.query
    let schema = joi.object({
        id: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from song where id = ?',[id],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'请求成功',data:r})
        }
    })
})

// 通过歌名查询音乐
router.get("/getSongsName",(req,res,next)=>{
    let {song_name} = req.query
    let schema = joi.object({
        song_name: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from song where song_name = ? and song.check = 1',[song_name],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'请求成功',data:r})
        }
    })
})

// 通过id删除
router.get("/delSongsId",(req,res,next)=>{
    let {id} = req.query
    let schema = joi.object({
        id: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('delete  from song where id = ?',[id],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'删除成功'})
        }
    })
})

// 通过id查询歌曲地址
router.get("/getSongAdrId",(req,res,next)=>{
    let {id} = req.query
    let schema = joi.object({
        id: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select song_address from song where id = ?',[id],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'查询成功',data:r})
        }
    })
})

// 歌曲总数
router.get("/countSong", (req, res, next) => {
    
    pool.query('select count(*) count from song', (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功',data:r })
        }
    })
})

// 通过歌手名获取歌曲信息
router.get("/getSongsBySinger",(req,res,next)=>{
    let {singer} = req.query
    let schema = joi.object({
        singer: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from song where singer = ?',[singer],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'请求成功',data:r})
        }
    })
})

// 模糊查询用户上传歌曲
router.get("/getUserSongsName",(req,res,next)=>{
    let {song_name} = req.query
    let schema = joi.object({
        song_name: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from song where song_name = ? and song.check = 0',[song_name],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'请求成功',data:r})
        }
    })
})





// http://127.0.0.1:3000/
module.exports = router





