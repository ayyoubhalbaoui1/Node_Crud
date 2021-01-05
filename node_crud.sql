CREATE TABLE category (
  id int(11) NOT NULL AUTO_INCREMENT,
  catname varchar(50),
  PRIMARY KEY (id)
);

CREATE TABLE product (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  price int(11),
  id_category int(11),
  PRIMARY KEY (id),
  KEY id_fk (id_category)
);

ALTER TABLE product
  ADD CONSTRAINT id_fk FOREIGN KEY (id_category) REFERENCES category (id);