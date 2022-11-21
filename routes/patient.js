const express = require("express");
const Router = express.Router();
const {
    patientSignIn,
    patientGetDetails,
    patientSearchSingleRecord,
} = require("../controllers/patientController");
const isPatientLoggedIn = require("../middlewares/isPatientLoggedIn");

Router.route("/patient/signin").post(patientSignIn);
Router.route("/patient/dashboard").get(isPatientLoggedIn, patientGetDetails);
Router.route("/patient/dashboard/record/:id").get(
    isPatientLoggedIn,
    patientSearchSingleRecord
);

module.exports = Router;
