const mysql = require('mysql')
// 创建连接池
const pool = mysql.createConnection({
    connection:20,//最大连接数
    host:'localhost',
    user:'root',
    password:'root',//改成自己的数据库密码
    port:'3306',
    database:'music',
    multipleStatements:true //支持执行多条sql语句
})

// 为pool新增一个方法，同步执行sql的方法
pool.querySync = (sql,params)=>{
    return Promise((resolve,reject)=>{
        pool.query(sql,params,(err,result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
module.exports =pool