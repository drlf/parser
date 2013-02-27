var URL = require('url'),
	fs = require('fs'),
	//queue = require('./queue').queue,
	$ = require('jQuery'),
	path = require('path'),
	parseUrlToFilePath = require('../fsHelper').parseUrlToFilePath,
	mkdirpSync = require('../fsHelper').mkdirpSync,
	getCollection = require('../dbHelper').getCollection,
	urlParser = URL.parse;


var baseDir = path.resolve(g_cfg.rootPath , 'data' );	
	

/*
把从网络读取的文件存储在本地.默认文件名取url中的路径和文件名
*/
exports.saveAsFile = saveAsFile;

/*
把url路径转换为存储在本地的路径
body 要存入文件的文本内容，utf8格式
*/
function saveAsFile(url, contentStr, cb){
    if(!contentStr){
        cb(new Error('文件内容为空'));
        return;
    }
    var f = new parseUrlToFilePath(url);
    var filePath = path.resolve(baseDir , f.path, f.filename);	//文件绝对路径,含文件名
    //TODO创建前须先检测该目录是否存在。或则mkdir中加缓存，如果已经创建过的，直接返回。
    mkdirpSync(baseDir, f.path);
    fs.writeFile(filePath,contentStr,'utf8',cb);
}

/**
 * 默认保存到本地mongodb的crawler数据库data collection.
 * _id为url，content为要保存的内容
**/
function saveAsDb(url, contentStr, cb){
    if(!contentStr){
        cb(new Error('文件内容为空'));
        return;
    }
    getCollection('data', function(err, collection){
    	if(err)throw err;
    	var obj = {_id: url, content: contentStr};
    	collection.insert(obj,cb);
    });
}

function test(){
	var url = 'http://127.0.0.1/main.html';
	baseDir = path.resolve(__dirname , '../../data' );
	console.log(baseDir);	
	/*saveAsFile(url,'test content.',function(){
		console.log('success!');
	});*/
	saveAsDb(url,'test content.',function(err){
		if(err)throw err;
		console.log('success!');
	});
	
}

//test();
