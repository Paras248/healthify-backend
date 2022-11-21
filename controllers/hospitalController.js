const BigPromise = require("../middlewares/BigPromise");
const { PrismaClient } = require("@prisma/client");
const { comparePassword } = require("../utils/authUtil");
const cookieToken = require("../utils/cookieToken");

const prisma = new PrismaClient();

exports.hospitalSignIn = BigPromise(async (req, res, next) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return next(
            res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        );
    }

    const hospital = await prisma.hospital.findUnique({
        where: {
            id: userId,
        },
    });

    if (!hospital) {
        return next(
            res.status(400).json({
                success: false,
                message: "No user found! Please provide a correct id",
            })
        );
    }

    const isValidPassword = await comparePassword(password, hospital.password);

    if (!isValidPassword) {
        return next(
            res.status(400).json({
                success: false,
                message: "Incorrect password",
            })
        );
    }

    cookieToken(hospital, res, "hospital");
});
