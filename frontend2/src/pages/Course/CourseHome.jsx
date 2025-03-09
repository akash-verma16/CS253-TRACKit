import React, { useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import data from './data.js'
import { IoIosArrowDropdown } from "react-icons/io";

export default function CourseHome({ present, total }) {
  const [expandedIndices, setExpandedIndices] = useState({});

  const toggleExpand = (index) => {
    setExpandedIndices(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className='w-full h-full ml-4'>
      <div className='flex justify-between p-3 px-8 items-center sticky top-0 bg-[#F5F5F5]'>
          <p className='text-[32px] uppercase font-semibold m-4'>Course Home</p>
          <CgProfile className='text-[40px] cursor-pointer' />
      </div>

      <div className='flex justify-evenly items-center'>
        <div>
          <p className='font-semibold text-[19px] mb-2'>New Events</p>
          <iframe 
            src="https://calendar.google.com/calendar/embed?height=400&wkst=1&ctz=Asia%2FKolkata&showPrint=0&mode=AGENDA&showNav=0&showDate=0&showCalendars=0&showTz=0&showTitle=0&src=dmVkdmlzaHdha2FybWEyMjZAZ21haWwuY29t&src=OWYxMWIzMDdjZTFjZTU1OWY3NDUyZTQ3ZWJhNmNkN2JkYjY4ODk1ZjI4MmRkODY0MjIxZjQ4NWM4MzVlNGE4MEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%23E67C73&color=%230B8043" 
            width="700" 
            height="400" 
            className='shadow-xl border rounded-lg'
          ></iframe>
        </div>
        <div className='border px-6 h-[300px] w-[20%] rounded-lg shadow-lg py-8'>
          <p className='font-semibold text-[22px]'>Your Attendence</p>
          <div>
            <p className='text-[45px]'>{(present/total*100).toFixed(0)}%</p>
            <p className='text-[20px]'>You have attended: <br /> {present}/{total} classes</p>
          </div>
        </div>
      </div>

      <div className='p-4'>
        {data.map((item, index) => (
          <div key={index} className='mb-2'>
            <div 
              className='w-full py-2 border-2 flex flex-col  m-2 px-6 rounded-xl cursor-pointer'
              onClick={() => toggleExpand(index)}
            >
              <div className='flex justify-between w-full font-semibold'>
                {item.title}
                <IoIosArrowDropdown 
                  className={`text-[25px] transform transition-transform duration-500 ${expandedIndices[index] ? 'rotate-180' : ''}`}
                />
              </div>
            <div 
              className={`overflow-hidden transition-all duration-300  ${expandedIndices[index] ? 'max-h-40 opacity-100 py-3' : 'max-h-0 opacity-0'}`}
            >
              {item.description}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
