const BigPromise = require("../middlewares/BigPromise");
const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword } = require("../utils/authUtil");
const cookieToken = require("../utils/cookieToken");

const prisma = new PrismaClient();

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

    const patient = await prisma.patient.findUnique({
        where: {
            id: userId,
        },
    });
    if (!patient) {
        return next(
            res.status(400).json({
                success: false,
                message: "No user found! Please provide a correct id",
            })
        );
    }
    const isValidPassword = await comparePassword(password, patient.password);
    if (!isValidPassword) {
        return next(
            res.status(400).json({
                success: false,
                message: "Incorrect password",
            })
        );
    }

    cookieToken(patient, res);
});
