var UglifyJS = require("uglify-js");

//TODO 没完成，缺乏例子，以后再研究
exports.beautify = function(srcCode){
	var result = UglifyJS.minify(srcCode, {fromString: true });
	//console.log(result.code);
	return result.code;
}

function test_beautify(){
	//var receipe = new require('../model/receipe')();
	//console.log(receipe);
	//var result = exports.beautify(JSON.stringify(receipe));
	var content = require('fs').readFileSync('data/out/1.js','ascii');
    //
  var result = exports.beautify(content);
  console.log(result);
	//fs.writeFileSync(outFilename, beautifyJs(JSON.stringify(receipe)));
	//exports.beautify();
}
test_beautify();

//exports.beautify();