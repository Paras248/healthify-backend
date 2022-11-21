const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");

const isAdminLoggedIn = async (req, res, next) => {
    const token =
        req.cookie.adminToken || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
        return next(
            res.status(401).json({
                success: false,
                message: "Please login first to access this page",
            })
        );
    }

    const decoded = await jwt.verify(
        token,
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
};

module.exports = isAdminLoggedIn;
