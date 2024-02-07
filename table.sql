CREATE TABLE USER(
    id INT primary key AUTO_INCREMENT,
    name varchar(50),
    contact_number varchar(20),
    email varchar(30),
    password varchar(30),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

INSERT INTO USER (name, contact_number, email, password, status, role) values('Admin', '1234567890', 'admin@gmail.com', 'admin', 'true','admin');

CREATE TABLE CATEGORY(
    ID INT NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(60),
    PRIMARY KEY(ID)
);

CREATE TABLE PRODUCT(
    ID INT NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(150),
    CATEGORYID INT NOT NULL,
    DESCRIPTION VARCHAR(250),
    PRICE INT,
    STATUS VARCHAR(20),
    PRIMARY KEY(ID)
);