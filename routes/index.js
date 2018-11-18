var express = require('express');
var router = express.Router();
var db = require('../queries');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'DSSD - COUPONS' });
});

router.get('/api/v1.0/coupons', db.getAllCoupons);
router.get('/api/v1.0/coupons/:id', db.getSingleCouponById);
router.get('/api/v1.0/coupons/:number', db.getSingleCouponByNumber);
router.post('/api/v1.0/coupons', db.createCoupon);
router.put('/api/v1.0/coupons/:id', db.updateCoupon);
router.delete('/api/v1.0/coupons/:id', db.removeCoupon);

module.exports = router;
