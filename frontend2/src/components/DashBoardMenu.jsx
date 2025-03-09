import React from 'react'
import { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { PiGraduationCap } from "react-icons/pi";
import { GrDocumentPerformance } from "react-icons/gr";
import { RiCustomerService2Line } from "react-icons/ri";
import { NavLink } from 'react-router-dom';

export default function DashBoardMenu() {

    const [activeTab, setActiveTab] = useState('courses');
    
    const tabs = [
      { id: 'courses', label: 'My Courses', icon: <PiGraduationCap /> , link:"/dashboard/courses"},
      { id: 'performance', label: 'Performance', icon: <GrDocumentPerformance />, link:"/dashboard/performance" },
      { id: 'profile', label: 'Profile', icon: <FaRegUser />, link:"/dashboard/profile" },
      { id: 'contact', label: 'Contact Us', icon: <RiCustomerService2Line />, link:"/dashboard/contactus" },
    ];

  return (
    <div className='w-[22%] h-[98%] border-2 rounded-lg flex flex-col items-center justify-start
                px-4 py-5 ml-2 bg-white shadow-lg'>
        <p className='text-[28px] font-semibold'>TRACKit</p>
        <div className='border-t w-11/12 mt-4 py-5'>
          {tabs.map(tab => (
              <NavLink to={tab.link} 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex gap-2 items-center py-2 px-5 my-1 rounded-lg cursor-pointer hover:scale-[97%] duration-200 transition-all
                 ${activeTab === tab.id ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              >
                {tab.icon}
                {tab.label}
              </NavLink>
          ))}
        </div>
      </div>
  )
}
