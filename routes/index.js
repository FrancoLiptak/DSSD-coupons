var express = require('express');
var router = express.Router();
var db = require('../queries');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/coupons', db.getAllCoupons);
router.get('/api/coupons/:id', db.getSingleCoupon);
router.post('/api/coupons', db.createCoupon);
router.put('/api/coupons/:id', db.updateCoupon);
router.delete('/api/coupons/:id', db.removeCoupon);

module.exports = router;
