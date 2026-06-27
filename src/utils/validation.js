const validator = require("validator");


// VALIDATION UTILITIES
// Helper functions for validating
// user input.




// REGISTER DATA VALIDATION


const validateRegisterData = (req) => {

    const {
        name,
        email,
        password
    } = req.body;


    // Check if all fields are provided

    if (!name || !email || !password) {

        throw new Error("All fields are required");

    }


    // Check if name is provided

    if (!name.trim()) {

        throw new Error("Name is not valid");

    }


    // Validate email format

    else if (!validator.isEmail(email)) {

        throw new Error("Email is not valid");

    }


    // Validate password strength

    else if (!validator.isStrongPassword(password)) {

        throw new Error(
            "Please enter a strong password"
        );

    }

};

module.exports = {
    validateRegisterData,
};


/*
REGISTER FLOW

1. Check all fields
2. Validate name
3. Validate email
4. Validate password
*/

