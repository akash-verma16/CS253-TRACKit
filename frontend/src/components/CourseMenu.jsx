import React, { useState } from 'react';
import { IoCalendarNumberOutline } from "react-icons/io5";
import { NavLink, useParams } from 'react-router-dom';
import { GoHome } from "react-icons/go";
import { PiGraduationCap } from "react-icons/pi";
import { TfiAnnouncement } from "react-icons/tfi";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdOutlineForum } from "react-icons/md";
import { useCourse } from '../contexts/CourseContext';

export default function CourseMenu() {
  const { courseCode } = useParams();
  const { courseDetails, loading } = useCourse();
  const [activeTab, setActiveTab] = useState('coursehome');

  const tabs = [
    { id: 'coursehome', label: 'Course Home', icon: <GoHome /> , link: `coursehome`},
    { id: 'lectures', label: 'Lectures', icon: <PiGraduationCap />, link: `lectures` },
    { id: 'announcements', label: 'Announcements', icon: <TfiAnnouncement />, link: `announcements` },
    { id: 'calendar', label: 'Calendar', icon: <IoCalendarNumberOutline />, link: `calendar` },
    { id: 'result', label: 'Result', icon: <IoNewspaperOutline />, link: `result` },
    { id: 'forum', label: 'Forum', icon: <MdOutlineForum />, link: `forum` },
  ];

  return (
    <div className='w-full h-screen border-2 rounded-lg flex flex-col items-center justify-start
                px-4 py-5 bg-white shadow-lg'>
      <NavLink to="/dashboard/courses" onClick={() => setActiveTab("courses")}>
        {loading ? (
          <p className='text-[28px] font-semibold'>Loading...</p>
        ) : (
          <p className='text-[28px] font-semibold'>{courseCode||courseDetails?.name}</p>
        )}
      </NavLink>
      <div className='border-t w-11/12 mt-4 py-5'>
        {tabs.map(tab => (
          <NavLink
            to={`/${courseCode}/${tab.link}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={({isActive}) => `flex gap-2 items-center py-2 px-5 my-1 rounded-lg cursor-pointer hover:scale-[97%] duration-200 transition-all ${isActive ? 'bg-black text-white' : 'bg-transparent text-black'}`}
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
