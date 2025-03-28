import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { GoHome } from "react-icons/go";

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [newCourse, setNewCourse] = useState({
    id: "",
    code: "",
    name: "",
    description: "",
    credits: 0,
    semester: "",
  });

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/courses");
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
    fetchCourses();
  }, []);

  // Edit course handler
  const handleEditCourse = (course) => {
    setEditCourseId(course.id);
    setNewCourse({ ...course });
    setShowModal(true);
  };

  // Delete course handler
  const handleDeleteCourse = async (courseId) => {
    try {
      await axiosInstance.delete(`/api/courses/${courseId}`);
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course: ", error);
    }
  };

  // Save course handler (PUT request)
  const handleSaveCourse = async () => {
    try {
      await axiosInstance.put(`/api/courses/${editCourseId}`, newCourse);
      const updatedCourses = courses.map((course) =>
        course.id === editCourseId ? newCourse : course
      );
      setCourses(updatedCourses);
      handleCancel(); // Close modal and reset form
    } catch (error) {
      console.error("Error updating course: ", error);
    }
  };

  // Cancel and reset form
  const handleCancel = () => {
    setShowModal(false);
    setNewCourse({
      id: "",
      code: "",
      name: "",
      description: "",
      credits: 0,
      semester: "",
    });
  };

  // Filter courses by name or ID
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-12">
      {/* Header Section */}
      <div className="fixed top-0 left-0 right-0 bg-white py-7 px-8 shadow-lg z-10 flex justify-between items-center">
        <div className='flex gap-6'>
          <span
            className="text-4xl font-semibold cursor-pointer"
            onClick={() => navigate("/Admin")}
            >
            TRACKit
          </span>
          <div className='cursor-pointer hover:scale-95 duration-200 transition-all rounded-full hover:bg-gray-100 p-2'>
            <GoHome className='text-[1.9rem]' onClick={()=>{navigate("/Admin")}}></GoHome>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-700">Manage Courses</h1>
      </div>

      {/* Search Input */}
      <div className="mt-24">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search courses by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-4 w-2/3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Course List */}
        <div className="rounded-lg">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-lg mb-4 transition-all duration-200 hover:scale-[101%] hover:shadow-lg bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">{course.name}</p>
                  <p className="text-sm text-gray-700">Course ID: {course.id}</p>
                  <p className="text-sm text-gray-700">Code: {course.code}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-95 hover:shadow-xl"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-95 hover:shadow-xl"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Course Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[32rem] max-h-[80vh] overflow-y-auto transform transition-transform duration-300 scale-95 hover:scale-100">
              <h2 className="text-2xl mb-4">Edit Course</h2>

              {/* Course Form */}
              {["id", "code", "name", "description", "credits", "semester"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block mb-2 capitalize">{field}:</label>
                  {field === "description" ? (
                    <textarea
                      value={newCourse[field]}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, [field]: e.target.value })
                      }
                      className="p-2 w-full border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <input
                      type={field === "credits" ? "number" : "text"}
                      value={newCourse[field]}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, [field]: e.target.value })
                      }
                      className="p-2 w-full border border-gray-300 rounded-lg"
                    />
                  )}
                </div>
              ))}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCourse}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
