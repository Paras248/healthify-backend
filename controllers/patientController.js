const BigPromise = require("../middlewares/BigPromise");
const prisma = require("../utils/prismaClient");
const { comparePassword } = require("../utils/authUtil");
const cookieToken = require("../utils/cookieToken");

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

    cookieToken(patient, res, "patient");
});

exports.patientGetDetails = BigPromise(async (req, res, next) => {
    const patientId = req.patient.id;

    if (!patientId) {
        res.status(401).json({
            success: false,
            message: "Please login in first",
        });
    }

    const patient = await prisma.patient.findUnique({
        include: {
            records: {
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            },
        },
        where: {
            id: patientId,
        },
    });

    if (!patient) {
        return next(
            res.status(400).json({
                success: false,
                message: "No patient found! Please check the id",
            })
        );
    }

    const patientObject = {
        id: patient.id,
        firstName: patient.firstName,
        middleName: patient.middleName,
        lastName: patient.lastName,
        email: patient.email,
        contactNo: patient.contactNo,
        dateOfBirth: patient.dateOfBirth,
        age: patient.age,
        gender: patient.gender,
        address: patient.address,
        isAlive: patient.isAlive,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
    };

    const recordArray = [...patient.records];

    patient.password = undefined;

    res.status(200).json({
        success: true,
        patient: patientObject,
        record: recordArray,
    });
});

exports.patientSearchSingleRecord = BigPromise(async (req, res, next) => {
    const recordId = req.params.id;

    if (!recordId) {
        return next(
            res.status(400).json({
                success: false,
                message: "Incorrect record id",
            })
        );
    }

    const record = await prisma.records.findUnique({
        include: {
            doctor: {},
            hospital: {},
        },
        where: {
            id: recordId,
        },
    });

    if (!record) {
        return next(
            res.status(400).json({
                success: false,
                message: "No record found!",
            })
        );
    }

    res.status(200).json({
        success: true,
        record,
    });
});
