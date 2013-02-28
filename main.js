var     util = require('util'),
		fs = require('fs'),
		path = require('path'),
		domain =require('domain');

var parser = require('./parser');

var srcPath = path.resolve(__dirname, 'data/in');
var destPath = path.resolve(__dirname, 'data/out');
var fileList = fs.readdirSync(srcPath);
fileList.forEach(function(filename){
	if(!filename.indexOf('.htm'))return;
	var filePath = path.resolve(srcPath, filename);
	var content = fs.readFileSync(filePath, 'utf8');
	var xspParser = new parser('xsp');
    //console.log(xspParser);
	var receipe = xspParser.parse(content);
	//console.log(receipe);
    fs.writeFileSync(path.resolve(destPath,filename),JSON.stringify(receipe),'utf8' );
});

