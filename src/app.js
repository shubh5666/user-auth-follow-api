require("dotenv").config();

console.log("PORT =", process.env.PORT);
console.log("JWT_SECRET =", process.env.JWT_SECRET);

const express = require("express");

const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);

connectDB()
.then(() => {

    console.log("Database connection established..");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {

        console.log(`Server is successfully listening on port ${PORT}`);

    });

})
.catch((err) => {

    console.log("Database cannot be connected");

});