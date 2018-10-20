var express = require('express');
var router = express.Router();
var db = require('../queries');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/v1.0/coupons', db.getAllCoupons);
router.get('/api/v1.0/coupons/:id', db.getSingleCoupon);
router.post('/api/v1.0/coupons', db.createCoupon);
router.put('/api/v1.0/coupons/:id', db.updateCoupon);
router.delete('/api/v1.0/coupons/:id', db.removeCoupon);

module.exports = router;
