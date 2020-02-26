CREATE USER 'root'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON database.* TO 'root'@'%' IDENTIFIED BY 'password';

-- Create a table to store user accounts in.
CREATE TABLE IF NOT EXISTS accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(100) NOT NULL,
	CONSTRAINT usernameUnique UNIQUE (username)
);