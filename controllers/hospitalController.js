const BigPromise = require("../middlewares/BigPromise");
const prisma = require("../utils/prismaClient");
const { comparePassword } = require("../utils/authUtil");
const cookieToken = require("../utils/cookieToken");

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
    const { patientId, doctorId, medicines, diagnosis, description } = req.body;
    const hospitalId = req.hospital.id;

    if (!patientId || !doctorId || !medicines || !diagnosis || !description) {
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
                diagnosis,
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
            message: "hospital id or patient id or Doctor id is incorrect",
        });
    }
});

exports.hospitalSearchPatient = BigPromise(async (req, res, next) => {
    const patientId = req.query.patientId;

    if (!patientId) {
        return next(
            res.status(400).json({
                success: false,
                message: "please provide the correct patient id",
            })
        );
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

    patient.password = undefined;

    res.status(200).json({
        success: true,
        patient,
    });
});

exports.hospitalSearchSingleRecord = BigPromise(async (req, res, next) => {
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

exports.hospitalSearchDoctor = BigPromise(async (req, res, next) => {
    const doctorId = req.body.doctorId;

    if (!doctorId) {
        return next(
            res.status(400).json({
                success: false,
                message: "please provide the correct doctor id",
            })
        );
    }

    const doctor = await prisma.doctor.findUnique({
        where: {
            id: doctorId,
        },
    });

    if (!doctor) {
        return next(
            res.status(400).json({
                success: false,
                message: "No doctor found! Please check the id",
            })
        );
    }

    res.status(200).json({
        success: true,
        patient,
    });
});
