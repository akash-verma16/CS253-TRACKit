const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Admin = db.Admin;
const Faculty = db.Faculty;
const Student = db.Student;
const Course = db.Course;
const Announcement = db.Announcement;
const CourseDescriptionEntry = db.CourseDescriptionEntry;

module.exports = async function initState() {
  try {
    console.log('Initializing database with demo data...');
    
    // 1. Create admin user
    const adminUser = await createAdmin();
    
    // 2. Create courses
    const courses = await createCourses();
    
    // 3. Create faculty users and assign to courses
    const facultyUsers = await createFaculty(courses);
    
    // 4. Create student users and assign to courses
    const studentUsers = await createStudents(courses);
    
    // 5. Create announcements for each course
    await createAnnouncements(courses, facultyUsers);
    
    // 6. Create course description entries for each course
    await createCourseDescriptionEntries(courses, facultyUsers);
    
    // 7. Print user login information
    printUserLoginInfo([adminUser, ...facultyUsers, ...studentUsers]);
    
    // 8. Print course enrollments
    await printCourseEnrollments(courses);
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Create admin user
async function createAdmin() {
  // Check if admin already exists
  const adminExists = await User.findOne({
    where: { username: 'admin' }
  });

  if (adminExists) {
    console.log('Admin user already exists, skipping creation');
    return adminExists;
  }

  // Create default admin user
  const hashedPassword = bcrypt.hashSync('admin123', 8);
  
  const admin = await User.create({
    username: 'admin',
    email: 'admin@trackit.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    userType: 'admin'
  });

  await Admin.create({
    userId: admin.id
  });
  
  return admin;
}

// Create courses
async function createCourses() {
  const courses = [
    {
      code: 'EE321',
      name: 'Digital Signal Processing',
      description: 'Introduction to signals and systems, discrete-time signals, linear time-invariant systems, z-transforms, Fourier analysis.',
      credits: 4,
      semester: 'Fall 2023'
    },
    {
      code: 'CS253',
      name: 'Software Development',
      description: 'Software development methodologies, design patterns, testing strategies, version control systems, and project management.',
      credits: 3,
      semester: 'Fall 2023'
    }
  ];
  
  const createdCourses = [];
  
  for (const course of courses) {
    const existingCourse = await Course.findOne({ where: { code: course.code } });
    
    if (existingCourse) {
      console.log(`Course ${course.code} already exists, skipping creation`);
      createdCourses.push(existingCourse);
    } else {
      const newCourse = await Course.create(course);
      createdCourses.push(newCourse);
    }
  }
  
  return createdCourses;
}

// Create faculty users and assign to courses
async function createFaculty(courses) {
  const facultyData = [
    {
      username: 'faculty1',
      password: 'faculty123',
      email: 'faculty1@trackit.com',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Electrical Engineering',
      position: 'Associate Professor',
      courseIndex: 0 // EE321
    },
    {
      username: 'faculty2',
      password: 'faculty123',
      email: 'faculty2@trackit.com',
      firstName: 'Jane',
      lastName: 'Smith',
      department: 'Computer Science',
      position: 'Assistant Professor',
      courseIndex: 1 // CS253
    }
  ];
  
  const createdFaculty = [];
  
  for (const data of facultyData) {
    // Check if faculty already exists
    let faculty = await User.findOne({ where: { username: data.username } });
    
    if (!faculty) {
      // Create faculty user
      const hashedPassword = bcrypt.hashSync(data.password, 8);
      
      faculty = await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: 'faculty'
      });
      
      // Create faculty profile
      await Faculty.create({
        userId: faculty.id,
        department: data.department,
        position: data.position
      });
    }
    
    // Assign faculty to course
    const course = courses[data.courseIndex];
    // FIX: Pass the faculty object instead of just the ID
    await course.addFaculty(faculty);
    
    createdFaculty.push(faculty);
  }
  
  return createdFaculty;
}

// Create student users and assign to courses
async function createStudents(courses) {
  const studentData = [
    {
      username: 'student1',
      password: 'student123',
      email: 'student1@trackit.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      rollNumber: 'EE19B001',
      enrollmentYear: 2019,
      major: 'Electrical Engineering',
      courseIndices: [0] // Only EE321
    },
    {
      username: 'student2',
      password: 'student123',
      email: 'student2@trackit.com',
      firstName: 'Bob',
      lastName: 'Williams',
      rollNumber: 'CS20B002',
      enrollmentYear: 2020,
      major: 'Computer Science',
      courseIndices: [1] // Only CS253
    },
    {
      username: 'student3',
      password: 'student123',
      email: 'student3@trackit.com',
      firstName: 'Charlie',
      lastName: 'Brown',
      rollNumber: 'EE21B003',
      enrollmentYear: 2021,
      major: 'Electrical Engineering',
      courseIndices: [0, 1] // Both courses
    },
    {
      username: 'student4',
      password: 'student123',
      email: 'student4@trackit.com',
      firstName: 'Diana',
      lastName: 'Miller',
      rollNumber: 'CS19B004',
      enrollmentYear: 2019,
      major: 'Computer Science',
      courseIndices: [0, 1] // Both courses
    },
    {
      username: 'student5',
      password: 'student123',
      email: 'student5@trackit.com',
      firstName: 'Ethan',
      lastName: 'Davis',
      rollNumber: 'EE20B005',
      enrollmentYear: 2020,
      major: 'Electrical Engineering',
      courseIndices: [0, 1] // Both courses
    }
  ];
  
  const createdStudents = [];
  
  for (const data of studentData) {
    // Check if student already exists
    let student = await User.findOne({ where: { username: data.username } });
    
    if (!student) {
      // Create student user
      const hashedPassword = bcrypt.hashSync(data.password, 8);
      
      student = await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: 'student'
      });
      
      // Create student profile
      await Student.create({
        userId: student.id,
        rollNumber: data.rollNumber,
        enrollmentYear: data.enrollmentYear,
        major: data.major
      });
    }
    
    // Assign student to courses
    for (const index of data.courseIndices) {
      // FIX: Pass the student object instead of just the ID
      await courses[index].addStudent(student);
    }
    
    createdStudents.push(student);
  }
  
  return createdStudents;
}

