var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , Server = require('mongodb').Server
  , format = require('util').format;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var connectUrl = format("mongodb://%s:%s/crawler", host, port);
//console.log("Connecting to ",connectUrl)
var defaultCollectionName = 'data';
var curCollections = {};

exports.getCollection = getCollection;

function getCollection(collectionName, cb){
	var cName = collectionName? collectionName : defaultCollectionName;
	if(curCollections[cName]){
		cb(null, curCollections[cName]);
		return;
	}
	Db.connect(connectUrl, function(err, db) {
	  if(err)throw err;
	    db.collection(collectionName, function(err, collection) {
	    	if(err)throw err;
	    	curCollections[cName] = collection;
	    	cb(null, collection);
	    });
	});
}

function test(){
    getCollection('data',function(err, collection){
        collection.insert({fsdfsd:1});
    });
}

//test();