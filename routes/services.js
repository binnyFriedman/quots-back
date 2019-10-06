const express = require("express");

const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");
const ServicesController = require("../controllers/services");
//passport methods for user auth
const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, ServicesController.getServices);

router.route("/add").post(passportJWT, ServicesController.addService);
router.route("/update/:id").post(passportJWT, ServicesController.updateService);

module.exports = router;
