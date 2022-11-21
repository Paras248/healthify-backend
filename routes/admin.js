const express = require("express");
const Router = express.Router();

const {
    adminPatientSignUp,
    adminDoctorSignUp,
    adminHospitalSignUp,
    adminSignup,
} = require("../controllers/adminController");

Router.route("/admin/patient/signup").post(adminPatientSignUp);
Router.route("/admin/doctor/signup").post(adminDoctorSignUp);
Router.route("/admin/hospital/signup").post(adminHospitalSignUp);
Router.route("/admin/signup").post(adminSignup);

module.exports = Router;
