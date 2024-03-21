const express = require('express');
const router = express.Router()
const pool = require('../utils/pool.js');
const joi = require("joi");

// 查询所有歌手
router.get('/allSinger', (req, res, next) => {
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
    // select singer.id,singer.singer,identity,singer.photo,short_detail,magnum_opus,heat,singer_heat.userId from singer,user,singer_heat where user.id=singer_heat.userId and singer.id=singer_heat.singer_id limit ?,?
    pool.query('select * from singer limit ?,?', [start, size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 添加歌手
router.post("/addSinger", (req, res, next) => {
    let { singer, identity, photo, short_detail, magnum_opus } = req.body;
    let schema = joi.object({
        singer: joi.string().required(),
        identity: joi.string().required(),
        photo: joi.string().required(),
        short_detail: joi.string().required(),
        magnum_opus: joi.string().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let heat = 0
    pool.query('insert into singer set ?', [{ singer, identity, photo, short_detail, magnum_opus,heat }], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '添加成功' })
        }
    })
})

// 修改歌手信息
router.post("/resetSinger", (req, res, next) => {
    let { id, singer, identity, photo, short_detail, magnum_opus } = req.body;
    let schema = joi.object({
        id: joi.number().required(),
        singer: joi.string().required(),
        identity: joi.string().required(),
        photo: joi.string().required(),
        short_detail: joi.string().required(),
        magnum_opus: joi.string().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('update singer set ? where id = ?', [{ singer, identity, photo, short_detail, magnum_opus }, id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            if (r.changedRows != 0) {
                res.send({ code: 200, msg: '修改成功' })
            }else{
                res.send({ code: 200, msg: '修改失败' })
            }
        }
    })
})

// 通过id查询歌手信息
router.get("/getSingerId", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from singer where id = ?', [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 通过歌手名查询歌手
router.get("/getSingerName", (req, res, next) => {
    let { singer } = req.query
    let schema = joi.object({
        singer: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query("select * from singer where singer like ?", [singer], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 通过id删除歌手
router.get("/delSingerId", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.string().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('delete  from singer where id = ?', [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '删除成功' })
        }
    })
})

// 歌手总数
router.get("/countSinger", (req, res, next) => {
    
    pool.query('select count(*) count from singer', (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功',data:r })
        }
    })
})

// 添加粉丝数
router.post("/addHeat", (req, res, next) => {
    let { userId,singer_id,singer_name,singer_avatar} = req.body;
    userId = Number(userId)
    singer_avatar = String(singer_avatar)
    let schema = joi.object({
        singer_id: joi.number().required(),
        singer_name: joi.string().required(),
        singer_avatar: joi.string().required(),
        userId: joi.number().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('insert into singer_heat set ?;update singer set heat = heat+1 where id = ?;', [{userId,singer_id,singer_name,singer_avatar},singer_id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            if (r.changedRows != 0) {
                res.send({ code: 200, msg: '修改成功' })
            }else{
                res.send({ code: 200, msg: '修改失败' })
            }
        }
    })
})

// 减少粉丝
router.post("/decreaseHeat", (req, res, next) => {
    let { singer_id,userId} = req.body;
    let schema = joi.object({
        singer_id: joi.number().required(),
        userId: joi.number().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('update singer set heat = heat-1 where id = ? and heat>0;delete from singer_heat where singer_id=? and userId=?', [singer_id,singer_id,userId], (err, r) => {
        if (err) {
            return next(err)
        } else {
            if (r.changedRows != 0) {
                res.send({ code: 200, msg: '修改成功' })
            }else{
                res.send({ code: 200, msg: '修改失败' })
            }
        }
    })
})

// 查询某一用户是否已经关注歌手
router.get("/getHeat", (req, res, next) => {
    let { singer_id,userId} = req.query;
    let schema = joi.object({
        singer_id: joi.number().required(),
        userId: joi.number().required()
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from singer_heat where singer_id=? and userId=?', [singer_id,userId], (err, r) => {
        if (err) {
            return next(err)
        } else {
            if(r.length==0){
                r=true
            }else{
                r=false
            }
            res.send({ code: 200, msg: '查询成功',data:r })
        }
    })
})

// 查询已经关注歌手列表
router.get("/getUserHeat", (req, res, next) => {
    let { userId} = req.query;
    let schema = joi.object({
        userId: joi.number().required()
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from singer_heat where  userId=?', [userId], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功',data:r })
        }
    })
})

// 查询某一个歌手粉丝数量
router.get("/getOneUserHeat", (req, res, next) => {
    let { id } = req.query;
    let schema = joi.object({
        id: joi.number().required()
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select heat from singer where  id=?', [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功',data:r })
        }
    })
})

router.get("/getSingerRaking",(req,res,next)=>{
    pool.query('select heat,singer from singer',(err,r)=>{
        if(err){
            return next(err)
        }else{
            // console.log(r);
            let temp = null
            for(let i=0;i< r.length;i++){
                for(let j=r.length-1;j>i;j--){
                    if(r[i].heat<r[j].heat){
                        temp=r[i]
                        r[i]=r[j]
                        r[j]=temp
                    }
                }
            }
            let r1 = []
            for(let i=0;i<=9;i++){
                r1.push(r[i])
            }
            res.send({code:200,msg:'查询成功',data:r})
        }
    })
})

// http://127.0.0.1:3000/
module.exports = router