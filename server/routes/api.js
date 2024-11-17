const express = require('express');
const router = express.Router();

const dbController = require('../controllers/dbController');
const apiController = require('../controllers/apiController');
const userController = require('../controllers/userController');
const { authMiddleware } = require("../utils/auth");
const { sendOTP } = require("../utils/email");

//interactions in Search
router.get('/users_books', dbController.findUserBooks, (req, res) => {
  return res.status(200).json(res.locals);
});

//interactions in MyPage
// input is JSON object that must include { "isbn": "9780060244194"}
router.post('/users/:userId/books', authMiddleware, dbController.findBook, apiController.findBook, dbController.addBook, dbController.addUserBook, (req, res) => {
  return res.status(201).json(res.locals);
});

router.get('/users/:userId/books', authMiddleware, dbController.getUserBooks, (req, res) => {
  return res.status(200).json(res.locals.mybooks);
});

router.patch('/users/:userId/books/:bookId', authMiddleware, dbController.modifyUserBook, (req, res) => {
  return res.status(200).json(req.params.bookId);
});

router.delete('/users/:userId/books/:bookId', authMiddleware, dbController.deleteUserBook, (req, res) => {
  return res.status(200).json(req.params.bookId);
});


//interactions in Register
router.post('/register', userController.createUser, (req, res) => {
  return res.status(201).json(res.locals);
});

router.post('/verifyUser', userController.verifyUser, (req, res) => {
  return res.status(200).json(res.locals);
});

router.post('/users/otp', userController.setOTP, (req, res) => {
  return res.status(200).json(res.locals);
});

router.post('/resetPassword', userController.updatePassword, (req, res) => {
  return res.status(200).json(res.locals);
});

module.exports = router;