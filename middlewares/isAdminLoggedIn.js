const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");
const BigPromise = require("./BigPromise");

const isAdminLoggedIn = BigPromise(async (req, res, next) => {
    const token =
        req.cookies.adminToken ||
        req.headers["Authorization"] ||
        req.headers["authorization"];

    if (!token) {
        return next(
            res.status(401).json({
                success: false,
                message: "Please login first to access this page",
            })
        );
    }

    const decoded = await jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET,
        (err, decodedData) => {
            if (err) {
                return next(
                    res.status(401).json({
                        success: false,
                        message: "Please login first to access this page",
                    })
                );
            }
            return decodedData;
        }
    );

    req.admin = await prisma.admin.findUnique({
        where: {
            id: decoded.id,
        },
    });

    next();
});

module.exports = isAdminLoggedIn;
