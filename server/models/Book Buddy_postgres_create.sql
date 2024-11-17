CREATE TABLE users (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL UNIQUE,
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"address" varchar NOT NULL
	"otp" varchar,
);

CREATE TABLE books (
	"isbn" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"author" varchar NOT NULL,
	"genre" varchar NOT NULL,
	"cover" varchar NOT NULL
);

CREATE TABLE users_books (
	"users_books_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL REFERENCES users,
	"bookisbn" varchar NOT NULL REFERENCES books,
	"condition" varchar NOT NULL,
	"availability" varchar NOT NULL,
	"location" varchar NOT NULL,
	"lend_or_borrow" varchar NOT NULL,
);