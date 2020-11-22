var express = require('express');
var router = express.Router();



router.get('/store', (req, res, next) => {
  res.render('store')
})



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
