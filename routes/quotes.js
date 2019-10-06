const express = require("express");

const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");
//passport methods for user auth
const passportJWT = passport.authenticate("jwt", { session: false });
const QoutsController = require("../controllers/qoutes");

router.route("/").get(passportJWT, QoutsController.getQuotes);

router.route("/single/:id").get(passportJWT, QoutsController.getSingleQuote);
router.route("/delete/:id").post(passportJWT, QoutsController.deleteQuote);
router.route("/update/:id").post(passportJWT, QoutsController.updateQuote);
router.route("/create/").post(passportJWT, QoutsController.createQuote);
router.route("/export/:id").get(QoutsController.exportQuote);

module.exports = router;
