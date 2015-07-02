'use strict';

var _ = require('lodash');
var Xls = require('./xls.model');

// Get list of xlss
exports.bac = function(req, res) {
  function dataCallback(result){
    if(result){
      return res.json(200,result);
    } else {
      console.log('No Results from Asset.Model');
    }
  }
  var ret = [];
  Xls.getBAC(ret,dataCallback,req.params.id);
};

// Get a single xls
/*exports.show = function(req, res) {
  Xls.findById(req.params.id, function (err, xls) {
    if(err) { return handleError(res, err); }
    if(!xls) { return res.send(404); }
    return res.json(xls);
  });
};

// Creates a new xls in the DB.
exports.create = function(req, res) {
  Xls.create(req.body, function(err, xls) {
    if(err) { return handleError(res, err); }
    return res.json(201, xls);
  });
};

// Updates an existing xls in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Xls.findById(req.params.id, function (err, xls) {
    if (err) { return handleError(res, err); }
    if(!xls) { return res.send(404); }
    var updated = _.merge(xls, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, xls);
    });
  });
};

// Deletes a xls from the DB.
exports.destroy = function(req, res) {
  Xls.findById(req.params.id, function (err, xls) {
    if(err) { return handleError(res, err); }
    if(!xls) { return res.send(404); }
    xls.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};
*/
function handleError(res, err) {
  return res.send(500, err);
}