

const jwt = require("jsonwebtoken");

// ==========================================
// JWT TOKEN GENERATION
//
// Generate JWT token for the user.
// ==========================================

const generateToken = async (userId) => {

    const token = await jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return token;
};

module.exports = generateToken;