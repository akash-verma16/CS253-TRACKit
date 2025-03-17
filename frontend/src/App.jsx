import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Courses from "./pages/Course/Courses";
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import AddStudent from "./pages/Admin/AddStudent";
import AddFaculty from "./pages/Admin/AddFaculty";
import CreateCourse from "./pages/Admin/createCourse";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageCourses from "./pages/Admin/ManageCourses";
import ContactDevelopers from "./pages/Admin/ContactDevelopers";

// Wrapper component to handle course params
const CourseWrapper = () => {
  const { courseCode } = useParams();
  const { currentUser } = useAuth();
  
  console.log("CourseWrapper rendering with:", { courseCode, userType: currentUser?.userType });
  
  if (!courseCode) {
    return <div>No course code provided</div>;
  }
  
  return <Courses courseCode={courseCode} role={currentUser?.userType} />;
};

const AppRoutes = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }
  
  const handleDefaultRoute = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    
    if (currentUser.userType === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard/courses" replace />;
    }
  };
  
  return (
    <Routes>
      <Route path="/" element={handleDefaultRoute()} />
      
      <Route 
        path="/login" 
        element={currentUser ? handleDefaultRoute() : <Login />} 
      />
      
      {/* Admin routes */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/add-student" element={<AddStudent />} />
        <Route path="/admin/add-faculty" element={<AddFaculty />} />
        <Route path="/admin/create-course" element={<CreateCourse />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-courses" element={<ManageCourses />} />
        <Route path="/admin/contact-developers" element={<ContactDevelopers />} />
      </Route>
      
      {/* Dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      
      {/* Course routes - use direct path with param */}
      <Route element={<ProtectedRoute />}>
        <Route path="/:courseCode/*" element={<CourseWrapper />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CourseProvider>
          <AppRoutes />
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
