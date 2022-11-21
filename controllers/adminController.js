const BigPromise = require("../middlewares/BigPromise");
const { hashPassword } = require("../utils/authUtil");
const cookieToken = require("../utils/cookieToken");
const { PrismaClient } = require("@prisma/client");
const changeLetterCase = require("../utils/changeLetterCase");
const checkAndGenerateId = require("../utils/checkAndGenerateId");
const { comparePassword } = require("../utils/authUtil");

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

    let uniqueId = await checkAndGenerateId(prisma);

    name = changeLetterCase(name);

    const hashedPassword = await hashPassword(password);
    try {
        const patient = await prisma.patient.create({
            data: {
                id: `P${uniqueId}`,
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
                message: "Patient already exists",
            })
        );
    }
});

exports.adminDoctorSignUp = BigPromise(async (req, res, next) => {
    let { name, email, password, contactNo, qualification, address, gender, age } =
        req.body;

    if (
        !name ||
        !email ||
        !password ||
        !contactNo ||
        !qualification ||
        !age ||
        !gender ||
        !address
    ) {
        return next(
            res.status(400).json({
                success: false,
                message: "Please fields are required",
            })
        );
    }

    name = changeLetterCase(name);

    let uniqueId = await checkAndGenerateId(prisma);

    const hashedPassword = await hashPassword(password);

    try {
        const doctor = await prisma.doctor.create({
            data: {
                id: `D${uniqueId}`,
                name,
                email,
                password: hashedPassword,
                contactNo,
                qualification,
                address,
                gender,
                age,
            },
        });

        doctor.password = undefined;

        res.status(200).json({
            success: true,
            doctor,
        });
    } catch (err) {
        return next(
            res.status(400).json({
                success: false,
                message: "Doctor already exists",
            })
        );
    }
});

exports.adminHospitalSignUp = BigPromise(async (req, res, next) => {
    let { name, email, password, contactNo, type, address } = req.body;

    if (!name || !email || !password || !contactNo || !address || !type) {
        return next(
            res.status(400).json({
                success: false,
                message: "Please fields are required",
            })
        );
    }

    name = changeLetterCase(name);

    let uniqueId = await checkAndGenerateId(prisma);

    const hashedPassword = await hashPassword(password);

    try {
        const hospital = await prisma.hospital.create({
            data: {
                id: `H${uniqueId}`,
                name,
                email,
                password: hashedPassword,
                contactNo,
                address,
                type,
            },
        });

        hospital.password = undefined;

        res.status(200).json({
            success: true,
            hospital,
        });
    } catch (err) {
        return next(
            res.status(400).json({
                success: false,
                message: "Hospital already exists",
            })
        );
    }
});

exports.adminSignup = BigPromise(async (req, res, next) => {
    let { email, name, password, contactNo } = req.body;
    if (!email || !name || !password || !contactNo) {
        return next(
            res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        );
    }

    name = changeLetterCase(name);
    const hashedPassword = await hashPassword(password);

    try {
        const admin = await prisma.admin.create({
            data: {
                email,
                name,
                password: hashedPassword,
                contactNo,
            },
        });

        admin.password = undefined;

        res.status(200).json({
            success: true,
            admin,
        });
    } catch (err) {
        return next(
            res.status(400).json({
                success: false,
                message: "Admin already exists",
            })
        );
    }
});

exports.adminSignIn = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        );
    }

    const admin = await prisma.admin.findUnique({
        where: {
            email: email,
        },
    });

    if (!admin) {
        return next(
            res.status(400).json({
                success: false,
                message: "Incorrect email",
            })
        );
    }

    const isValidPassword = await comparePassword(password, admin.password);

    if (!isValidPassword) {
        return next(
            res.status(400).json({
                success: false,
                message: "Incorrect password",
            })
        );
    }

    cookieToken(admin, res, "admin");
});
