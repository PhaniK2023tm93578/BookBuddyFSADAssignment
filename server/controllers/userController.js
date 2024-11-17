const db = require("../models/booksModels");
const userController = {};
const bcrypt = require("bcrypt");
const { signToken } = require("../utils/auth");
const { sendOTP } = require("../utils/email");

userController.createUser = (req, res, next) => {
  const { username, password, email, phone, address } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hash) => {
      const query = `INSERT INTO users ("username", "password", "email", "phone", "address") VALUES ($1, $2, $3, $4, $5) RETURNING user_id, username, email, phone, address`;
      const values = [username, hash, email, phone, address];
      db.query(query, values)
        .then((sqlRes) => {
          res.locals.user = sqlRes.rows[0];
          res.locals.loggedIn = true;
          res.locals.token = signToken({ username: username });
          next();
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    })
    .catch((err) => {
      return next({
        log: "error hashing password",
        message: { err: "error hashing password" },
      });
    });
};

userController.updatePassword = (req, res, next) => {
  const { userEmail, otp, newPassword } = req.body;
  const query1 = `SELECT otp FROM users WHERE email = $1`;
  const values1 = [userEmail];

  db.query(query1, values1)
    .then((sqlRes) => {
      const oldOTP = sqlRes.rows[0].otp;
      result = otp == oldOTP;
      if (result) {
        bcrypt
          .hash(newPassword, 12)
          .then((hash) => {
            const query2 = `UPDATE users SET password = $1, otp = $2 WHERE email = $3`;
            const values2 = [hash, "", userEmail];

            db.query(query2, values2)
              .then(() => {
                res.locals.resetSuccess = true;
                next();
              })
              .catch((err) => {
                const errObj = {
                  log: err,
                  message: { Error: "Password Reset Failed" },
                };
                next(errObj);
              });
          })
          .catch((err) => {
            return next({
              log: "error hashing password",
              message: { err: "error hashing password" },
            });
          });
      } else {
        res.locals.loggedIn = false;
        res.locals.error = "Password reset failed";
        return next();
      }
    })
    .catch((err) => {
      return next({
        log: "userEmail or password not found",
        message: {
          err: "userEmail or password not found" + JSON.stringify(err),
        },
      });
    });
};

userController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  const query1 = `SELECT password FROM users WHERE username = $1`;
  const values1 = [username];

  db.query(query1, values1)
    .then((sqlRes) => {
      const hash = sqlRes.rows[0].password;
      bcrypt
        .compare(password, hash)
        .then((result) => {
          if (result) {
            const query2 = `SELECT user_id, username, email, phone, address FROM users WHERE username = $1`;
            const values2 = [username];

            db.query(query2, values2)
              .then((verifiedUser) => {
                res.locals.user = verifiedUser.rows[0];
                console.log(JSON.stringify(verifiedUser));
                res.locals.loggedIn = true;
                res.locals.token = signToken({ username: username });
                return next();
              })
              .catch((err) => {
                const errObj = {
                  log: err,
                  message: { Error: "Login Failed" },
                };
                next(errObj);
              });
          } else {
            res.locals.loggedIn = false;
            res.locals.user = { user_id: "imnotreal" };
            return next();
          }
        })
        .catch((error) => {
          return next({
            log: "error in bcrypt compare",
            message: { err: "error in bcrypt compare" },
          });
        });
    })
    .catch((err) => {
      return next({
        log: "username or password not found",
        message: { err: "username or password not found" },
      });
    });
};

userController.setOTP = (req, res, next) => {
  const userEmail = req.body.userEmail;
  const digits = "0123456789";
  let otp = "";
  const limit = 5;
  for (let i = 0; i < limit; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  // Update OTP in the database
  const query = "UPDATE users SET otp = $1 WHERE email = $2";
  const values = [otp, userEmail];

  db.query(query, values)
    .then((data) => {
      sendOTP(otp, userEmail);
      res.locals = { setOTP: true };
      next();
    })
    .catch((err) => {
      const errObj = {
        log: err,
        message: { Error: "Password Reset Failed" },
      };
      next(errObj);
    });
};

module.exports = userController;
