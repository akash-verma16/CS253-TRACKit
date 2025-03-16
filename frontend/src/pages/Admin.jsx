import React from 'react';
import { CgProfile } from "react-icons/cg";
import student from '../assets/student.png';
import faculty from '../assets/faculty.png';
import addCourse from "../assets/addCourse.png";
import cntDev from "../assets/ContactDeveloper.png";
import manageUser from "../assets/manageUsers.png";
import manageCourse from "../assets/manageCourse.png";
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from '../components/LogoutButton';

export default function Admin() {
  const { currentUser } = useAuth();

  return (
    <div className='bg-[#F5F5F5] h-screen w-full'>
      <nav className='flex justify-between p-5'>
        <p className='text-[33px] font-semibold ml-3'>TRACKit</p>
        <p className='text-[33px] font-semibold'>
          Welcome System Admin: {currentUser?.firstName} {currentUser?.lastName}
        </p>
        <div className="flex items-center gap-4">
          <LogoutButton className="mr-4" />
          <CgProfile className='text-[45px] m-2'></CgProfile>
        </div>
      </nav>

      <div className='w-full'>
        <div className='w-10/12 m-auto grid grid-cols-3'>
          <div className='m-auto my-8'>
            <img src={student} alt="" />
            <p className='bg-[#D9D9D9] w-11/12 m-auto text-center py-[12px] font-semibold mt-2 rounded-md hover:scale-95 duration-200 transition-all'>Add Student</p>
          </div>
          <div className='m-auto mb-8'>
            <img src={faculty} alt="" />
            <p className='bg-[#D9D9D9] w-11/12 m-auto text-center py-[12px] font-semibold mt-2 rounded-md hover:scale-95 duration-200 transition-all'>Add Faculty</p>
          </div>
          <div className='m-auto mb-8'>
            <img src={addCourse} alt="" />
            <p className='bg-[#D9D9D9] w-11/12 m-auto text-center py-[12px] font-semibold mt-2 rounded-md hover:scale-95 duration-200 transition-all'>Add Course</p>
          </div>
          <div className='m-auto mb-8'>
            <img src={manageUser} alt="" />
            <p className='bg-[#D9D9D9] w-11/12 m-auto text-center py-[12px] font-semibold mt-2 rounded-md hover:scale-95 duration-200 transition-all'>Manage Users</p>
          </div>
          <div className='m-auto mb-8'>
            <img src={manageCourse} alt="" />
            <p className='bg-[#D9D9D9] w-11/12 m-auto text-center py-[12px] font-semibold mt-2 rounded-md hover:scale-95 duration-200 transition-all'>Manage Courses</p>
          </div>
          <div className='m-auto mb-8'>
            <img src={cntDev} alt="" />
            <p className='bg-[#D9D9D9] w-11/12 m-auto text-center py-[12px] font-semibold mt-2 rounded-md hover:scale-95 duration-200 transition-all'>Contact Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
