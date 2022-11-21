const express = require("express");
const Router = express.Router();
const {
    hospitalSignIn,
    patientAddRecord,
    hospitalSearchPatient,
    hospitalSearchSingleRecord,
} = require("../controllers/hospitalController");
const isHospitalLoggedIn = require("../middlewares/isHospitalLoggedIn");

Router.route("/hospital/signin").post(hospitalSignIn);
Router.route("/hospital/patient/record/add").post(isHospitalLoggedIn, patientAddRecord);
Router.route("/hospital/patient/search").get(isHospitalLoggedIn, hospitalSearchPatient);
Router.route("/hospital/patient/search/record/:id").get(
    isHospitalLoggedIn,
    hospitalSearchSingleRecord
);

module.exports = Router;
