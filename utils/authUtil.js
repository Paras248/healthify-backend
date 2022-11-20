const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

exports.comparePassword = async (password, storedPassword) => {
    const isEqual = await bcrypt.compare(password, storedPassword);
    return isEqual;
};

exports.getJwtToken = async (id) => {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET);
    return token;
};
