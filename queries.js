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
  let sql = 'select id, number, used from coupon where deleted = false';
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
  db.one('select id, number, used from coupon where deleted = false and id = $1', id)
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

function writeData(sql, value, callback) {
  db.result(sql, value)
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

function createResponse(data, res, actionName) {
  let responseCode = 500;
  let response = {};
  if (data.name == 'error' || data.rowCount == 0) {
    responseCode = 400;
    response = {
      status: 'error',
      message: 'Bad Request'
    }
  } else {
    responseCode = 200;
    response = {
      status: 'success',
      message: `${actionName} one coupon`
    }
  }
  res.status(responseCode).json(response);
}

function createCoupon(req, res, next) {
  const sql = 'insert into coupon (number)' + 'values(${number})';
  writeData(sql, req.body, (data) => {
    createResponse(data, res, 'created');
  })
}

function updateCoupon(req, res, next) {
  const sql = 'update coupon set number=$1, used=$2 where id=$3';
  const value = [req.body.number, req.body.used, parseInt(req.params.id)];
  writeData(sql, value, (data) => {
    createResponse(data, res, 'updated');
  })
}

function removeCoupon(req, res, next) {
  const sql = 'update coupon set deleted=$1 where id=$2';
  const value = [true, parseInt(req.params.id)];
  writeData(sql, value, (data) => {
    createResponse(data, res, 'removed');
  })
}

// let's filter
function filteringQuery(filter) {
  let query = ` AND`; // El WHERE se pone en getAllCoupons() o getSingleElement().
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