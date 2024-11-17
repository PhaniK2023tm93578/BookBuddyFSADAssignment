const db = require("../models/booksModels");
const nodemailer = require('nodemailer');


const dbController = {};

dbController.findBook = (req, res, next) => {
  // destructure req body to retrieve ISBN
  const { isbn } = req.body;
  // define the query to get the field
  const query = `SELECT * FROM books WHERE isbn = '${isbn}'`;
  db.query(query)
    .then((data) => {
      // check if returned object from query has row property with more than 1 row. If so, bookindb is true. Otherwise, bookindb is false
      data.rowCount > 0
        ? (res.locals.bookInDB = true)
        : (res.locals.bookInDB = false);
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

dbController.addBook = (req, res, next) => {
  // if book alrady exits in db, move onto next middlewar function
  if (res.locals.bookInDB) return next();

  const { isbn, title, author, genre, cover } = res.locals.book;
  const query = `INSERT INTO books ("isbn", "title", "author", "genre", "cover") VALUES ('${isbn}', '${title}', '${author}', '${genre}', '${cover}')`;

  // only adding/working with one specific attribute
  db.query(query)
    .then(() => {
      next();
    })
    .catch((err) => {
      next(err);
    });
};

dbController.findUserBooks = (req, res, next) => {
  const { searchString, searchType, limit, offset, location, availability, genre } = req.query;

  let categorySearch = `title ~* '\\y${searchString}\\y'
  OR author ~* '\\y${searchString}\\y'`;

  let authorSearch = `author ~* '\\y${searchString}\\y'`;
  let titleSearch = `title ~* '\\y${searchString}\\y'`;

  if(location) {
    authorSearch = authorSearch ? `${authorSearch} AND location ~* '\\y${location}\\y'` : `location ~* '\\y${location}\\y'`;
    titleSearch = titleSearch ? `${titleSearch} AND location ~* '\\y${location}\\y'` : `location ~* '\\y${location}\\y'`;
  }

  if(genre) {
    authorSearch = authorSearch ? `${authorSearch} AND genre ~* '\\y${genre}\\y'` : `genre ~* '\\y${genre}\\y'`;
    titleSearch = titleSearch ? `${titleSearch} AND genre ~* '\\y${genre}\\y'` : `genre ~* '\\y${genre}\\y'`;
  }

  if(availability != 'All') {
    authorSearch = authorSearch ? `${authorSearch} AND availability= '${availability}'` : `availability= '${availability}'`;
    titleSearch = titleSearch ? `${titleSearch} AND availability= '${availability}'` : `availability= '${availability}'`;
  }

  const query = `SELECT users.username, users.email, books.cover, books.title, books.author, users_books.condition, users_books.availability, users_books.location, users_books.user_id, users_books.lend_or_borrow, books.isbn, books.genre
  FROM users
  JOIN users_books
  ON users.user_id = users_books.user_id
  JOIN books
  ON users_books.bookISBN = books.isbn
  WHERE ((${authorSearch}) OR(${titleSearch}))
  LIMIT ${limit} 
  OFFSET ${offset};`;

  const countQuery = `SELECT COUNT(*) AS total_count
  FROM users
  JOIN users_books
  ON users.user_id = users_books.user_id
  JOIN books
  ON users_books.bookISBN = books.isbn
   WHERE ((${authorSearch}) OR(${titleSearch}))`;


  db.query(query)
    .then((data) => {
      res.locals.booksData = data.rows;
      db.query(countQuery)
        .then((countData) => {
          res.locals.totalBooks = countData.rows[0].total_count;
          next();
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

dbController.addUserBook = (req, res, next) => {
  const { isbn, condition, availability, lendOrBorrow } = req.body;
  const userId = req.params.userId;

  const locationQuery = `SELECT address FROM users WHERE user_id='${userId}'`;
  db.query(locationQuery)
    .then((res) => {
      let location = res.rows[0].address;
      const query = `
      INSERT INTO users_books ("user_id", "bookisbn", "condition", "availability", "location", "lend_or_borrow")
      VALUES ('${userId}', '${isbn}', '${condition}', '${availability}', '${location}', '${lendOrBorrow}')
      `;
      db.query(query)
        .then(() => {
          next();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      console.log("Location retrieval failed" + err);
      next(err);
    });
};

dbController.getUserBooks = async(req, res, next) => {
  const user_id = req.params.userId;
  // const user_id= req.cookies.ssid;
  const query = `SELECT books.title, books.author, books.cover, books.genre, users_books.condition, users_books.availability, users_books.location, users_books.lend_or_borrow, books.isbn, users_books.users_books_id
  FROM users
  JOIN users_books
  ON users.user_id = users_books.user_id
  JOIN books
  ON users_books.bookISBN = books.isbn
  WHERE users.user_id = '${user_id}'`;

  db.query(query)
    .then((data) => {
      res.locals.mybooks = data.rows;
      next();
    })
    .catch((err) => {
      console.log('Error while getting users books list' + err);
      next(err);
    });
};

dbController.modifyUserBook = (req, res, next) => {
  const bookId = parseInt(req.params.bookId);
  const condition = req.body.condition;
  const availability = req.body.availability;
  const lendOrBorrow = req.body.lendOrBorrow;
  const query = `
    UPDATE users_books
    SET availability = '${availability}', condition = '${condition}', lend_or_borrow = '${lendOrBorrow}'
    WHERE users_books_id = ${bookId}
  `;
  const values = [availability, condition, bookId];
  db.query(query)
    .then(() => next())
    .catch((err) => {
      console.log("Error in Updating the record " + err);
      next(err);
    });
};

dbController.deleteUserBook = (req, res, next) => {
  const bookId = parseInt(req.params.bookId);
  const query = `DELETE FROM users_books WHERE users_books_id = ${bookId}`;
  db.query(query)
    .then(() => next())
    .catch((err) => {
      console.log("Error in deletion of record " + err);
      next(err);
    });
};

module.exports = dbController;
