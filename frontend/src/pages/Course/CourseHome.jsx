import React, { useState, useEffect } from 'react'
import { CgProfile } from 'react-icons/cg'
import { IoIosArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { NavLink } from 'react-router-dom';
import { useCourse } from '../../contexts/CourseContext';
import axios from 'axios';

export default function CourseHome({ present, total, role }) {
  const { courseDetails, loading, error } = useCourse();
  const [expandedIndices, setExpandedIndices] = useState({});
  const [courseSections, setCourseSections] = useState([
    {
        "title": "No class this monday",
        "description": "Due to some technical issues, the class scheduled for this Monday has been postponed to next week."
    },
    {
        "title": "seating arrangement for the major quiz-2",
        "description": "The seating arrangement for the major quiz-2 has been uploaded on the website. Please check your roll number and seat number."
    },
    {
        "title": "Syllabus for the major quiz-2",
        "description": "The syllabus for the major quiz-2 has been uploaded on the website. Please check the syllabus and prepare accordingly."
    },
    {
        "title": "Assignment 2 submission date extended",
        "description": "The submission date for assignment 2 has been extended to 15th October. Please submit your assignments before the deadline."
    },
    {
        "title": "Major quiz-1 marks released",
        "description": "JSON consists of key-value pairs, arrays, and nested objects, making it flexible for different data representations."
    },
    {
        "title": "Assignment 2 uploaded",
        "description": "Assignment 2 has been uploaded on the website. Please download the assignment and submit it before the deadline."
    },
    {
        "title": "Changes in the class discussion hours",
        "description": "The class discussion hours have been changed to 4-5 PM. Please note the changes and attend the class accordingly"
    },
    {
        "title": "Project submission date extended",
        "description": "The submission date for the project has been extended to 20th October. Please submit your projects before the deadline."
    }
]);
  
  // Debug logs
  useEffect(() => {
    console.log("CourseHome rendering with:", { 
      courseDetails, 
      loading, 
      error,
      role,
      present,
      total
    });
  }, [courseDetails, loading, error, role, present, total]);
  
  const toggleExpand = (index) => {
    setExpandedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  function addSectionHandler() {
    console.log("Add section");
  }
  
  function editHandler() {
    console.log("Edit section");
  }
  
  function deleteHandler() {
    console.log("Delete section");
  }
  
  if (loading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className="animate-pulse text-xl">Loading course details...</div>
      </div>
    );
  }
  
  if (error) {
    // Extract course code from URL in case of API error
    const urlParts = window.location.pathname.split('/');
    const courseCodeFromUrl = urlParts[1]; // Get the course code from URL
    
    return (
      <div className='w-full p-6'>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading course details: {error}</p>
          <p className="mt-2 text-sm">
            Try navigating back to the <NavLink to="/dashboard/courses" className="underline font-medium">dashboard</NavLink> and selecting the course again.
          </p>
        </div>
        
        {courseCodeFromUrl && (
          <div className="bg-white shadow-md rounded p-6 mt-4">
            <h2 className="text-2xl font-bold uppercase mb-2">Course: {courseCodeFromUrl}</h2>
            <p className="text-gray-500 mb-4">Limited view due to data loading error</p>
            
            <div className="mt-4">
              <p className="font-medium">Available actions:</p>
              <ul className="list-disc pl-5 mt-2">
                <li className="mb-1">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-blue-500 underline"
                  >
                    Retry loading course
                  </button>
                </li>
                <li>
                  <NavLink to="/dashboard/courses" className="text-blue-500 underline">
                    Return to courses dashboard
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (!courseDetails) {
    return (
      <div className='w-full p-4'>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No course details available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className='w-full h-full'>
      <div className='flex justify-between py-2 px-8 items-center sticky top-0 bg-[#F5F5F5] shadow-lg'>
        <div>
          <p className='text-[32px] uppercase font-semibold m-4'>{courseDetails.name}</p>
          <p className='text-gray-600 ml-4 -mt-3'>{courseDetails.code} • {courseDetails.credits} Credits • {courseDetails.semester} • {JSON.parse(localStorage.getItem('user')).userType}</p>
        </div>
        <NavLink to="/dashboard/profile">
          <CgProfile className='text-[40px] cursor-pointer hover:scale-95 duration-200 transition-all hover:text-blue-500' />
        </NavLink>
      </div>

      <div className='flex justify-evenly items-center'>
        <div>
          <p className='font-semibold text-[19px] mb-2 mt-4'>New Events</p>
          <iframe 
            src="https://calendar.google.com/calendar/embed?height=400&wkst=1&ctz=Asia%2FKolkata&showPrint=0&mode=AGENDA&showNav=0&showDate=0&showCalendars=0&showTz=0&showTitle=0&src=dmVkdmlzaHdha2FybWEyMjZAZ21haWwuY29t&src=OWYxMWIzMDdjZTFjZTU1OWY3NDUyZTQ3ZWJhNmNkN2JkYjY4ODk1ZjI4MmRkODY0MjIxZjQ4NWM4MzVlNGE4MEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%23E67C73&color=%230B8043" 
            width={`${role=="student" ? 700 : 850}`} 
            height="400" 
            className='shadow-xl border rounded-lg'
          ></iframe>
        </div>

      {
        role=="student" &&
        <div className='border px-6 h-[300px] w-[20%] rounded-lg shadow-lg py-8'>
          <p className='font-semibold text-[22px]'>Your Attendance</p>
          <div>
            <p className='text-[45px]'>{(present/total*100).toFixed(0)}%</p>
            <p className='text-[20px]'>You have attended: <br /> {present}/{total} classes</p>
          </div>
        </div>
      }
      {
        role!="student" &&
        <button 
          onClick={addSectionHandler}
          className='bg-blue-500 shadow-xl text-white py-2 px-4 mt-4 ml-6 flex justify-center items-center gap-2 hover:bg-green-600 hover:scale-95 transition-all duration-200 rounded'
        >
          <FaPlus className='text-[18px]'></FaPlus>
          <p>Add Section</p>
        </button>
      }
      </div>

      <div className='p-4 mb-10'>
        <h2 className="text-xl font-bold ml-2 mb-2">Course Details</h2>
        
        {courseSections.map((item, index) => (
          <div key={index} className='mb-2'>
            <div className='w-full py-3 border-2 flex flex-col m-2 px-6 rounded-xl cursor-pointer'>
              <div className='flex justify-between w-full font-semibold'>
                {item.title}
                <div className='flex gap-8 items-center'>
                {
                  role !== "student" && (
                    <div className='flex gap-2 items-center'>
                      <button onClick={() => editHandler(item.id || index)}>
                        <FaRegEdit className='text-[22px] hover:scale-105 transition-all duration-200 hover:shadow-lg'></FaRegEdit>
                      </button>
                      <button onClick={() => deleteHandler(item.id || index)}>
                        <AiOutlineDelete className='text-[22px] text-red-600 hover:scale-105 duration-200 transition-all hover:shadow-lg'></AiOutlineDelete>
                      </button>
                    </div>
                  )
                }
                <IoIosArrowDropdown 
                  onClick={() => toggleExpand(index)}
                  className={`text-[25px] transform transition-transform hover:scale-105 hover:shadow-xl duration-500 ${expandedIndices[index] ? 'rotate-180' : ''}`}
                />
                </div>
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

      {/* <div className="px-6 py-4 bg-gray-50 border-t">
        <h3 className="font-bold mb-2">Course Description</h3>
        <p className="text-gray-700">{courseDetails.description}</p>
      </div> */}
    </div>
  );
}
