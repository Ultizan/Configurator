'use strict';

var express = require('express');
var controller = require('./asset.controller');

var router = express.Router();

router.get('/asset', controller.index);
router.get('/class',controller.classes);
router.get('/asset/:id', controller.showAsset);
router.get('/class/:id', controller.showClass);
/*
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
*/
module.exports = router;