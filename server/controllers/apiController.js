const { default: axios } = require('axios');

const apiController = {};

apiController.findBook = (req, res, next) => {
  if (res.locals.bookInDB) return next();
  const { isbn } = req.body;
  let authorEndpoint;
  axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
    .then((response) => {
      const bookInfo = response.data;

      const bookData = bookInfo['ISBN:' + isbn];
      const title = bookData.title;
      const authorName = bookData.authors[0].name;
      const genre = bookData.subjects[0].name; //There can be many subjects, limiting the scope to 1
      const cover = bookData.cover.medium;
      res.locals.book = { isbn: isbn, title: title, genre: genre, author: authorName, cover: cover};
      return next();

    })
    .catch((err) => {
      const defaultErr = {
        log: 'ERROR found in apiController.findBook' + `There was an error${err}`,
        message: { err: `There was an error${err}` },
      };
      return next(defaultErr);
    });
};

module.exports = apiController;