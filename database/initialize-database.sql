CREATE USER 'root'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON database.* TO 'root'@'%' IDENTIFIED BY 'password';

-- Create a table to store user accounts in.
CREATE TABLE IF NOT EXISTS accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(100) NOT NULL,
	CONSTRAINT usernameUnique UNIQUE (username)
);

-- Create a table to store questions in.
CREATE TABLE IF NOT EXISTS questions (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	question VARCHAR(255) NOT NULL,(
	author VARCHAR(50) NOT NULL,
	isAnswered BOOLEAN DEFAULT 0,
	CONSTRAINT questionUnique UNIQUE (question)
);

-- Create a table to store answers in.
CREATE TABLE IF NOT EXISTS answers (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	answer TEXT NOT NULL,
	author VARCHAR(50) NOT NULL,
	questionId INT NOT NULL,
	createdAt DATETIME DEFAULT now();
	lastEdited DATETIME NULL
);