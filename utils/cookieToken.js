const { getJwtToken } = require("./authUtil");

const cookieToken = async (user, res, userType) => {
    const token = await getJwtToken(user.id);

    const options = {
        expiresIn: new Date(Date.now() + 2 * 1000 * 60 * 60 * 24),
        httpOnly: true,
    };

    user.password = undefined;

    let tokenName = "patientToken";

    if (userType === "doctor") {
        tokenName = "doctorToken";
    } else if (userType === "hospital") {
        tokenName = "hospitalToken";
    } else if (userType === "admin") {
        tokenName = "adminToken";
    }
    res.cookie(tokenName, token, options).json({
        success: true,
        token,
        user,
    });
};

module.exports = cookieToken;
