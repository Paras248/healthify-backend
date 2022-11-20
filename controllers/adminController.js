const BigPromise = require("../middlewares/BigPromise");
const { hashPassword } = require("../utils/authUtil");
const generateUniqueId = require("generate-unique-id");
// const prisma = require("../utils/prismaClient");
const cookieToken = require("../utils/cookieToken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.adminPatientSignUp = BigPromise(async (req, res, next) => {
    let { name, email, password, contactNo, dateOfBirth, age, gender, address, isAlive } =
        req.body;

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

    const namedArray = await name.split(" ");
    for (let i = 0; i < namedArray.length; i++) {
        const changedCaseName =
            namedArray[i].charAt(0).toUpperCase() + namedArray[i].slice(1);
        namedArray[i] = changedCaseName;
    }
    name = namedArray.join(" ");

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
    try {
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
        patient.password = undefined;

        res.status(200).json({
            success: true,
            patient,
        });
    } catch (err) {
        return next(
            res.status(400).json({
                success: false,
                message: "User already exists",
            })
        );
    }
});
