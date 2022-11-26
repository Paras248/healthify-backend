const BigPromise = require("../middlewares/BigPromise");
const prisma = require("../utils/prismaClient");
const { comparePassword } = require("../utils/authUtil");
const cookieToken = require("../utils/cookieToken");

exports.doctorSignIn = BigPromise(async (req, res, next) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return next(
            res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        );
    }

    const doctor = await prisma.doctor.findUnique({
        where: {
            id: userId,
        },
    });

    if (!doctor) {
        return next(
            res.status(400).json({
                success: false,
                message: "No user found! Please provide a correct id",
            })
        );
    }

    const isValidPassword = await comparePassword(password, doctor.password);

    if (!isValidPassword) {
        return next(
            res.status(400).json({
                success: false,
                message: "Incorrect password",
            })
        );
    }

    cookieToken(doctor, res, "doctor");
});
