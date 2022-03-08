const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const saltRounds = 10;
const User = require("../models/User.model");

const generateToken = (user) => {
    const payload = {
          _id: user._id,
          email: user.email,
          username: user.username,
        };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        return authToken;
}

router.get("/loggedin", (req, res) => {
  res.json(req.user);
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }
  if (!email) {
    return res.status(400).json({ errorMessage: "Please provide email." });
  }
  if (password.length < 4) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    return res.status(400).json( {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  User.findOne({ email }).then((found) => {
    if (found) {
      return res.status(400).json({ errorMessage: "E-Mail already taken." });
    }
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          email,
          password: hashedPassword,
        });
      })
      .then((user) => {
           const authToken = generateToken(user);
           return res.json({ authToken: authToken });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "E-Mail need to be unique. The e-mail you chose is already in use.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ errorMessage: "Please provide your email." });
  }
  if (password.length < 4) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }
        const authToken = generateToken(user);
        return res.json({ authToken: authToken });
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.json(req.payload);
});

router.put("/update", isAuthenticated, (req, res) => {
  const { _id } = req.payload;
  const { username, email, password, img, bio } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }
  if (!email) {
    return res.status(400).json({ errorMessage: "Please provide email." });
  }
  if (password.length < 4) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.findByIdAndUpdate(_id, {
        username,
        email,
        bio,
        img,
        password: hashedPassword,
      });
    })
    .then((updatedUser) => {
      res.status(201).json(updatedUser);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "The e-mail you chose is already in use.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
});

module.exports = router;
