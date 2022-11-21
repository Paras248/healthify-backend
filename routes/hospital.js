const express = require("express");
const Router = express.Router();
const { hospitalSignIn } = require("../controllers/hospitalController");

Router.route("/hospital/signin").post(hospitalSignIn);

module.exports = Router;
