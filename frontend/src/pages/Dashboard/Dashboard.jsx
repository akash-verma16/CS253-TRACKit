import React from 'react';
import  DashBoardMenu  from '../../components/DashBoardMenu';
import Course from './Course';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import Performance from './Performance';
import ContactUs from './ContactUs';

export default function Dashboard(props) {
  return (
    <div className='h-screen w-full flex items-center bg-[#F5F5F5] overflow-scroll'>

        <div className="fixed h-[98%] w-[19%] ml-1 z-10 my-1">
        <DashBoardMenu />
        </div >
        <div className='ml-[20%] w-full z-0 h-full'>
          <Routes>
              <Route path="/courses" element={<Course course={props.course}></Course>}></Route>
              <Route path="/performance" element={<Performance/>}></Route>
              <Route path="/profile" element={<Profile/>}></Route>
              <Route path="/contactus" element={<ContactUs/>}></Route>
          </Routes>
        </div>

    </div>
  )
}
