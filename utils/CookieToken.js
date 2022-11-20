const { getJwtToken } = require("./authUtil");

const CookieToken = async (user, res) => {
    const token = await getJwtToken(user.id);

    const options = {
        expiresIn: new Date(Date.now() + 2 * 1000 * 60 * 60 * 24),
        httpOnly: true,
    };

    res.cookie("healthifyToken", token, options).status(200).json({
        success: true,
        token,
        user,
    });
};

module.exports = CookieToken;
