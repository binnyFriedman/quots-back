const express = require("express");

const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");
const UsersController = require("../controllers/users");
//passport methods for user auth
const passportSignin = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });

const passportGoogle = passport.authenticate("googleToken", { session: false });

router
  .route("/signup")
  .post(validateBody(schemas.authSchema), UsersController.signup);

router
  .route("/signin")
  .post(
    validateBody(schemas.authSchema),
    passportSignin,
    UsersController.signin,
  );

router.route("/oauth/google").post(passportGoogle, UsersController.googleOauth);

router.route("/secret").get(passportJWT, UsersController.secret);

router.route("/get").get(passportJWT, UsersController.getOne);

router.route("/getone").get(passportJWT, UsersController.byid);

router.route("/updateone").post(passportJWT, UsersController.updateuser);

module.exports = router;
