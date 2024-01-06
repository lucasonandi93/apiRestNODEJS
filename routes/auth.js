const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  User.register(
    new User({
      email: req.body.email,
      username: req.body.username
    }), req.body.password, function (err, user) {
      if (err) {
        res.json(err);
      } else {
        res.json(user);
      }
    }
  );
});

router.post("/login", async (req, res) => {
  const {user} = await User.authenticate()(req.body.username, req.body.password);
  if (user) {
    const payload = {
      id: user.id,
      expire: Date.now() + 1000 * 60 * 60 * 24 * 7
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET)

    res.json({ token: token });
  } else {
    res.json({ error: 'Can\'t connect!' });
  }
});

module.exports = router;