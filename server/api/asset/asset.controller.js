'use strict';

var _ = require('lodash');
var Asset = require('./asset.model');

// Get list of assets

exports.index = function(req, res) {
  function dataCallback(result){
    
    if(result){
      return res.json(200,result);
    } else {
      console.log('No Results from Asset.Model');
    }
  }
  var ret = [];
  Asset.assetTree(ret,dataCallback);
};

exports.classes = function(req, res) {
  function dataCallback(result){
    if(result){
      return res.json(200,result);
    } else {
      console.log('No Results from Asset.Model');
    }
  }
  var ret = [];
  Asset.classTree(ret,dataCallback);
};

exports.showClass = function(req, res) {
  function dataCallback(result){
    if(result){
      return res.json(200,result);
    } else {
      console.log('No Results from Asset.Model');
    }
  }
  var ret = [];
  Asset.getClass(ret,dataCallback,req.params.id);
};

exports.showAsset = function(req, res) {
  function dataCallback(result){
    if(result){
      return res.json(200,result);
    } else {
      console.log('No Results from Asset.Model');
    }
  }
  var ret = [];
  Asset.getAsset(ret,dataCallback,req.params.id);
};

/*/ Get a single asset
exports.show = function(req, res) {
  Asset.findById(req.params.id, function (err, asset) {
    if(err) { return handleError(res, err); }
    if(!asset) { return res.send(404); }
    return res.json(asset);
  });
};

// Creates a new asset in the DB.
exports.create = function(req, res) {
  Asset.create(req.body, function(err, asset) {
    if(err) { return handleError(res, err); }
    return res.json(201, asset);
  });
};

// Updates an existing asset in the DB.ID
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Asset.findById(req.params.id, function (err, asset) {
    if (err) { return handleError(res, err); }
    if(!asset) { return res.send(404); }
    var updated = _.merge(asset, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, asset);
    });
  });
};

// Deletes a asset from the DB.
exports.destroy = function(req, res) {
  Asset.findById(req.params.id, function (err, asset) {
    if(err) { return handleError(res, err); }
    if(!asset) { return res.send(404); }
    asset.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};
*/

function handleError(res, err) {
  return res.send(500, err);
}

