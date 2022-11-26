require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const app = express();

const admin = require("./routes/admin");
const patient = require("./routes/patient");
const doctor = require("./routes/doctor");
const hospital = require("./routes/hospital");

app.use(cors({
	credentials: true,
	origin: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser({
	sameSite: "none"
}));

app.use("/api", patient);
app.use("/api", admin);
app.use("/api", doctor);
app.use("/api", hospital);

module.exports = app;
