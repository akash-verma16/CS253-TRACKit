import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";

export default function CreateCourse() {
  const [activeTab, setActiveTab] = useState('manual');
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 9,
    semester: ''
  });
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    // Log form data for development purposes
    console.log('Course Data:', courseData);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    // Log CSV file for development purposes
    console.log('CSV File:', csvFile);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white p-8 shadow-lg z-10 flex justify-between items-center">
        <span
          className="text-4xl font-semibold cursor-pointer"
          onClick={() => navigate("/Admin")}
        >
          TRACKit
        </span>
        <h1 className="text-2xl font-semibold text-gray-700">Create Course</h1>
      </div>
      
      {/* Main Content */}
      <div className="pt-24 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Course</h2>
          
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
                <label className="block text-gray-700 text-sm font-bold mb-2">Course Code:</label>
                <input
                  type="text"
                  name="code"
                  value={courseData.code}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Course Name:</label>
                <input
                  type="text"
                  name="name"
                  value={courseData.name}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Credits:</label>
                <input
                  type="number"
                  name="credits"
                  value={courseData.credits}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Semester:</label>
                <select
                  name="semester"
                  value={courseData.semester}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Semester</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                hover:scale-95 transition-all duration-200"
              >
                Create Course
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
                  CSV file should contain columns: code, name, description, credits, semester
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                hover:scale-95 transition-all duration-200"
              >
                Upload and Create Courses
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
