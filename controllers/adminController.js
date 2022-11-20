const BigPromise = require("../middlewares/BigPromise");
const { hashPassword } = require("../utils/authUtil");
const generateUniqueId = require("generate-unique-id");
// const prisma = require("../utils/prismaClient");
const CookieToken = require("../utils/CookieToken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.adminPatientSignUp = BigPromise(async (req, res, next) => {
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

    let uniqueId;

    while (true) {
        const generatedId = generateUniqueId({
            length: 12,
            useLetters: false,
        });
        const patient = await prisma.patient.findUnique({
            where: {
                id: generatedId,
            },
        });
        if (!patient) {
            uniqueId = generatedId;
            break;
        }
    }

    const hashedPassword = await hashPassword(password);

    const patient = await prisma.patient.create({
        data: {
            id: uniqueId,
            name,
            email,
            password: hashedPassword,
            contactNo,
            dateOfBirth,
            age,
            gender,
            address,
            isAlive,
        },
    });

    CookieToken(patient, res);
});
