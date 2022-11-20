const BigPromise = require("../middlewares/BigPromise");
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../utils/authUtil");

const prisma = new PrismaClient();
exports.patientSignUp = BigPromise(async (req, res, next) => {
    const {
        name,
        email,
        password,
        contactNo,
        dateOfBirth,
        age,
        gender,
        address,
        isAlive,
    } = req.body;

    if (
        !name ||
        !email ||
        !password ||
        !contactNo ||
        !dateOfBirth ||
        !age ||
        !gender ||
        !address ||
        !isAlive
    ) {
        return next(
            res.status(400).json({
                success: false,
                message: "Please fields are required",
            })
        );
    }

    const hashedPassword = hashPassword(password);

    const patient = await prisma.patient.create({
        name,
        email,
        password,
        contactNo,
        dateOfBirth,
        age,
        gender,
        address,
        isAlive,
    });

    CookieToken(patient, res);
});

exports.patientSignIn = BigPromise(async (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password;

    if (!userId || !password) {
        return next(
            res.status(400).json({
                success: true,
                message: "All fields are required",
            })
        );
    }
});
