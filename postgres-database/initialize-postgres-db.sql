-- Create a table to store user accounts in.
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(50) NOT NULL UNIQUE,
	"password" VARCHAR(100) NOT NULL,
)