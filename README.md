# TRACKit

**Testing Reporting Academic Comprehensive Kit**

TRACKit is a modern, streamlined academic management platform designed primarily for IIT Kanpur but easily extendable to institutions worldwide. It centralizes course management, schedules, lectures, assignments, announcements, and discussions into a single web-based application for students, faculty, and system administrators.

---
## 📜 Project Documents
All project documents are available in the `./Doc` directory.

In these documents you will find extensive information about TRACKit!

We have the following documents:
- SRS
- Design Document
- Implementation Document
- Test Document
- User Manual
- Final Presentation Slides

---

## 👨‍💻 Project Developers
| Name                     | Roll Number |
|---------------------------|-------------|
| Aditya Gautam             | 220064      |
| Ved Prakash Vishwakarma   | 221180      |
| Akash Verma               | 220097      |
| Dhruv Rai                 | 220365      |
| Rahul Ahirwar             | 220856      |
| Aayush Singh              | 220024      |
| Mayur Agrawal             | 220641      |
| Dhruv Varshney            | 220366      |
| Abhijeet Agarwal          | 210025      |
| Aryan Bansal              | 200198      |
| Sharique Ahmad            | 221002      |

## 🌐 Live Website (Only accessible via IIT Kanpur Intranet)
http://172.27.16.252:3036/

---

## 🚀 Steps to Run TRACKit Locally

1. **Start Backend**:  
   Navigate to the backend directory and run:
   ```bash
   npm start
   ```
   (Backend runs on port **3001**. Detailed instructions are available in the backend's README.)

2. **Start Frontend**:  
   Navigate to the frontend directory and run:
   ```bash
   npm run build
   npm start
   ```
   (Frontend runs on port **3000**.)

3. Open your browser and go to:  
   ```
   http://localhost:3000/login
   ```

---

## 🎯 Product Scope

Managing academic courses, assignments, lectures, quizzes, and exams can be overwhelming. TRACKit addresses these challenges by:

- Providing a **centralized platform** for students and faculty.
- Offering **real-time updates**, **task tracking**, and **progress monitoring**.
- Promoting **transparency and collaboration** between students and instructors.
- Supporting **reminders, personalized dashboards**, and **authenticity** via System Admin-controlled user creation.

TRACKit replaces disjointed platforms like Moodle, HelloIITK, Piazza, static course websites, and email chains, offering a unified and tailored academic management solution.

---

## 🔥 Product Features

- **Login System**: Secure authentication managed by System Admin. "Forgot Password" support included.
- **Main Dashboard**: See enrolled courses and a merged academic calendar at a glance.
- **Performance Tab**: View progress templates, completed courses, pending tasks, and grade sheets.
- **Profile & Contact Us Tabs**: Manage personal details and request support.
- **Course Management**:
  - **Course Home**: Event lists, materials, and attendance records.
  - **Lectures**: Chronological listing of videos, PDFs, and notes.
  - **Announcements**: Important course updates.
  - **Calendar**: Detailed course-specific event calendar.
  - **Results**: Exam scores, statistics, and grades.
  - **Forum**: Discussion boards for students and faculty, moderated by instructors.
- **System Admin Interface**:
  - Create/manage courses, users, and faculty.
  - Ensure data authenticity and prevent account duplication.

---

## 👤 User Types

- **Admin**: Full system control (user management, course creation, overall settings).
- **Faculty**: Manage course content (lectures, announcements, grades, materials).
- **Student**: Access and track course information, lectures, events, results, and discussions.

---

## 🛠️ Tech Stack

### Frontend

- **React.js**: Efficient component-based UI development.
- **Tailwind CSS**: Utility-first CSS framework for rapid and consistent styling.

### Backend

- **Node.js**: Non-blocking, event-driven backend runtime.
- **Express.js**: Minimal and flexible Node.js web application framework.

### Database

- **Sequelize ORM**: Promise-based ORM supporting multiple SQL databases.
- **SQLite** (Development Phase) → **PostgreSQL** (Production Deployment).

### Authentication & Security

- **JWT**: Stateless authentication using JSON Web Tokens.
- **bcryptjs**: Secure password hashing and salting.
- **Helmet.js**: Setting secure HTTP headers for Express apps.
- **express-rate-limit**: Rate limiting to protect against brute-force attacks.
- **dotenv**: Environment variable management.

---

# 🎓 Empowering Learning, Simplifying Management — Welcome to TRACKit!
