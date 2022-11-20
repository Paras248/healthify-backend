require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const app = express();

const admin = require("./routes/admin");
const patient = require("./routes/patient");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", patient);
app.use("/api", admin);

module.exports = app;
