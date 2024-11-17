# Book Buddy

## Purpose
The primary purpose of Book Buddy is to create a digital platform that facilitates book exchanges among users. It aims to bridge the gap between book lovers and provide a convenient and efficient way to share and discover new books. By providing a centralized platform, the application addresses the limitations of traditional methods like book swaps and lending, offering a broader reach and increased accessibility to a wider audience.

## Features

* **User Authentication:**
  * Login
  * Registration
  * Password Recovery
* **Book Management:**
  * Book Listing
  * Book Editing
  * Book Deletion
* **Book Search:**
  * Keyword Search
  * Advanced Search (by availability, genre, location)
  * Detailed Book Information
  * Pagination

## Installation

### Prerequisites
* Node.js and npm (or yarn)
* PostgreSQL database

### Setup
1. **Create a PostgreSQL Database:**
   Create a new database on your PostgreSQL server.
2. **Create Database Tables:**
   Run the following SQL queries to create the necessary tables:

   ```sql
   CREATE TABLE users (
       "user_id" serial PRIMARY KEY NOT NULL,
       "username" varchar NOT NULL UNIQUE,
       "password" varchar NOT NULL,
       "email" varchar NOT NULL,
       "phone" varchar NOT NULL,
       "address" varchar NOT NULL,
       "otp" varchar
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
       "user_id" integer NOT NULL REFERENCES users(user_id),
       "bookisbn" varchar NOT NULL REFERENCES books(isbn),
       "condition" varchar NOT NULL,
       "availability" varchar NOT NULL,
       "location" varchar NOT NULL,
       "lend_or_borrow" varchar NOT NULL
   );
3. **Clone this repo:**
    ```bash
    git clone dummy
    ```
4. **Install Dependencies:**
    ```bash
    npm install
    ```
5. **Run in Development:**
    ```bash
    npm run dev
    ```
6. **Update the PG_URI in the FILE with the actual db details in this format:**
    ```bash
    postgres://YourUserName:YourPassword@localhost:5432/YourDatabase
    ```
7. **Update the MAIL_DETAILS in the FILE with the actual sender mail details in this format:**
    ```bash
        {
            service: "<MailService>",
            auth: {
                user: "<ToEmail>",
                pass: "Password",
            },
        }
    ```