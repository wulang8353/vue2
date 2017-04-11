var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port; // 当前环境下的PORT || 9000

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
	req.url = '/index.html'; // 请求地址
	next();
});

app.use(router); // 使用路由异步接口router

var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router(); // 使用路由异步接口apiRoutes

apiRoutes.get('/seller', function (req, res) {
	res.json({
		errno: 0,
		data: seller
	});
});

apiRoutes.get('/goods', function (req, res) {
	res.json({
		errno: 0,
		data: goods
	});
});

apiRoutes.get('/ratings', function (req, res) {
	res.json({
		errno: 0,
		data: ratings
	});
});

app.use('/api', apiRoutes);

app.use(express.static('./dist'));  // 定义静态目录

// 启动
module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
});
