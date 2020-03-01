CREATE USER 'root'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON database.* TO 'root'@'%' IDENTIFIED BY 'password';

-- Create a table to store user accounts in.
CREATE TABLE IF NOT EXISTS accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(100) NOT NULL,
	CONSTRAINT usernameUnique UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS questionCategories (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	categoryName VARCHAR(50) NOT NULL,
	CONSTRAINT nameUnique UNIQUE (name)
);

-- Create a table to store questions in.
CREATE TABLE IF NOT EXISTS questions (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	category VARCHAR(50) NOT NULL,
	author VARCHAR(50) NOT NULL,
	question VARCHAR(255) NOT NULL,
	isAnswered BOOLEAN DEFAULT 0,
	CONSTRAINT questionUnique UNIQUE (question),
	FOREIGN KEY (category) REFERENCES questionCategories(categoryName),
	FOREIGN KEY (author) REFERENCES accounts(username)
);

-- Create a table to store answers in.
CREATE TABLE IF NOT EXISTS answers (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	answer TEXT NOT NULL,
	author VARCHAR(50) NOT NULL,
	questionId INT NOT NULL,
	createdAt DATETIME DEFAULT now(),
	lastEdited DATETIME NULL,
	FOREIGN KEY (author) REFERENCES accounts(username),
	FOREIGN KEY (questionId) REFERENCES questions(id)
);

