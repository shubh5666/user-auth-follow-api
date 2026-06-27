const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

// ==========================================
// USER ROUTES
//
// Handles:
// 1. Follow User
// 2. Unfollow User
// 3. Get Followers
// ==========================================



// ==========================================
// FOLLOW USER API
//
// Follow another user.
// ==========================================

userRouter.post("/:id/follow", userAuth, async (req, res) => {

    try {

        const followerId = req.user.id;
        const followingId = parseInt(req.params.id);

        console.log("Follower ID:", followerId);
        console.log("Following ID:", followingId);

        // Check if User Id is valid

        if (isNaN(followingId)) {

            return res.status(400).json({

                message: "Invalid User Id",

            });

        }

        // Prevent following yourself

        if (followerId === followingId) {

            return res.status(400).json({

                message: "You cannot follow yourself",

            });

        }

        // Check whether user exists

        const user = global.db
            .prepare("SELECT * FROM users WHERE id = ?")
            .get(followingId);

        console.log("User Found:", user);

        if (!user) {

            return res.status(404).json({

                message: "User not found",

            });

        }

        // Check existing follow

        const existingFollow = global.db
            .prepare(`
                SELECT * FROM follows
                WHERE followerId = ?
                AND followingId = ?
            `)
            .get(followerId, followingId);

        console.log("Existing Follow:", existingFollow);

        if (existingFollow) {

            return res.status(400).json({

                message: "Already following this user",

            });

        }

        // Save follow

        const result = global.db
            .prepare(`
                INSERT INTO follows
                (followerId, followingId)
                VALUES (?, ?)
            `)
            .run(followerId, followingId);

        console.log("Insert Result:", result);

        // Show all follows

        const allFollows = global.db
            .prepare("SELECT * FROM follows")
            .all();

        console.log("All Follows:", allFollows);

        res.status(200).json({

            message: "User followed successfully",

        });

    }

    catch (err) {

        console.log(err);

        res.status(400).json({

            message: err.message,

        });

    }

});



// ==========================================
// UNFOLLOW USER API
//
// Remove follow.
// ==========================================

userRouter.delete("/:id/follow", userAuth, async (req, res) => {

    try {

        const followerId = req.user.id;
        const followingId = parseInt(req.params.id);

        // Check if User Id is valid

        if (isNaN(followingId)) {

            return res.status(400).json({

                message: "Invalid User Id",

            });

        }

        const result = global.db
            .prepare(`
                DELETE FROM follows
                WHERE followerId = ?
                AND followingId = ?
            `)
            .run(followerId, followingId);

        if (result.changes === 0) {

            return res.status(404).json({

                message: "Follow relationship not found",

            });

        }

        res.status(200).json({

            message: "User unfollowed successfully",

        });

    }

    catch (err) {

        res.status(400).json({

            message: err.message,

        });

    }

});



// ==========================================
// GET FOLLOWERS API
//
// Returns followers of a user.
// ==========================================

userRouter.get("/:id/followers", async (req, res) => {

    try {

        const userId = parseInt(req.params.id);

        // Check if User Id is valid

        if (isNaN(userId)) {

            return res.status(400).json({

                message: "Invalid User Id",

            });

        }

        // Check whether user exists

        const user = global.db
            .prepare("SELECT * FROM users WHERE id = ?")
            .get(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found",

            });

        }

        const followers = global.db
            .prepare(`
                SELECT users.id,
                       users.name,
                       users.email

                FROM follows

                INNER JOIN users

                ON follows.followerId = users.id

                WHERE follows.followingId = ?
            `)
            .all(userId);

        res.status(200).json({

            followers,

        });

    }

    catch (err) {

        res.status(400).json({

            message: err.message,

        });

    }

});

module.exports = userRouter;