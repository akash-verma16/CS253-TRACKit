require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./models');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/announcements', require('./routes/announcement.routes'));
app.use('/api/course-descriptions', require('./routes/courseDescriptionEntry.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/faculty', require('./routes/faculty.routes'));

// Initialize database and sync models
db.sequelize.sync({ force: process.env.NODE_ENV === 'development' })
  .then(async () => {
    console.log('Database synced successfully');
    // Initialize database with sample data (in development)
    if (process.env.NODE_ENV === 'development') {
      // Add a longer delay to ensure all tables are fully created and ready
      console.log('Waiting for database tables to settle before initialization...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      try {
        await require('./utils/initState')();
      } catch (error) {
        console.error('Error during state initialization:', error);
      }
    }
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

// Add this to server.js before app.listen()
console.log('Registered routes:');
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.stack[0].method.toUpperCase() + ' ' + r.route.path);
  }
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

