const express = require('express');
const router = express.Router()
const pool = require('../utils/pool.js');
const joi = require("joi");


// 管理员添加歌单
router.post("/addSongs_list", (req, res, next) => {
    let { listName, sheetSurface } = req.body;
    let schema = joi.object({
        listName: joi.string().required(),
        sheetSurface: joi.string().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let check = 1
    pool.query('insert into song_list set ?', [{ listName, sheetSurface,check }], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '添加成功' })
        }
    })
})

// 用户添加歌单
router.post("/userAddSongsSheet", (req, res, next) => {
    let { listName, sheetSurface,userId } = req.body;
    let schema = joi.object({
        listName: joi.string().required(),
        sheetSurface: joi.string().required(),
        userId: joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let check = 0
    pool.query('insert into song_list set ?', [{ listName, sheetSurface,userId,check }], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '添加成功' })
        }
    })
})

// 用户通过用户id查询歌单列表
router.get("/getUserSongsListId", (req, res, next) => {
    let { userId } = req.query
    let schema = joi.object({
        userId: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from song_list where userId = ?', [userId], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})


// 修改歌单
router.post("/resetSongsList", (req, res, next) => {
    let { id, listName, sheetSurface } = req.body;
    let schema = joi.object({
        listName: joi.string().required(),
        sheetSurface: joi.string().required(),
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('update song_list set ? where id = ?', [{ listName, sheetSurface }, id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '修改成功' })
        }
    })
})

// 管理员通过id查询歌单
router.get("/getSongsListId", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query("select * from song_list where id = ?", [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 通过id查询歌单用户歌单列表
router.get("/getUserSheetSongsName", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query("select * from user_sheetsongs where sheetId = ?", [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 管理员通过歌单名查询歌单
router.get("/getSongs_listName", (req, res, next) => {
    let { listName, page, pagesize } = req.query;
    let schema = joi.object({
        page: joi.number().required(), // page必须是数字，必填
        pagesize: joi.number().integer().required(), // pagesize必须是不大于100的数字，必填
        listName: joi.string().required()
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from song_list where listName = ? limit ?,?;', [listName, start, size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 用户通过歌单名查询歌单
router.get("/getUserSongsListName", (req, res, next) => {
    let { listName, page, pagesize } = req.query;
    let schema = joi.object({
        page: joi.number().required(), // page必须是数字，必填
        pagesize: joi.number().integer().required(), // pagesize必须是不大于100的数字，必填
        listName: joi.string().required()
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select * from song_list where listName = ? and userId is not null limit ?,?', [listName, start, size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})


// 通过id删除歌单
router.get("/delSongs_listId", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query("delete  from song_list where id = ? ", [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '删除成功' })
        }
    })
})

// 向歌单添加歌曲
router.post('/addsongToList', (req, res, next) => {
    let { songs_src, id } = req.body
    let schema = joi.object({
        id: joi.number().required(),
        songs_src: joi.string().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('update song_list set ? where id = ?', [{ songs_src }, id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '添加成功' })
        }
    })
})

// 获取歌单名称
router.get("/getSongListName", (req, res, next) => {
    pool.query('select listName  from song_list where song_list.check', (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '查询成功', data: r })
        }
    })
})

// 管理员通过id查找歌单名下的所有歌曲
router.get("/getSheetSongs", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select song.id,song_name,singer,song_address,song_surface from song_list,song where song_list.listName = song.songSheetName and song_list.id = ?', [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 通过id查找用户歌单名下的所有歌曲
router.get("/getUserSheetSongs", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('select user_sheetsongs.id,song_name,singer,song_address,song_surface from song_list,user_sheetsongs where song_list.id = user_sheetsongs.sheetId and song_list.id = ?', [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '请求成功', data: r })
        }
    })
})

// 添加歌单评论
router.post("/addSheetContent",(req, res, next) => {
    let { username, avatar,content,list_id,user_id } = req.body;
    let schema = joi.object({
        username: joi.string().required(),
        avatar: joi.string().required(),
        content:joi.string().required(),
        list_id:joi.number().required(),
        user_id:joi.number().required()
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query('insert into content set ?', [{ username, avatar,content,list_id,user_id }], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '添加成功' })
        }
    })
})

// 查询某一歌单下的所有评论
router.get('/getSheetContent',(req,res,next)=>{
    let { list_id } = req.query
    let schema = joi.object({
        list_id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let sql = 'select * from content where list_id = ?'
    pool.query(sql,[list_id],(err,r)=>{
        if(err){
            return next(err)
        }else{
            r = r.reverse()
            res.send({code:200,msg:'请求成功',data:r})
        }
    })
})

// 获取歌单
router.get("/getSongs_list", (req, res, next) => {
    let { page, pagesize } = req.query;
    let schema = joi.object({
        page: joi.number().required(), // page必须是数字，必填
        pagesize: joi.number().integer().required()// pagesize必须是不大于100的数字，必填
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    // select songSheetName,song_name from song_list,song where song_list.listName=song.songSheetName;select id,listName,sheetSurface from song_list where song_list.check=1 limit ?,?
    pool.query("select songSheetName,song_name from song_list,song where song_list.listName=song.songSheetName;select id,listName,sheetSurface from song_list where song_list.check=1 limit ?,?;select listName,song_name from song_list,user_sheetsongs where song_list.id=user_sheetsongs.sheetId",[start,size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            // Array.prototype.remove = function (v) {
            //     let index = this.indexOf(v)
            //     if (index != -1) {
            //         this.splice(index, 1)
            //     }
            // }
            let data1 = []
            let data2 = []
            let data3 = []
            for (let i = 0; i < r[1].length; i++) {
                data1[i] = {}
                data1[i].listName = r[1][i].listName
                data1[i].id = r[1][i].id
                data1[i].sheetSurface = r[1][i].sheetSurface
                for (let j = 0; j < r[0].length; j++) {
                    if (r[1][i].listName == r[0][j].songSheetName) {
                        data2.push(r[0][j].song_name)
                    }
                }
                for(let j = 0; j < r[2].length; j++) {
                    if (r[1][i].listName == r[2][j].listName) {
                        data3.push(r[2][j].song_name)
                    }
                }
                data1[i].song_name = data2
                data1[i].userPushSongs = data3
                data2 = []
                data3 = []
            }
            res.send({ code: 200, msg: '查询成功', data: data1.reverse() })
        }
    })
})

// 审核用户歌单，通过则进入推荐歌单
router.post("/checkSheet",(req,res,next)=>{
    let {id,check} = req.body
    if(check==0){
        check = 1
    }else{
        check = 0
    }
    pool.query('update song_list set song_list.check = ? where id = ?',[check ,id],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'修改成功'})
        }
    })
})

// 查询所有的用户歌单
router.get("/getUserSheet",(req,res,next)=>{
    let { page, pagesize } = req.query;
    let schema = joi.object({
        page: joi.number().required(), // page必须是数字，必填
        pagesize: joi.number().integer().required()// pagesize必须是不大于100的数字，必填
    });
    let { error, value } = schema.validate(req.query);
    let size = parseInt(pagesize);
    let start = (page - 1) * size;
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query("select listName,song_name from song_list,user_sheetsongs where song_list.id=user_sheetsongs.sheetId;select id,listName,sheetSurface,song_list.check,userId from song_list where song_list.userId!='' limit ?,?",[start,size], (err, r) => {
        if (err) {
            return next(err)
        } else {
            let data1 = []
            let data2 = []
            for (let i = 0; i < r[1].length; i++) {
                data1[i] = {}
                data1[i].listName = r[1][i].listName
                data1[i].id = r[1][i].id
                data1[i].sheetSurface = r[1][i].sheetSurface
                data1[i].check = r[1][i].check
                data1[i].userId = r[1][i].userId
                for (let j = 0; j < r[0].length; j++) {
                    if (r[1][i].listName == r[0][j].listName) {
                        data2.push(r[0][j].song_name)
                    }
                }
                data1[i].song_name = data2
                data2 = []
            }
            res.send({ code: 200, msg: '查询成功', data: data1.reverse() })
        }
    })
})

// 向用户歌单添加音乐
router.post("/addSongsToUserSheet",(req,res,next)=>{
    let {  song_name,singer, song_surface,song_address,userId,sheetId,songId } = req.body;
    let schema = joi.object({
        song_name: joi.string().required(),
        singer: joi.string().required(),
        song_surface:joi.string().required(),
        song_address:joi.string().required(),
        userId:joi.number().required(),
        sheetId:joi.number().required(),
        songId:joi.number().required(),
    });
    let { error, value } = schema.validate(req.body);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    let check = 1
    pool.query('insert into user_sheetSongs set ?',[{ song_name,singer, song_surface,song_address,check,userId,sheetId,songId }],(err,r)=>{
        if(err){
            return next(err)
        }else{
           res.send({code:200,msg:'添加成功'})
        }
    })
})

//获取用户歌单歌曲列表
// router.get("/getUserSheetSongs",(req,res,next)=>{
//     let {userId,sheetId} = req.query
//     let schema = joi.object({
//         userId:joi.number().required(),
//         sheetId:joi.number().required(),
//     });
//     let { error, value } = schema.validate(req.query);
//     if (error) {
//         res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
//         return; //结束
//     }
//     pool.query('select * from user_Sheetsongs where userId=? and sheetId = ?',[userId,sheetId],(err,r)=>{
//         if(err){
//             return next(err)
//         }else{
//             r = r.reverse()
//             res.send({code:200,message:'查询成功',data:r})
//         }
//     })
// })

// 删除用户歌单中的歌曲
router.get("/delUserSheetSong", (req, res, next) => {
    let { id } = req.query
    let schema = joi.object({
        id: joi.number().required(),
    });
    let { error, value } = schema.validate(req.query);
    if (error) {
        res.send({ code: 400, message: error }); //如果参数类型或者参数错误，返回400
        return; //结束
    }
    pool.query("delete  from user_sheetsongs where id = ? ", [id], (err, r) => {
        if (err) {
            return next(err)
        } else {
            res.send({ code: 200, msg: '删除成功' })
        }
    })
})



module.exports = router
