import React from 'react';
import  DashBoardMenu  from '../../components/DashBoardMenu';
import Course from './Course';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import Performance from './Performance';
import ContactUs from './ContactUs';

export default function Dashboard(props) {
  return (
    <div className='h-screen w-full flex items-center bg-[#F5F5F5]'>

        <DashBoardMenu />
        <Routes>
            <Route path="/courses" element={<Course course={props.course}></Course>}></Route>
            <Route path="/performance" element={<Performance/>}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
            <Route path="/contactus" element={<ContactUs name="Ved Prakash Vishwakarma" email={`vedprakash22@iitk.ac.in`}/>}></Route>
        </Routes>

    </div>
  )
}
