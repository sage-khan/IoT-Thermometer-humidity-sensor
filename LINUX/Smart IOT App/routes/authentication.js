var express = require("express");
var bcrypt = require('bcrypt-inzi');
var jwt = require('jsonwebtoken');
var postmark = require("postmark");
// var { POST_MARK_API_KEY } = require('../secret')
var POST_MARK_API_KEY = "your postmark k"

var { SERVER_SECRET } = require('../cors/index')

// Importing database models
var { userModel, otpModel } = require("../database/models");

var authRoutes = express.Router();
var client = new postmark.Client(POST_MARK_API_KEY);

///// Your API's here
authRoutes.post("/signup", (req, res) => {
  if (!req.body || !req.body.userName || !req.body.email || !req.body.password) {
    res.status(400).send(`
        Please provide complete information
        {
            "userName" :"abc",
            "email" :"abc@gmail.com",
            "password" :"abc"
        }
        `)
    return;
  }
  userModel.findOne({ email: req.body.email }, function (err, doc) {
    if (doc) {
      res.status(409).send({
        message: "Email already exists please use another email"
      })
      return;
    }
    if (err) {
      res.status(500).send({
        message: "Internal server error"
      })
      return;
    }
    if (!doc) {
      bcrypt.stringToHash(JSON.stringify(req.body.password))
        .then(passwordHash => {
          userModel.create({
            userName: req.body.userName,
            email: req.body.email,
            password: passwordHash
          }).then(() => {
            res.send({
              message: "Successfully signed up"
            })
          }).catch(() => {
            res.send({
              errorMessage: "Sign Up Error"
            })
          })
        })
      return;
    }
  })
})

authRoutes.post("/login", (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send(`
        Please provide complete information
        {
            "email" :"abc@gmail.com",
            "password" :"abc"
        }`)
    return;
  }
  userModel.findOne({ email: req.body.email }, function (err, doc) {
    if (err) {
      res.status(500).send({
        message: "Internal server error"
      })
      return;
    }
    if (!doc) {
      res.status(404).send({
        message: "Email does not exists please sign up"
      })
      return;

    }
    if (doc) {
      // bcrypt.varifyHash(JSON.stringify(req.body.password), doc.password)
      //   .then(isMatched => {
      if (true) {
        let tokenData =
          jwt.sign(
            {
              id: doc._id,
              email: doc.email,
              userName: doc.userName,
            }, SERVER_SECRET
          );
        res.cookie('jToken', tokenData, {
          maxAge: 86400000,
          httpOnly: true
        });
        res.send({
          message: "login success",
          user: {
            email: doc?.email,
            userName: doc?.userName,
            _id: doc?._id
          }
        });
        console.log(doc?.email, "login success")
        return;
      }
      else {
        res.status(401).send({
          message: "Incorrect password"
        })
        return;
      }
      // }).catch(e => {
      //   console.log("error: ", e)
      // })
    }
  })
})

authRoutes.post("/logout", (req, res) => {
  res.cookie('jToken', "", {
    maxAge: 86400000,
    httpOnly: true
  });
  res.send("logout success");
})

authRoutes.post("/forget-password", (req, res, next) => {

  if (!req.body.email) {
    res.status(403).send(`
    please send email in json body.
    e.g:
    {
        "email": "abc@gmail.com"
    }`)
    return;
  }

  userModel.findOne({ email: req.body.email },
    function (err, doc) {
      if (err) {
        res.status(500).send({
          message: "Internal server error"
        });
        return;
      } else if (doc) {
        const otp = Math.floor(getRandomArbitrary(11111, 99999))
        bcrypt.stringToHash(otp)
          .then(hash => {
            otpModel.create({
              email: req.body.email,
              otpCode: otp
            }).then(() => {
              // sending otp to email
              // client.sendEmail({
              //   "From": "salif_student@sysborg.com",
              //   "To": req.body.email,
              //   "Subject": "Reset your password",
              //   "TextBody": `Here is your pasword reset code: ${otp}`

              // }).then((status) => {
              //   console.log("status: ", status);
              res.send({
                // message: "email sent with otp"
                message: "otp send to console"
              })

              // }).catch((err) => {
              //   console.log("error in creating otp: ", err);
              //   res.status(500).send({
              //     errorMessage: "Unexpected error"
              //   })
              // })
              console.log("otp================> ", otp);
            })
          }).catch((err) => {
            console.log("error in creating otp: ", err);
            res.status(500).send({
              errorMessage: "Unexpected error"
            })
          })
      } else {
        res.status(403).send({
          message: "user not found"
        });
      }
    });
})

authRoutes.post("/forget-password-step-2", (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.otpCode || !req.body.newPassword) {
    res.status(403).send(`
    please send email & otp in json body.
    e.g:
    {
        "email": "abc@gmail.com",
        "newPassword": "xxxxxx",
        "otpCode": "xxxxx" 
    }`)
    return;
  }

  userModel.findOne({ email: req.body.email },
    function (err, userDoc) {
      if (err) {
        res.status(500).send({
          message: "Internal server error"
        });
        return;
      } else if (userDoc) { //user found
        console.log("userDoc===>", userDoc)

        otpModel.find({ email: req.body.email },
          function (err, otpDoc) {
            if (err) {
              res.status(500).send({
                message: "Internal server error"
              })
              return;
            }
            else if (otpDoc.length) {
              otpData = otpDoc[otpDoc.length - 1]
              console.log("otpdoc===>", otpDoc)

              console.log("otpdata===>", otpData)

              const now = new Date().getTime();
              const otpIat = new Date(otpData.createdOn).getTime(); // 2021-01-06T13:08:33.657+0000
              const diff = now - otpIat; // 300000 5 minute
              if (otpData.otpCode === req.body.otpCode && diff < 300000) { // correct otp code
                otpData.remove()
                bcrypt.stringToHash(req.body.newPassword)
                  .then((passwordHash) => {
                    userDoc.update({ password: passwordHash }, {}, function (err, data) {
                      res.send({
                        message: "Password updated successfully"
                      });
                    })
                  })
              } else {
                res.status(401).send({
                  message: "Incorrect OTP"
                });
              }
            }
            else if (!otpDoc) {
              res.status(403).send({
                message: "Email does not exists"
              })
            }
          })

      } else if (!userDoc) {
        res.status(403).send({
          message: "user not found"
        });
      }
    });
})

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//////////////////
module.exports = authRoutes;
