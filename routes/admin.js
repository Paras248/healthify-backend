const express = require("express");
const Router = express.Router();

const {
    adminPatientSignUp,
    adminDoctorSignUp,
    adminHospitalSignUp,
    adminSignup,
    adminSignIn,
} = require("../controllers/adminController");
const isAdminLoggedIn = require("../middlewares/isAdminLoggedIn");

Router.route("/admin/patient/signup").post(isAdminLoggedIn, adminPatientSignUp);
Router.route("/admin/doctor/signup").post(isAdminLoggedIn, adminDoctorSignUp);
Router.route("/admin/hospital/signup").post(isAdminLoggedIn, adminHospitalSignUp);
Router.route("/admin/signup").post(adminSignup);
Router.route("/admin/signin").post(adminSignIn);

module.exports = Router;
