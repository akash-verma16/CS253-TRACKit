import React from 'react'
import CourseMenu from '../../components/CourseMenu'
import { Route, Routes } from 'react-router-dom';
import CourseHome from './CourseHome';
import Lectures from './Lectures';
import Announcements from './Announcements';
import Forum from './Forum';
import Results from './Results';

export default function Courses() {
  return (
    <div className='h-screen w-full flex items-center bg-[#F5F5F5]'>
      <CourseMenu course="CS253" />
      <Routes>
        <Route path='/coursehome' ></Route>
      </Routes>
    </div>
  )
}
