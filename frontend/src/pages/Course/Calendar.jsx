import React from 'react';
import { CgProfile } from "react-icons/cg";
import { useCourse } from '../../contexts/CourseContext';
import MyCalendar from '../../components/Calendar_Course';

export default function Calendar() {
  const { courseDetails } = useCourse();
  return (
    <div className='w-full h-screen'>
      <div className='flex justify-between py-2 px-8 items-center shadow-md mb-6 relative'>
        <div>
          <p className='text-[32px] uppercase font-semibold m-4'>Calendar</p>
          <p className='text-gray-600 ml-4 -mt-3'>{courseDetails.code} • {courseDetails.credits} Credits • {courseDetails.semester}</p>
        </div>
        <CgProfile className='text-[40px] cursor-pointer'></CgProfile>
      </div>
      <MyCalendar />
    </div>
  );
}