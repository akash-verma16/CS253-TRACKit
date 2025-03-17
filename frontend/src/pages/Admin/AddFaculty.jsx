import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";

export default function AddFaculty() {
  const [activeTab, setActiveTab] = useState('manual');
  const [facultyData, setFacultyData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    position: '',
    userType: 'faculty'
  });
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFacultyData({
      ...facultyData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    // Log form data for development purposes
    console.log('Faculty Data:', facultyData);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    // Log CSV file for development purposes
    console.log('CSV File:', csvFile);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white p-6 shadow-lg z-10 flex justify-between items-center">
        <span
          className="text-4xl font-semibold cursor-pointer"
          onClick={() => navigate("/Admin")}
        >
          TRACKit
        </span>
        <h1 className="text-2xl font-semibold text-gray-700">Add Faculty</h1>
      </div>
      
      {/* Main Content */}
      <div className="pt-24 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Add Faculty</h2>
          
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 ${activeTab === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('manual')}
            >
              Manual Entry
            </button>
            <button
              className={`flex-1 py-2 ${activeTab === 'bulk' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('bulk')}
            >
              Bulk Upload
            </button>
          </div>

          {activeTab === 'manual' ? (
            <form onSubmit={handleManualSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={facultyData.username}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={facultyData.firstName}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={facultyData.lastName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={facultyData.email}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
                <input
                  type="text"
                  name="department"
                  value={facultyData.department}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Position:</label>
                <input
                  type="text"
                  name="position"
                  value={facultyData.position}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={facultyData.password}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Faculty
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Upload CSV File:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-sm text-gray-500 mt-2">
                  CSV file should contain columns: username, firstName, lastName, email, department, position, password
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Upload and Add Faculty
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}