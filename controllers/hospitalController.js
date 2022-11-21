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

exports.patientAddRecord = BigPromise(async (req, res, next) => {
    const { patientId, doctorId, medicines, disease, description } = req.body;
    const hospitalId = req.hospital;

    if (!patientId || !doctorId || !medicines || !disease || !description) {
        return next(
            res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        );
    }

    try {
        const record = await prisma.records.create({
            data: {
                medicines,
                disease,
                description,
                patientId,
                doctorId,
                hospitalId,
            },
        });

        const hospital = await prisma.hospital.findUnique({
            where: {
                id: hospitalId,
            },
        });

        req.hospital = hospital;

        res.status(200).json({
            success: true,
            record,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "hospital id or patient id or hospital id is incorrect",
        });
    }
});
