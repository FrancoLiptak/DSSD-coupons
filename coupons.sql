DROP DATABASE IF EXISTS coupons;
CREATE DATABASE coupons;

\c coupons;

CREATE TABLE coupon (
  ID SERIAL NOT NULL PRIMARY KEY,
  number INT NOT NULL,
  used BIT(1) DEFAULT B'0'
);

INSERT INTO coupon (number)
  VALUES (123);