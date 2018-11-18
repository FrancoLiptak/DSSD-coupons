DROP DATABASE IF EXISTS coupons;
CREATE DATABASE coupons;

\c coupons;

CREATE TABLE coupon (
  ID SERIAL NOT NULL PRIMARY KEY,
  number INT NOT NULL,
  used BIT(1) DEFAULT B'0',
  deleted BOOLEAN DEFAULT false,
  discount FLOAT NOT NULL
);

INSERT INTO coupon (number, discount)
  VALUES (123, 10);