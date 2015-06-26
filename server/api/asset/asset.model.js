'use strict';
var sql = require('mssql');
var async = require('async');

var config = {
    user: 'roviReader',
    password: 'rovisys',
    server: '192.168.1.19\\SQLExpress2014', // You can use 'localhost\\instance' to connect to named instance 
    database: 'AssetWorX'//,
    
    //options: {
    //    encrypt: true // Use this if you're on Windows Azure 
    //}
};


module.exports = {
	assetTree: function Conn(ret,callback){
		var strQuery = 'SELECT ID, RecursiveParentID, Name, Enabled, DisplayName, EquipmentClassID from ASC_Equipment WHERE SetForDeletion = 0'
		console.log(strQuery);

		var con = new sql.Connection(config, function(err){
			if(err){
				console.log(err);
			}
			var request = new sql.Request(con);

			request.query(strQuery,function(err,recordset){
				if(err){
					console.log(err);
				}
				ret = makeTree(recordset);
				callback(ret);
			});
		});
		
	}
};

function makeTree(items){
	var itemsByID = [];
	items.forEach(function(item) {
	    itemsByID[item.ID] = {
	        data: {
	        	name: item.Name,
	        	enabled: item.Enabled,
        		eqClass: item.EquipmentClassID
	        	},
	        children: [],
	        parentID: item.RecursiveParentID,
	        assetID: item.ID,
	        displayname: item.DisplayName||item.Name,
	    };
	});
	itemsByID.forEach(function(item) {
	    if(item.parentID !== null) {
	        itemsByID[item.parentID].children.push(item);
	    }
	});
	var roots = itemsByID.filter(function(item) { return item.parentID === null; });
	itemsByID.forEach(function(item) { delete item.parentID; });
	//console.log(roots[0].children);
	return roots;
}
