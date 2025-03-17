import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    { Course_Id: "CS101", name: "Data Structures", Instructor: ["Dr. Smith"], Credit: 4 },
    { Course_Id: "CS102", name: "Algorithms", Instructor: ["Dr. Johnson"], Credit: 3 },
    { Course_Id: "CS103", name: "Operating Systems", Instructor: ["Dr. Lee"], Credit: 4 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [newCourse, setNewCourse] = useState({
    Course_Id: "",
    name: "",
    Instructor: [""],
    Credit: 0,
  });

  const handleEditCourse = (course) => {
    setEditCourseId(course.Course_Id);
    setNewCourse({ ...course, Instructor: [...course.Instructor] });
    setShowModal(true);
  };

  const handleRemoveInstructor = (index) => {
    const updatedInstructors = newCourse.Instructor.filter((_, i) => i !== index);
    setNewCourse({ ...newCourse, Instructor: updatedInstructors });
  };

  const handleDeleteCourse = (Course_Id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.Course_Id !== Course_Id));
    }
  };

  const handleSaveCourse = () => {
    if (!newCourse.Course_Id || !newCourse.name || newCourse.Instructor.some((inst) => !inst)) {
      alert("Course ID, Name, and at least one Instructor are required");
      return;
    }

    setCourses(
      courses.map((course) =>
        course.Course_Id === editCourseId ? newCourse : course
      )
    );

    setNewCourse({ Course_Id: "", name: "", Instructor: [""], Credit: 0 });
    setShowModal(false);
  };

  const handleAddInstructor = () => {
    setNewCourse({ ...newCourse, Instructor: [...newCourse.Instructor, ""] });
  };

  const handleInstructorChange = (index, value) => {
    const updatedInstructors = newCourse.Instructor.map((inst, i) =>
      i === index ? value : inst
    );
    setNewCourse({ ...newCourse, Instructor: updatedInstructors });
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewCourse({ Course_Id: "", name: "", Instructor: [""], Credit: 0 });
  };

  const filteredCourses = courses.filter((course) =>
    course.Course_Id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-12">
      <div className="fixed top-0 left-0 right-0 bg-white p-6 shadow-lg z-10 flex justify-between items-center">
        <span
          className="text-4xl font-bold cursor-pointer"
          onClick={() => navigate("/Admin")}
        >
          TRACKit
        </span>
        <h1 className="text-2xl font-semibold text-gray-700">Manage Courses</h1>
      </div>
      <div className="mt-24">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-4 w-2/3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="rounded-lg">
          {filteredCourses.map((course) => (
            <div
              key={course.Course_Id}
              className="p-4 rounded-lg mb-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">{course.name}</p>
                  <p className="text-sm text-gray-700">Course ID: {course.Course_Id}</p>
                  <p className="text-sm text-gray-700">Instructor: {course.Instructor.join(", ")}</p>
                  <p className="text-sm text-gray-500">Credit: {course.Credit}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.Course_Id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20 animate-fade-in">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-transform duration-300 scale-95 hover:scale-100">
              <h2 className="text-2xl mb-4">Edit Course</h2>
              <label className="block mb-2">Course Id:</label>
              <input
                type="text"
                placeholder="Course ID"
                value={newCourse.Course_Id}
                onChange={(e) => setNewCourse({ ...newCourse, Course_Id: e.target.value })}
                className="p-2 mb-4 w-full border border-gray-300 rounded-lg"
              />
              <label className="block mb-2">Course Name:</label>
              <input
                type="text"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="p-2 mb-4 w-full border border-gray-300 rounded-lg"
              />
              <label className="block mb-2">Instructors:</label>
              {newCourse.Instructor.map((inst, index) => (
                <div key={index} className="flex items-center mb-4">
                  <input
                    type="text"
                    placeholder="Instructor Name"
                    value={inst}
                    onChange={(e) => handleInstructorChange(index, e.target.value)}
                    className="p-2 w-full border border-gray-300 rounded-lg"
                  />
                  {newCourse.Instructor.length > 1 && (
                    <button onClick={() => handleRemoveInstructor(index)} className="ml-2 text-red-500">
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={handleAddInstructor} className="mb-4 text-blue-500">+ Add Instructor</button>
              <label className="block mb-2">Credits:</label>
              <input
                type="number"
                placeholder="Credits"
                value={newCourse.Credit}
                onChange={(e) => setNewCourse({ ...newCourse, Credit: e.target.value })}
                className="p-2 mb-4 w-full border border-gray-300 rounded-lg"
              />
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
}
export default ManageCourses;