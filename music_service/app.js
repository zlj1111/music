const express = require('express');
const jwt = require("jsonwebtoken");
let secret_key = 'my_secret_key' //盐 自定义
const app = express()
const port = 3000

// 解决跨域
const cors = require('cors');
app.use(cors({origin:'*'}))

// 解析post请求参数
app.use(express.urlencoded());

// 端口
app.listen(port,()=>{
    console.log('3000端口已经启动')
})

const tokenTools = function(req,res,next){
	// 如果请求路径是 /login 则不再拦击截
	if(req.path == '/user/login' || req.path=='/admin/login' ){
		next()
		return
	}

	if(1 == 1 ){
		next()
		return
	}

	// token验证
	let token = req.headers['authorization']
	try{
		let payload = jwt.verify(token,secret_key)
		// 将token中存储的数据，直接复制给req，这样在后续业务中就可以使用req.tokenPayload获取这些信息
		req.tokenPayload = payload

	}catch(err){
		res.send({code:401,msg:'用户验证失败，请重新登录',err:err})
		return
	}
	next()
}
app.use(tokenTools)


// 引入组件
app.use(require('./router/admin.js'))
app.use(require('./router/singer.js'))
app.use(require('./router/song.js'))
app.use(require('./router/song_sheet.js'))
app.use(require('./router/user.js'))
app.use(require('./router/collection.js'))
app.use(require('./router/community'))


// 针对于mysql错误
app.use((err,req,res,next)=>{
	// 路由中所传递过来的错误信息
	console.log(err)
	// 响应服务器端错误
	res.send({code:500,msg:'服务器端错误'})
})