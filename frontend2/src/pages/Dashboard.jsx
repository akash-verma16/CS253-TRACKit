import React from 'react';
import  DashBoardMenu  from '../components/DashBoardMenu';
import Course from './Course';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import Performance from './Performance';
import ContactUs from './ContactUs';

export default function Dashboard() {

  const courses = [
    {code: 'EE320', name: 'Digital Signal Processing', prof:"Abhishek Gupta"},
    {code: 'CS330', name: 'Operating Systems', prof:"Mainak Chaudhuri"},
    {code: 'CS340', name: 'Computer Networks', prof:"Manindra Agrawal"},
    {code: 'CS345', name: 'Database Systems', prof:"Arnab Bhattacharya"},
    {code: 'CS253', name: 'Software Development', prof:"Amey Karkare"},
    {code: 'EE370', name: 'Digital Electronics', prof:"Shubham Sahay"},
  ];

  const pastYears = ["2024-25 SEMII", "2024-25 SEMI", "2024-25 SEMII", "2024-25 SEMI", "2024-25 SEMII", "2024-25 SEMI"];

  return (
    <div className='h-screen w-full flex items-center bg-[#F5F5F5]'>

        <DashBoardMenu />
        <Routes>
            <Route path="/courses" element={<Course></Course>}></Route>
            <Route path="/performance" element={<Performance/>}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
            <Route path="/contactus" element={<ContactUs name="Ved Prakash" email={`vedprakash22@iitk.ac.in`}/>}></Route>
        </Routes>

    </div>
  )
}
