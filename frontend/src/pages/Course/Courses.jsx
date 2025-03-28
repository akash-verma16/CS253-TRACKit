import React, { useEffect } from 'react';
import CourseMenu from '../../components/CourseMenu';
import { Routes, Route, useParams } from 'react-router-dom';
import CourseHome from './CourseHome';
import Lectures from './Lectures';
import Announcements from './Announcements';
import Forum from './Forum';
import Results from './Results';
import Calendar from './Calendar';
import { useCourses } from '../../contexts/CourseContext';
import { SingleCourseProvider } from '../../contexts/CourseContext';

export default function Courses({ role, courseCode }) {
  // Add debugging
  useEffect(() => {
    console.log("Courses component rendering:", { role, courseCode });
  }, [role, courseCode]);
  
  if (!courseCode) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          Error: No course code provided
        </div>
      </div>
    );
  }
  
  return (
    <SingleCourseProvider courseCode={courseCode}>
      <div className='w-full flex bg-[#F5F5F5] h-full'>
        <div className=' fixed h-[98%] w-[19%] ml-1 z-10 mt-2'>
          <CourseMenu courseCode={courseCode} />
        </div>
        <div className='ml-[18%] w-full z-0 pl-1'>
          <Routes>
            <Route path="/" element={<CourseHome present={19} total={20} role={role} />} />
            <Route path="coursehome" element={<CourseHome present={19} total={20} role={role} />} />
            <Route path="lectures" element={<Lectures role={role} />} />
            <Route path="announcements" element={<Announcements role={role} />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="result" element={<Results />} />
            <Route path="forum" element={<Forum role={role} />} />
          </Routes>
        </div>
      </div>
    </SingleCourseProvider>
  );
}
