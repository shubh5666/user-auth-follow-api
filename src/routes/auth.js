const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcryptjs");

const { validateRegisterData } = require("../utils/validation");
const generateToken = require("../utils/generateToken");



// REGISTER API
// Create a new user.


authRouter.post("/register", async (req, res) => {

    try {

        // Validate incoming user input

        validateRegisterData(req);

        const {
            name,
            email,
            password
        } = req.body;


        // Check whether user already exists

        const existingUser = global.db
            .prepare(
                "SELECT * FROM users WHERE email = ?"
            )
            .get(email);


        if (existingUser) {

            return res.status(400).json({
                message: "User already exists",
            });

        }


        // Convert plain password into
        // encrypted password.

        const passwordHash =
            await bcrypt.hash(password, 10);


        // Save user into database

        const result = global.db
            .prepare(`
                INSERT INTO users
                (name, email, password)
                VALUES (?, ?, ?)
            `)
            .run(
                name,
                email,
                passwordHash
            );


        // Generate JWT token

        const token =
            await generateToken(
                result.lastInsertRowid
            );


        // Send success response

        res.status(201).json({

            message: "User registered successfully",

            token,

        });

    }

    catch (err) {

        res.status(400).json({

            message: err.message,

        });

    }

});




// LOGIN API
// Authenticate an existing user.


authRouter.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check if email and password
        // are provided

        if (!email || !password) {

            return res.status(400).json({

                message: "Email and Password are required",

            });

        }


        // Find user using email

        const user = global.db
            .prepare(
                "SELECT * FROM users WHERE email = ?"
            )
            .get(email);


        if (!user) {

            return res.status(404).json({

                message: "User not found",

            });

        }


        // Compare entered password
        // with encrypted password

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordValid) {

            return res.status(401).json({

                message: "Invalid email or password",

            });

        }


        // Generate JWT

        const token =
            await generateToken(user.id);


        // Send success response

        res.status(200).json({

            message: "Login successful",

            token,

        });

    }

    catch (err) {

        res.status(400).json({

            message: err.message,

        });

    }

});

module.exports = authRouter;


/*
AUTHENTICATION FLOW

REGISTER

1. Validate input
2. Check existing user
3. Hash password
4. Save user
5. Generate JWT
6. Return token

LOGIN

1. Validate input
2. Find user
3. Compare password
4. Generate JWT
5. Return token

*/