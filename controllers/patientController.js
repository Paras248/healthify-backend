const BigPromise = require("../middlewares/BigPromise");
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../utils/authUtil");

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
});
