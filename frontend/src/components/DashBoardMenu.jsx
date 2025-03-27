import React from 'react'
import { useState, useEffect } from 'react';
import { FaRegUser } from "react-icons/fa";
import { PiGraduationCap } from "react-icons/pi";
import { GrDocumentPerformance } from "react-icons/gr";
import { RiCustomerService2Line } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi"; // Import logout icon
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

export default function DashBoardMenu() {
    const [activeTab, setActiveTab] = useState('courses');
    const { logout } = useAuth(); // Get logout function from auth context
    const navigate = useNavigate();
    const location = useLocation(); // Get current location
    
    const tabs = [
      { id: 'courses', label: 'My Courses', icon: <PiGraduationCap /> , link:"/dashboard/courses"},
      { id: 'performance', label: 'Performance', icon: <GrDocumentPerformance />, link:"/dashboard/performance" },
      { id: 'profile', label: 'Profile', icon: <FaRegUser />, link:"/dashboard/profile" },
      { id: 'contact', label: 'Contact Us', icon: <RiCustomerService2Line />, link:"/dashboard/contactus" },
    ];

    // Update activeTab based on current URL path when component mounts or location changes
    useEffect(() => {
      const currentPath = location.pathname;
      
      // Find which tab corresponds to the current path
      const currentTab = tabs.find(tab => currentPath.includes(tab.id) || 
                                        (tab.id === 'contact' && currentPath.includes('contactus')));
      
      if (currentTab) {
        setActiveTab(currentTab.id);
      }
    }, [location.pathname]);

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

  return (
    <div className='w-[22%] h-[98%] border-2 rounded-lg flex flex-col items-center justify-start
                px-4 py-5 ml-2 bg-white shadow-lg'>
        <NavLink to="/dashboard/courses" onClick={()=> setActiveTab("courses")}><p className='text-[28px] font-semibold'>TRACKit</p></NavLink>
        <div className='border-t w-11/12 mt-4 py-5'>
          {tabs.map(tab => (
              <NavLink to={tab.link} 
                key={tab.id}
                className={({isActive}) => `flex gap-2 items-center py-2 px-5 my-1 rounded-lg cursor-pointer hover:scale-[97%] duration-200 transition-all
                 ${isActive ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              >
                {tab.icon}
                {tab.label}
              </NavLink>
          ))}
        </div>
        
        {/* Spacer to push logout button to bottom */}
        <div className="flex-grow"></div>
        
        {/* Logout button */}
        <div className='w-11/12 mb-5 border-t pt-4'>
          <button 
            onClick={handleLogout}
            className="flex gap-2 items-center py-2 px-5 my-1 rounded-lg cursor-pointer hover:scale-[97%] duration-200 transition-all w-full text-red-600 hover:bg-red-50"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
    </div>
  )
}
