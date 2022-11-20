const express = require("express");
const Router = express.Router();
const { patientSignIn } = require("../controllers/patientController");

Router.route("/patient/signin").post(patientSignIn);

module.exports = Router;
