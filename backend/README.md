# TRACKit Backend

TRACKit is a college course information portal that provides a centralized system for managing courses, users, and academic information.

## Overview

The backend of TRACKit provides a secure API for course management, user authentication, and role-based access control. This system supports three user types: Admin, Faculty, and Student, each with different permissions and capabilities.

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (JSON Web Token)
- **Security**: bcryptjs for password hashing, Helmet.js for HTTP headers
- **Rate Limiting**: express-rate-limit to prevent brute-force attacks

## How to run the server

1. Clone the repo.
   
  After cloning the repository, you need to create a `.env` file in the backend directory with the following variables:
  
  ```
  PORT=3000
  JWT_SECRET=your_secure_random_string_here
  NODE_ENV=development
  DB_PATH=./database.sqlite
  ```
  
  Replace `your_secure_random_string_here` with a strong random string to secure your JWT tokens.

2. run `npm install` in terminal.

3. run `npm start` in terminal.




## Database

The application uses SQLite by default. The database file (database.sqlite) will be 
automatically created in the backend directory when the server first runs. This file
is excluded from version control.
In the future, it will be upgraded to a more robust database like MySQL or PostgreSQL.

> **Note**: The `.env` file contains sensitive information and should never be committed to version control.

## Default Admin Credentials

The system automatically creates an admin user on first run:

Username: admin

Password: admin123