// Create announcements for each course
async function createAnnouncements(courses, facultyUsers) {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const faculty = facultyUsers[i];
    
    // Create 4 announcements for this course
    for (let j = 1; j <= 4; j++) {
      await Announcement.create({
        courseId: course.id,
        facultyId: faculty.id,
        announcementHeading: `Announcement ${j} for ${course.code}`,
        announcementBody: `This is the ${j}${getSuffix(j)} announcement for the course ${course.code}. ${getRandomAnnouncementContent()}`
      });
    }
  }
}

// Create course description entries for each course
async function createCourseDescriptionEntries(courses, facultyUsers) {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const faculty = facultyUsers[i];
    
    // Create 4 description entries for this course
    for (let j = 1; j <= 4; j++) {
      await CourseDescriptionEntry.create({
        courseId: course.id,
        facultyId: faculty.id,
        courseDescriptionEntryHeading: `Topic ${j} for ${course.code}`,
        courseDescriptionEntryBody: `This is the ${j}${getSuffix(j)} topic description for the course ${course.code}. ${getRandomDescriptionContent()}`
      });
    }
  }
}

// Print login details for all users
function printUserLoginInfo(users) {
  console.log('\n====== USER LOGIN INFORMATION ======');
  users.forEach(user => {
    console.log(`\nUser: ${user.firstName} ${user.lastName} (${user.userType})`);
    console.log(`Username: ${user.username}`);
    console.log(`Password: ${user.username === 'admin' ? 'admin123' : user.username.includes('faculty') ? 'faculty123' : 'student123'}`);
  });
}

// Print faculty and students for each course
async function printCourseEnrollments(courses) {
  console.log('\n====== COURSE ENROLLMENTS ======');
  
  for (const course of courses) {
    // Fetch course with related faculty and students
    const courseWithEnrollments = await Course.findByPk(course.id, {
      include: [
        { 
          model: Faculty, 
          as: 'faculty',
          include: [{
            model: User,
            attributes: ['firstName', 'lastName', 'username']
          }]
        },
        { 
          model: Student, 
          as: 'students',
          include: [{
            model: User,
            attributes: ['firstName', 'lastName', 'username']
          }]
        }
      ]
    });
    
    console.log(`\nCourse: ${course.code} - ${course.name}`);
    
    // Print faculty
    console.log('\nFaculty:');
    if (courseWithEnrollments.faculty && courseWithEnrollments.faculty.length > 0) {
      courseWithEnrollments.faculty.forEach(faculty => {
        // FIX: Add null check before accessing user properties
        if (faculty.user) {
          console.log(`- ${faculty.user.firstName} ${faculty.user.lastName} (${faculty.user.username})`);
        }
      });
    } else {
      console.log('No faculty assigned');
    }
    
    // Print students
    console.log('\nStudents:');
    if (courseWithEnrollments.students && courseWithEnrollments.students.length > 0) {
      courseWithEnrollments.students.forEach(student => {
        // FIX: Add null check before accessing user properties
        if (student.user) {
          console.log(`- ${student.user.firstName} ${student.user.lastName} (${student.user.username})`);
        }
      });
    } else {
      console.log('No students enrolled');
    }
  }
}

// Helper function to get ordinal suffix
function getSuffix(num) {
  if (num === 1) return 'st';
  if (num === 2) return 'nd';
  if (num === 3) return 'rd';
  return 'th';
}

// Helper function to get random content for announcements
function getRandomAnnouncementContent() {
  const contents = [
    "Please make sure to submit your assignments by the due date.",
    "The upcoming lecture will cover important topics for the mid-term exam.",
    "Office hours have been changed for next week. Check the course portal for details.",
    "The tutorial session has been rescheduled due to a faculty meeting.",
    "Some additional reading materials have been uploaded to the course resources."
  ];
  return contents[Math.floor(Math.random() * contents.length)];
}

// Helper function to get random content for course descriptions
function getRandomDescriptionContent() {
  const contents = [
    "This topic covers fundamental concepts that form the basis for advanced study.",
    "Students will learn practical applications through hands-on exercises and projects.",
    "The material includes detailed explanations of theoretical principles and real-world examples.",
    "This section introduces critical thinking approaches to problem-solving in the field.",
    "By the end of this module, students will be able to apply these concepts independently."
  ];
  return contents[Math.floor(Math.random() * contents.length)];
}
