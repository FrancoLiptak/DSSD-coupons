var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({    
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,       
    password: process.env.DB_PASS   
  });

// add query functions

function getAllCoupons(req, res, next) {
    db.any('select * from coupon')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL coupons'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function getSingleCoupon(req, res, next) {
    var couponID = parseInt(req.params.id);
    db.one('select * from coupon where id = $1', couponID)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE coupon'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function createCoupon(req, res, next) {
    db.none('insert into coupon (number, used)' +
        'values(${number}, ${used})',
      req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one coupon'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function updateCoupon(req, res, next) {
    db.none('update coupon set number=$1, used=$2 where id=$3',
      [req.body.number, req.body.used, parseInt(req.params.id)])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated coupon'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function removeCoupon(req, res, next) {
    var couponID = parseInt(req.params.id);
    db.result('delete from coupon where id = $1', couponID)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            message: `Removed ${result.rowCount} coupon`
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        return next(err);
      });
  }

module.exports = {
  getAllCoupons: getAllCoupons,
  getSingleCoupon: getSingleCoupon,
  createCoupon: createCoupon,
  updateCoupon: updateCoupon,
  removeCoupon: removeCoupon
};