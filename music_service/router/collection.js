const express = require("express");
const router = express.Router();
const Joi = require("joi");

const pool = require("../utils/pool");

// 添加收藏歌曲
router.post('/addSongCollection', (req, res, next) => {
    let { receive_id, user_id,song_name,singer,song_surface,song_address } = req.body
    // 表单验证
    let schema = Joi.object({
        receive_id: Joi.number().required(),
        user_id: Joi.number().required(),
        song_name: Joi.string().required(),
        singer: Joi.string().required(),
        song_surface: Joi.string().required(),
        song_address: Joi.string().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, msg: error });
        return; // 结束
    }
    let sql = "insert into song_collection set ?"
    pool.query(sql,[{ receive_id, user_id,song_name,singer,song_surface,song_address}],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'添加成功'})
        }
    })
})

// 删除收藏的歌曲
router.get("/delSongCollection", (req, res, next) => {
    let { id } = req.query
    let schema = Joi.object({
        id:Joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('delete  from song_collection where id = ?', [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '删除成功' })
        }
    })
})

// 查询用户已经收藏的歌曲
router.get("/getSongCollection", (req, res, next) => {
    let { user_id,page,pagesize } = req.query
    let schema = Joi.object({
        user_id:Joi.number().required(),
        page:Joi.number().required(),
        pagesize:Joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select *  from song_collection where user_id = ? limit ? ,?', [user_id,start,size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功' ,data:r})
        }
    })
})

// 添加收藏歌单
router.post('/addSheetCollection', (req, res, next) => {
    let { receive_id, user_id,listName,sheetSurface,song_name } = req.body
    // 表单验证
    let schema = Joi.object({
        receive_id: Joi.number().required(),
        user_id: Joi.number().required(),
        listName: Joi.string().required(),
        sheetSurface: Joi.string().required(),
        song_name: Joi.string().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, msg: error });
        return; // 结束
    }
    let sql = "insert into sheet_collection set ?"
    pool.query(sql,[{ receive_id, user_id,listName,sheetSurface,song_name}],(err,r)=>{
        if(err){
            return next(err)
        }else{
            res.send({code:200,msg:'添加成功'})
        }
    })
})

// 删除收藏的歌单
router.get("/delSheetCollection", (req, res, next) => {
    let { id } = req.query
    let schema = Joi.object({
        id:Joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('delete  from sheet_collection where id = ?', [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '删除成功' })
        }
    })
})

// 查询用户已经收藏的歌单
router.get("/getSheetCollection", (req, res, next) => {
    let { user_id,page,pagesize } = req.query
    let schema = Joi.object({
        user_id:Joi.number().required(),
        page:Joi.number().required(),
        pagesize:Joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select *  from sheet_collection where user_id = ? limit ?,?', [user_id,start,size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功' ,data:r})
        }
    })
})

module.exports = router



