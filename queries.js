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
  let sql = 'select * from coupon';
  const filter = req.query.filter;
  const pagination = req.query.pagination;
  let paginationData;

  sql += filter ? filteringQuery(filter) : ''

  if (pagination) {
    const paginationResult = paginationQuery(JSON.parse(pagination));
    paginationData = paginationResult.paginationData;
    sql += paginationResult.query;
  }

  db.any(sql)
    .then(function (data) {
      let responseCode = 500;
      let response = {};

      if (data.length) {
        if (pagination) {
          const hasNext = (Object.keys(data).length == pagination.limit);
          paginationData.next = hasNext ? paginationData.next : null;
        };
        responseCode = 200;
        response = {
          status: 'success',
          data: data,
          messsage: 'Retrieved MANY coupons',
          paginationData: paginationData || null
        };
      } else {
        responseCode = 404;
        response = {
          status: 'resource not found',
          data: data,
          messsage: 'No coupons retrieved ',
          paginationData: paginationData || null
        };
      }

      res.status(responseCode).json(response);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleElement(id, callback) {
  db.one('select * from coupon where id = $1', id)
    .then(
      (data) => {
        callback(data);
      }
    )
    .catch(
      (err) => {
        callback(err);
      }
    )

}

function getSingleCoupon(req, res, next) {
  var couponID = parseInt(req.params.id);

  getSingleElement(couponID, (data) => {
    let responseCode = 500;
    let response = {};
    if (data.code == undefined) {
      responseCode = 200;
      response = {
        status: 'success',
        data: data,
        message: `Retrieved ONE coupon`
      }
    } else {
      responseCode = 404;
      response = {
        status: 'resource not found',
        message: `No coupon retrieved`
      }
    }
    res.status(responseCode).json(response);
  })
}

function createCoupon(req, res, next) {
  db.none('insert into coupon (number)' +
    'values(${number})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one coupon'
        });
    })
    .catch(function (err) {
      console.log(err.name);
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
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} coupon`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// let's filter
function filteringQuery(filter) {
  let query = ` WHERE`;
  filter = JSON.parse(filter);
  filter.forEach(f => {
    query += ` ${f.field} ${f.operator} '${f.value}' AND`;
  });
  query = query.substring(0, query.length - 3);
  return query;
}

// let's do some pagination
function paginationQuery(pagination) {
  pagination.offset = pagination.offset || 0;
  const query = ` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
  const paginationData = {
    next: `pagination={%22offset%22:${pagination.offset + pagination.limit},%22limit%22:${pagination.limit}}`,
    self: `pagination={%22offset%22:${pagination.offset},%22limit%22:${pagination.limit}}`,
    prev: pagination.offset != 0 ? `pagination={%22offset%22:${pagination.offset - pagination.limit},%22limit%22:${pagination.limit}}` : null,
  };
  const result = { query: query, paginationData: paginationData };
  return result
}

module.exports = {
  getAllCoupons: getAllCoupons,
  getSingleCoupon: getSingleCoupon,
  createCoupon: createCoupon,
  updateCoupon: updateCoupon,
  removeCoupon: removeCoupon
};