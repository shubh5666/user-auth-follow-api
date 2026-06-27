const jwt = require("jsonwebtoken");

// ==========================================
// USER AUTHENTICATION MIDDLEWARE
//
// Verify JWT Token
// ==========================================

const userAuth = async (req, res, next) => {

    try {

        // Read token from Authorization Header
        //
        // Example:
        // Authorization: Bearer eyJhbGci...

        const authHeader = req.headers.authorization;

        // Check if Authorization Header exists

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                message: "Please Login",

            });

        }

        // Extract JWT Token

        const token = authHeader.split(" ")[1];

        // Verify Token

        const decodedObj = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store logged-in user information

        req.user = decodedObj;

        next();

    }

    catch (err) {

        res.status(401).json({

            message: err.message,

        });

    }

};

module.exports = {
    userAuth,
};


/*
==========================================
USER AUTHENTICATION FLOW

1. Read Authorization Header

2. Validate Bearer Token

3. Verify JWT

4. Store User Information

5. Move to Next Middleware

==========================================
*/