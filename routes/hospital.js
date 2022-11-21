const express = require("express");
const Router = express.Router();
const { hospitalSignIn, patientAddRecord } = require("../controllers/hospitalController");

Router.route("/hospital/signin").post(hospitalSignIn);
Router.route("/hospital/patient/record/add").post(patientAddRecord);

module.exports = Router;
