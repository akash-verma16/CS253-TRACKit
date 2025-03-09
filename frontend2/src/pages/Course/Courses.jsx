import React from 'react'
import CourseMenu from '../../components/CourseMenu'
import { Route, Routes } from 'react-router-dom';
import CourseHome from './CourseHome';
import Lectures from './Lectures';
import Announcements from './Announcements';
import Forum from './Forum';
import Results from './Results';
import Calendar from './Calendar';

export default function Courses({role, course}) {
  return (
    <div className=' w-full flex items-center bg-[#F5F5F5]'>

      <div className='h-screen w-[22%]'>
      <CourseMenu course={course}/>
      </div>

      <Routes>
        {/* In the coursehome based on the role of the user, some components are hidden. */}
        <Route path='/coursehome' element={<CourseHome present={19} total={20} role="studdent"/>} ></Route>
        <Route path='/lectures' element={<Lectures/>} ></Route>
        <Route path='/announcements' element={<Announcements/>} ></Route>
        <Route path='/calendar' element={<Calendar/>} ></Route>
        <Route path='/result' element={<Results/>} ></Route>
        <Route path='/forum' element={<Forum/>} ></Route>
      </Routes>
    </div>
  )
}
