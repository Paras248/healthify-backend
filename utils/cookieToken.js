const { getJwtToken } = require("./authUtil");

const cookieToken = async (user, res) => {
    const token = await getJwtToken(user.id);

    const options = {
        expiresIn: new Date(Date.now() + 2 * 1000 * 60 * 60 * 24),
        httpOnly: true,
    };

    user.password = undefined;

    res.cookie("healthifyToken", token, options).json({
        success: true,
        token,
        user,
    });
};

module.exports = cookieToken;
