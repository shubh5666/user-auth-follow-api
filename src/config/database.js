const Database = require("better-sqlite3");
const path = require("path");
console.log("Database Location:", path.resolve("database.db"));


// DATABASE CONNECTION
// Connect Node.js application to SQLite


async function connectDB() {

    const db = new Database("database.db");

    // Enable Foreign Keys

    db.pragma("foreign_keys = ON");


    // USERS TABLE
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL

        )
    `).run();



    // FOLLOWS TABLE

    db.prepare(`
        CREATE TABLE IF NOT EXISTS follows (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            followerId INTEGER NOT NULL,

            followingId INTEGER NOT NULL,

            UNIQUE(followerId, followingId),

            FOREIGN KEY(followerId) REFERENCES users(id),

            FOREIGN KEY(followingId) REFERENCES users(id)

        )
    `).run();


    // Make database available throughout project

    global.db = db;

    return db;

}

module.exports = connectDB;


/*
DATABASE FLOW

1. Connect SQLite

2. Enable Foreign Keys

3. Create users table

4. Create follows table

5. Return database connection

*/