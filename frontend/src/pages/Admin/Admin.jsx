import React from 'react';
import { CgProfile } from "react-icons/cg";
import student from '../../assets/student.png';
import faculty from '../../assets/faculty.png';
import addCourse from "../../assets/addCourse.png";
import cntDev from "../../assets/ContactDeveloper.png";
import manageUser from "../../assets/manageUsers.png";
import manageCourse from "../../assets/manageCourse.png";
import { useAuth } from '../../contexts/AuthContext';
import LogoutButton from '../../components/LogoutButton';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Define all admin options in a single array
  const adminOptions = [
    {
      id: 1,
      title: "Add Student",
      image: student,
      path: '/admin/add-student'
    },
    {
      id: 2,
      title: "Add Faculty",
      image: faculty,
      path: '/admin/add-faculty' 
    },
    {
      id: 3,
      title: "Create Courses",
      image: addCourse,
      path: '/admin/create-course'
    },
    {
      id: 4,
      title: "Manage Courses",
      image: manageCourse,
      path: '/admin/manage-courses'
    },
    {
      id: 5,
      title: "Manage Users",
      image: manageUser,
      path: '/admin/manage-users'
    },
    {
      id: 6,
      title: "Contact Developers",
      image: cntDev,
      path: '/admin/contact-developers'
    }
  ];

  // Generic handler for navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className='bg-[#F5F5F5] h-screen w-full'>
      <nav className='flex justify-between p-5 shadow-md'>
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
          {adminOptions.map((option) => (
            <div key={option.id} className='m-auto my-8'>
              <img src={option.image} alt={option.title} className="cursor-pointer" />
              <p 
                className='bg-[#D9D9D9] w-11/12 m-auto text-center py-[12px] font-semibold mt-2 rounded-md hover:bg-[#3B82F6] hover:text-white transition-all duration-200 cursor-pointer hover:scale-95'
                onClick={() => handleNavigation(option.path)}
              >
                {option.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}