var Receipe = require('../../model/receipe'),
    cheerio = require('cheerio'),
    ClearNullArr = require('../arrayUtil').ClearNullArr,
    fs = require('fs');

exports.parse = parse;


var selector = {
    "title":"h1.span-15",
    "description":"",
    "catelog":[],
    "tags":[],
    "images": '#finalimg',
    //"steps":"h2[class='no-bottom orange']:contains('做法') ~p",
    "secrets":[],
    "materials":"h2[class='no-bottom orange']:contains('材料') ~p",
    "relatedRecipes":[]
};

var regSteps = /做法<\/h2>(.|\n|\r)+(?=<!--)/igm;

function parse(content) {
    var $ = cheerio.load(content);
    var receipe = new Receipe();
    receipe.title = getTitle($(selector['title']).text());
    receipe.materials = getMaterials($(selector['materials']).first().text());
    receipe.images = getImages($(selector['images']).attr('src'),receipe.title);
    receipe.steps = getSteps(content, $, receipe);  //由于要加入小窍门，所以把receipe作为参数传过去，要改进
    return receipe;
}

function getTitle(str) {
    var content = str.trim();
    return content.replace(/(【|】)/g, '');   //去掉不需要的修饰字符
}

function getSteps1(content) {
    var retVal = [];
    if (!content)return retVal;
    var result = regSteps.exec(content);
    if (result) {
        var tmp = result[0].substring(7);
        tmp = tmp.replace(/\s/gm, '').split('<br/>');
        retVal = ClearNullArr(tmp);
    }
    ;
    return retVal;
}
/**
 * 递归删除做法前面的所有节点，包含text节点
 * @param elem
 * @param $
 */
function delPrev(elem, $) {
    var prev = elem.prev;
    if (prev)delPrev(prev, $);
    $(elem).remove();
}

/**
 * 获取步骤内容
 * @param content
 * @param $
 * @return {*|jQuery}
 */
function getSteps(content, $, receipe) {
    var div = $("div[class='l-div last'] h1").parent();
    var h2 = $("h2[class='no-bottom orange']").last();
    delPrev(h2[0], $);
    $("div[class='normal bold']",div).each(function(i,elem){
        //加入诀窍
        if($(this).text()=='小诀窍:'){
            $('p',this).each(function(i,elem){
                //加入诀窍
                receipe.secrets.push({"type":"yaojue","title":receipe.title + "的小诀窍","content": $(this).text().replace(/\s/gm, '')});
                $(this).remove();
            });
        }else{
            //例外，没考虑到的意外页面
            throw new Error('例外，没考虑到的意外页面',$(div).html());
        }
        $(this).remove();
    });
    return $(div).text().replace(/\s/gm, '');
}

/**
 * 获取材料内容
 * @param content
 * @return {*}
 */
function getMaterials(content) {

    var restData = content.replace(/\s/gm, '');
    var result = [];
    if(!restData)return result;
    var clStr,tlStr, flStr;
    /*var regTl = /调料：/;
    var regFl = /辅料：/;
    var regCl = /材料：/;
    if(regFl.exec(cont))*/
    var flIndex = restData.indexOf('辅料：');
    var tlIndex = restData.indexOf('调料：');
    //假定材料、调料、辅料按固定顺序排列
    if(flIndex>=0){
        flStr = restData.substring(flIndex);
        restData = restData.substring(0,flIndex);
    }
    if(tlIndex>=0){
        tlStr = restData.substring(tlIndex);
        restData = restData.substring(0,tlIndex);
    }
    clStr = restData;

    if(clStr){
        if(clStr.indexOf('材料：'))clStr = clStr.substring(3);
        var cls = clStr.split('，');
        //TODO 去掉空记录
        cls = ClearNullArr(cls);
        cls.forEach(function(cl){
            result.push({"type": "main", "title": cl});
        })
    }
    if(tlStr){
        tlStr = tlStr.substring(3);
        var tls = tlStr.split('，');
        //TODO 去掉空记录
        tls = ClearNullArr(tls);
        tls.forEach(function(tl){
            result.push({"type": "spice", "title": tl});
        })
    }
    if(flStr){
        flStr = flStr.substring(3);
        var fls = flStr.split('，');
        //TODO 去掉空记录
        fls = ClearNullArr(fls);
        fls.forEach(function(fl){
            result.push({"type": "accessories", "title": fl});
        })
    }
    return result;
}

function getImages(url, title){
    return {"title":title,"type":"origin","filename":url};
}


