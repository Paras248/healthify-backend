const BigPromise = require("../middlewares/BigPromise");
const { hashPassword } = require("../utils/authUtil");
const cookieToken = require("../utils/cookieToken");
const prisma = require("../utils/prismaClient");
const changeLetterCase = require("../utils/changeLetterCase");
const checkAndGenerateId = require("../utils/checkAndGenerateId");
const { comparePassword } = require("../utils/authUtil");

exports.adminPatientSignUp = BigPromise(async (req, res, next) => {
    let {
        firstName,
        middleName,
        lastName,
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
        !firstName ||
        !middleName ||
        !lastName ||
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

    const name = changeLetterCase(firstName, middleName, lastName);

    const hashedPassword = await hashPassword(password);
    try {
        const patient = await prisma.patient.create({
            data: {
                id: `P${uniqueId}`,
                firstName: name.firstName,
                middleName: name.middleName,
                lastName: name.lastName,
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
        console.log(err)
        return next(
            res.status(400).json({
                success: false,
                message: "Patient already exists",
            })
        );
    }
});

exports.adminDoctorSignUp = BigPromise(async (req, res, next) => {
    let {
        firstName,
        middleName,
        lastName,
        email,
        password,
        contactNo,
        qualification,
        address,
        gender,
        age,
    } = req.body;

    if (
        !firstName ||
        !middleName ||
        !lastName ||
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

    const name = changeLetterCase(firstName, middleName, lastName);

    let uniqueId = await checkAndGenerateId(prisma);

    const hashedPassword = await hashPassword(password);

    try {
        const doctor = await prisma.doctor.create({
            data: {
                id: `D${uniqueId}`,
                firstName: name.firstName,
                middleName: name.middleName,
                lastName: name.lastName,
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

    const namedArray = name.split(" ");
    for (let i = 0; i < namedArray.length; i++) {
        const changedCaseName =
            namedArray[i].charAt(0).toUpperCase() + namedArray[i].slice(1);
        namedArray[i] = changedCaseName;
    }
    name = namedArray.join(" ");

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
    let { email, firstName, middleName, lastName, password, contactNo } = req.body;
    if (!email || !firstName || !middleName || !lastName || !password || !contactNo) {
        return next(
            res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        );
    }

    const name = changeLetterCase(firstName, middleName, lastName);
    console.table(name);
    const hashedPassword = await hashPassword(password);
    firstName = name.firstName;
    middleName = name.middleName;
    lastName = name.lastName;

    try {
        const admin = await prisma.admin.create({
            data: {
                email,
                firstName,
                middleName,
                lastName,
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
