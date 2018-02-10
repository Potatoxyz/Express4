var express = require('express');
var router = express.Router();
var path=require('path');
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname,'../views/pages/index.html'));
});
router.get('/scanPic', function(req, res, next) {
    res.sendFile(path.resolve(__dirname,'../views/pages/scanPic.html'));
});
router.get('/login', function(req, res, next) {
    res.sendFile(path.resolve(__dirname,'../views/pages/login.html'));
});
router.get('/user-setting', function(req, res, next) {
    res.sendFile(path.resolve(__dirname,'../views/pages//user-setting.html'));
});
module.exports = router;