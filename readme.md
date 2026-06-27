
This project is a simple backend application built with **Node.js**, **Express.js**, and **SQLite**. It provides JWT-based authentication and a basic follow system where users can follow, unfollow, and view followers.

## Tech Stack

- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT
- bcryptjs



## APIs

### Register

**POST** `/api/auth/register`

Creates a new user account and returns a JWT token.

### Login

**POST** `/api/auth/login`

Logs in an existing user and returns a JWT token.

### Follow User

**POST** `/api/users/:id/follow`

Allows a logged-in user to follow another user.

### Unfollow User

**DELETE** `/api/users/:id/follow`

Removes the follow relationship between two users.

### Get Followers

**GET** `/api/users/:id/followers`

Returns all followers of a specific user.


## Database

The project uses two tables:

### users

Stores user information such as name, email, and encrypted password.

### follows

Stores the relationship between users, indicating who follows whom.


## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Follow and unfollow users
- View followers of any user
- Input validation
- Error handling


## Testing

All APIs were tested using **Postman**. Protected routes require a valid JWT token in the `Authorization` header.

Authorization: Bearer <JWT_TOKEN>




## Author

**Shubham Chauhan**