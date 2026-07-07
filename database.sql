CREATE DATABASE bharat3d;
USE bharat3d;

CREATE TABLE users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(10) UNIQUE NOT NULL,
    status ENUM('Active','Inactive') DEFAULT 'Active'
);

CREATE TABLE orders(
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items(
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_name VARCHAR(100),
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY(order_id) REFERENCES orders(order_id)
);