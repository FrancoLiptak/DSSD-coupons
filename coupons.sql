DROP DATABASE IF EXISTS coupons;
CREATE DATABASE coupons;

\c coupons;

CREATE TABLE coupon (
  ID SERIAL NOT NULL PRIMARY KEY,
  number INT NOT NULL UNIQUE,
  used BIT(1) DEFAULT B'0',
  deleted BOOLEAN DEFAULT false,
  discount_percentage FLOAT NOT NULL
);

INSERT INTO coupon (number, discount_percentage)
  VALUES (123, 10);