/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Xls = require('./xls.model');

exports.register = function(socket) {
  /*Xls.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Xls.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });*/
}
/*
function onSave(socket, doc, cb) {
  socket.emit('xls:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('xls:remove', doc);
}
*/