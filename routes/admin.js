const express = require("express");
const Router = express.Router();

const { adminPatientSignUp } = require("../controllers/adminController");

Router.route("/admin/patient/signup").post(adminPatientSignUp);

module.exports = Router;
