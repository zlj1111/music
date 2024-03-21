const express = require("express");
const router = express.Router();
const Joi = require("joi");

const pool = require("../utils/pool");

// 查询用户动态
router.get("/getCommunity", (req, res, next) => {
    let { page,pagesize,user_id } = req.query
    let schema = Joi.object({
        page:Joi.number().required(),
        pagesize:Joi.number().required(),
        user_id:Joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select *  from community limit ?,?;select * from community_heat', [start,size], (err, r) => {
        for(let k = 0;k<r[0].length;k++){
            r[0][k].zan = false;
        }
        for(let i=0;i<r[1].length;i++){
            if(r[1][i].user_id == user_id){
                for(let j=0;j<r[0].length;j++){
                   if(r[1][i].community_id == r[0][j].id){
                    r[0][j].zan = true;
                   }
                }
            }
            
        }
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功' ,data:r[0].reverse()})
        }
    })
})

// 发动态
router.post("/addCommunity", (req, res, next) => {
    let { username,avatar,content,content_photo,user_id  } = req.body;
    let schema = Joi.object({
        username: Joi.string().required(),
        avatar: Joi.string().required(),
        content: Joi.string().required(),
        user_id: Joi.number().required(),
        content_photo: Joi.string().empty(),
    });
    let { error, value } = schema.validate({username,avatar,content,user_id});
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let heat = 0
    pool.query('insert into community set ?', [{ username,avatar,content,content_photo,user_id,heat:0 }], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '添加成功' })
        }
    })
})

// 查看动态的评论
router.get("/getCommunity_conent", (req, res, next) => {
    let { page,pagesize,community_id } = req.query
    let schema = Joi.object({
        page:Joi.number().required(),
        pagesize:Joi.number().required(),
        community_id:Joi.number().required(),

    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select *  from community_content where community_id = ? limit ?,?', [community_id,start,size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功' ,data:r.reverse()})
        }
    })
})

// 发表动态评论
router.post("/addCommunity_content", (req, res, next) => {
    let { username,avatar,content,user_id,community_id  } = req.body;
    let schema = Joi.object({
        username: Joi.string().required(),
        avatar: Joi.string().required(),
        content: Joi.string().required(),
        user_id: Joi.number().required(),
        community_id:Joi.number().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('insert into community_content set ?', [{ username,avatar,content,user_id,community_id }], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '添加成功' })
        }
    })
})

// 点赞
router.post("/addCommunityHeat", (req, res, next) => {
    let { user_id,community_id} = req.body;
    user_id = Number(user_id)
    let schema = Joi.object({
        user_id: Joi.number().required(),
        community_id: Joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('insert into community_heat set ?;update community set heat = heat+1 where id = ?;', [{user_id,community_id},community_id], (err, r) => {
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

// 取消点赞
router.post("/decreaseCommunityHeat", (req, res, next) => {
    let { user_id,community_id} = req.body;
    user_id = Number(user_id)
    let schema = Joi.object({
        user_id: Joi.number().required(),
        community_id: Joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('update community set heat = heat-1 where id = ? and heat>0;delete from community_heat where community_id=? and user_id=?', [community_id,community_id,user_id], (err, r) => {
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

// 查询是否点赞
router.get("/getCommunityHeat", (req, res, next) => {
    let { user_id,community_id} = req.query;
    let schema = Joi.object({
        user_id: Joi.number().required(),
        community_id: Joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from community_heat where community_id=? and user_id=?', [community_id,user_id], (err, r) => {
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

module.exports = router



