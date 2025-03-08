import React, { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { PiGraduationCap } from "react-icons/pi";
import { GrDocumentPerformance } from "react-icons/gr";
import { RiCustomerService2Line } from "react-icons/ri";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('courses');

  const tabs = [
    { id: 'courses', label: 'My Courses', icon: <PiGraduationCap /> },
    { id: 'performance', label: 'Performance', icon: <GrDocumentPerformance /> },
    { id: 'profile', label: 'Profile', icon: <FaRegUser /> },
    { id: 'contact', label: 'Contact Us', icon: <RiCustomerService2Line /> },
  ];

  return (
    <div className='h-screen w-full flex items-center bg-[#F5F5F5]'>

      <div className='w-[22%] h-[98%] border-2 rounded-lg flex flex-col items-center justify-start
                px-4 py-5 ml-2 bg-white shadow-lg'>
        <p className='text-[28px] font-semibold'>TRACKit</p>
        <div className='border-t w-11/12 mt-4 py-5'>
          {tabs.map(tab => (
              <p 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex gap-2 items-center py-2 px-5 my-1 transition-all duration-200 rounded-lg cursor-pointer 
                  hover:bg-black hover:text-white ${activeTab === tab.id ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              >
                {tab.icon}
                {tab.label}
              </p>
          ))}
        </div>
      </div>

      <div>
        <p>Dashboard</p>
        
      </div>

    </div>
  )
}
