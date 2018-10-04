DROP DATABASE IF EXISTS coupons;
CREATE DATABASE coupons;

\c coupons;

CREATE TABLE coupon (
  ID SERIAL NOT NULL PRIMARY KEY,
  number INT NOT NULL,
  used BIT(1) NOT NULL
);

INSERT INTO coupon (number, used)
  VALUES (123, B'0');



