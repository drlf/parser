var Receipe = require('../../model/receipe'),
		$ = require('jQuery'),
        ClearNullArr = require('../arrayUtil').ClearNullArr;
		fs = require('fs');

exports.parse = parse;

var selector = {
    "title": "h1.span-15",
    "description":"",
    "catelog":[],
    "tags":[],
    "images":[],
    //"steps":"h2[class='no-bottom orange']:contains('做法') ~p",
    "secrets": [],
    "materials" : "h2[class='no-bottom orange']:contains('材料') ~p",
    "relatedRecipes":[]
};

var regSteps = /做法<\/h2>(.|\n|\r)+(?=<!--)/igm;

function parse(content){
    content = '<div>'+ $("div[class='l-div last']:has(h2)",content).html() + '</div>';
	var receipe = new Receipe();
	receipe.title = getTitle($(selector['title'], content).text());
  receipe.materials = getMaterials($(selector['materials'], content).text());
	receipe.steps = getSteps(content);
	return receipe;
}

function getTitle(str){
	var content = str.trim();
	return content.replace(/(【|】)/g ,'');   //去掉不需要的修饰字符
}
//console.log(getTitle('【回复收单交换空间收单合格时32423fdsg】'));

function getSteps(content){
    var retVal = [];
    if(!content)return retVal;
    var result = regSteps.exec(content);
    if(result){
        var tmp = result[0].substring(7);
        tmp = tmp.replace(/\s/gm, '').split('<br/>');
        retVal = ClearNullArr(tmp);
    };
    return retVal;
}

function getMaterials(content){
    /*var retVal = [];
    if(!content)return retVal;
    var result = regSteps.exec(content);
    if(result){
        var tmp = result[0].substring(7);
        tmp = tmp.replace(/\s/gm, '').split('<br/>');
        tmp.forEach(function(i){
            if(!i)retVal.push(i);
        });
    }else return [];*/
    return content;
}



