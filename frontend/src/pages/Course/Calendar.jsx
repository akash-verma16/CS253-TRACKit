import React from 'react'
import { CgProfile } from "react-icons/cg";
import { useCourse } from '../../contexts/CourseContext';

export default function Calendar() {
  const {courseDetails} = useCourse();
  return (
    <div className='w-full h-screen'>
        <div className='flex justify-between py-2 px-8 items-center shadow-md mb-6 relative'>
          <div>
            <p className='text-[32px] uppercase font-semibold m-4'>Calender</p>
            <p className='text-gray-600 ml-4 -mt-3'>{courseDetails.code} • {courseDetails.credits} Credits • {courseDetails.semester}</p>
          </div>
            <CgProfile className='text-[40px] cursor-pointer'></CgProfile>
        </div>
      <iframe src="https://calendar.google.com/calendar/embed?height=550&wkst=1&ctz=Asia%2FKolkata&mode=WEEK&showTz=0&showTitle=0&showPrint=0&src=dmVkdmlzaHdha2FybWEyMjZAZ21haWwuY29t&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%230B8043" className='w-[92%] m-auto h-[650px] border rounded-lg shadow-xl'></iframe>
    </div>
  )
}
