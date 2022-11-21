const express = require("express");
const Router = express.Router();
const { doctorSignIn } = require("../controllers/doctorController");

Router.route("/doctor/signin").post(doctorSignIn);

module.exports = Router;
