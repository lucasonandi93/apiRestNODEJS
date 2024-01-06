const User = require("../models/User");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
  const strategy = new Strategy(params, (payload, done) => {
    User.findById(payload.id)
      .then(user => {
        if (payload.expire <= Date.now()) {
          return done(new Error("TokenExpired"), null);
        }
        return done(null, user);
      })
      .catch(err => done(err, null));
  });

  passport.use(strategy);

  return { initialize: () => passport.initialize() };
};