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
	assetTree: function (ret,returnData){
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
				returnData(ret);
			});
		});
	},
	classTree: function (ret,returnData){
		var strClassQuery = 'SELECT * from ASC_EquipmentClasses WHERE SetForDeletion = 0'//ID, RecursiveParentID, ParentID, Name, Description, CustomIdentifier, IconDefinitionID,Created,Updated,Author from ASC_EquipmentClasses WHERE SetForDeletion = 0'
		var strFolderQuery = 'SELECT * from ASC_EquipmentClassFolders WHERE SetForDeletion = 0'//ID, RecursiveParentID, Name from ASC_EquipmentClassFolders WHERE SetForDeletion = 0'
		
		async.parallel([
			function(callback){
				var con = new sql.Connection(config, function(err){
					if(err){
						console.log(err);
					}
					var request = new sql.Request(con);

					request.query(strClassQuery,function(err,recordset){
						if(err){
							return callback(err);
						}
						callback(null,recordset);
					});
				});
			},
			function(callback){
				var con = new sql.Connection(config, function(err){
					if(err){
						console.log(err);
					}
					var request = new sql.Request(con);

					request.query(strFolderQuery,function(err,recordset){
						if(err){
							console.log(err);
						}
						callback(null,recordset);
					});
				});
			}
		],
		function (err,results){
			ret = makeClassTree(results[0],results[1]);
			returnData(ret);
		});
	},

	getClass: function (ret,returnData,id){
		var strQuery = 'SELECT * from ASC_EquipmentClassProperties WHERE parentID = ' + id;
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
				ret= recordset;
				returnData(ret);
			});
		});		
	},

	getAsset: function(ret,returnData,id){
		var strQuery = 'SELECT * from ASC_EquipmentProperties WHERE parentID = ' + id;
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
				ret= recordset;
				console.log(ret);
				returnData(ret);
			});
		});		
	}
};

function makeTree(items){
	var itemsByID = [];
	items.forEach(function(item) {
		itemsByID[item.ID] = {
	        children: [],
	        data: {},
	        treeParentID: item.RecursiveParentID,
	        treeID: item.ID,
	        displayName: item.DisplayName||item.Name,
	        type: 'Asset'
	    };
	    for (var key in item){
			itemsByID[item.ID].data[key] = item[key];
		}
	});
	itemsByID.forEach(function(item) {
	    if(item.treeParentID !== null) {
	        itemsByID[item.treeParentID].children.push(item);
	    }
	});
	var roots = itemsByID.filter(function(item) { return item.treeParentID === null; });
	itemsByID.forEach(function(item) { delete item.treeParentID; });
	//console.log(roots[0].children);
	return roots;
}

function makeClassTree(classes,folders){
	var classesByID = [];
	var foldersByID = [];
	var maxFolderID = 0;
	folders.forEach(function(objFolder){
		foldersByID[objFolder.ID] = {
			children: [],
			data: {},
			treeParentID: objFolder.RecursiveParentID,
			treeID: objFolder.ID,
			displayName:objFolder.Name,
			type:'ClassFolder'
		};
		for(var key in objFolder){
			foldersByID[objFolder.ID].data[key]=objFolder[key];
		}
		if (objFolder.ID > maxFolderID){
			maxFolderID=objFolder.ID;
		}
	});
	
	console.log(maxFolderID);
	
	classes.forEach(function(objClass) {
		classesByID[objClass.ID] = {
	        children: [],
	        data: {},
	        treeParentID: objClass.RecursiveParentID,
	        treeID: objClass.ID,
	        displayName: objClass.DisplayName||objClass.Name,
	        type: 'AssetClass'
	    };
	    for (var key in objClass){
			classesByID[objClass.ID].data[key] = objClass[key];
		}
	});
	classesByID.forEach(function(objClass) {
	    if(objClass.treeParentID !== null) {
	        classesByID[objClass.treeParentID].children.push(objClass);
	    }
	});
	var classRoots = classesByID.filter(function(objClass) { return objClass.treeParentID === null; });
	classesByID.forEach(function(objClass) { delete objClass.treeParentID; });

	foldersByID.forEach(function(objFolder) {
	    if(objFolder.treeParentID !== null) {
	        foldersByID[objFolder.treeParentID].children.push(objFolder);
	    }
	});
	var folderRoots = foldersByID.filter(function(objFolder) { return objFolder.treeParentID === null; });
	foldersByID.forEach(function(objFolder) { delete objFolder.treeParentID; });

	classRoots.forEach(function(root){
		foldersByID[root.data.ParentID].children.push(root);
	});

	return folderRoots;
}