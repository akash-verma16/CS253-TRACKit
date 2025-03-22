import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

const ManageUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/users");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    };
    fetchUsers();

    const fetchCourses = async () => {
      try {
        const Course = await axiosInstance.get("/api/courses");
        setCourses(Course.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to fetch courses.");
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/api/admin/user/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const addstudenttocourse = async (courseId, userId) => {
    try {
      await axiosInstance.post("/api/courses/add-student", { courseId, userId });
      setSelectedUser((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          courses: [...(prev.student?.courses || []), courseId],
        },
      }));
      
      setSelectedCourse("");
    } catch (error) {
      console.error("Error adding student to course:", error);
      alert("Failed to add student to course.");
    }
  };

  const addfacultytocourse = async (courseId, userId) => {
    try {
      await axiosInstance.post("/api/courses/add-faculty", { courseId, userId });

      setSelectedUser((prev) => ({
        ...prev,
        faculty: {
          ...prev.faculty,
          courses: [...(prev.faculty?.courses || []), courseId],
        },
      }));

      setSelectedCourse("");
    } catch (error) {
      console.error("Error adding faculty to course:", error);
      alert("Failed to add faculty to course.");
    }
  };

  const removefacultyfromcourse = async (courseId, userId) => {
    try {
      await axiosInstance.delete(
        `/api/courses/remove-faculty/${courseId}/${userId}`
      );
      setSelectedUser((prev) => ({
        ...prev,
        faculty: {
          ...prev.faculty,
          courses: prev.faculty?.courses.filter((id) => id !== courseId),
        },
      }));

      setSelectedCourse("");
    } catch (error) {
      console.error("Error removing faculty from course:", error);
      alert("Failed to remove faculty from course.");
    }
  };

  const removestudentfromcourse = async (courseId, userId) => {
    try {
      await axiosInstance.delete(
        `/api/courses/remove-student/${courseId}/${userId}`
      );
      setSelectedUser((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          courses: prev.student?.courses.filter((id) => id !== courseId),
        },
      }));

      setSelectedCourse("");
    } catch (error) {
      console.error("Error removing student from course:", error);
      alert("Failed to remove student from course.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axiosInstance.put(`/api/admin/user/${selectedUser.id}`, selectedUser);
      alert("User details updated successfully.");

      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update user details.");
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.id && user.id.toString().includes(searchTerm))
  );
  

  const labelMapping = {
    id: "ID",
    username: "Username",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    userType: "Role",
    rollNumber: "Roll No",
    major: "Major",
    enrollmentYear: "Enrollment Year",
  };

  return (
    <div className="p-12">
      <div className="fixed top-0 left-0 right-0 bg-white p-8 shadow-lg z-20 flex justify-between items-center">
        <span
          className="text-4xl font-semibold cursor-pointer"
          onClick={() => navigate("/Admin")}
        >
          TRACKit
        </span>
        <h1 className="text-2xl font-semibold text-gray-700">Manage Users</h1>
      </div>

      <div className="mt-24">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search users by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-4 w-2/3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="rounded-lg">
          {filteredUsers.map((user) => (
            <div
              key={user.username}
              className="p-4 rounded-lg mb-4 transition-all duration-300 hover:scale-[101%] hover:shadow-lg bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-700">Role: {user.userType}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-95 hover:shadow-xl"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-95 hover:shadow-xl"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/3 max-h-[80vh] overflow-y-auto mt-16">
            <h2 className="text-2xl mb-4">Edit User Details</h2>

            {Object.keys(selectedUser)
              .filter(
                (key) =>
                  !["student", "faculty", "createdAt", "updatedAt"].includes(
                    key
                  )
              )
              .map((key) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    {labelMapping[key] || key}
                  </label>
                  <input
                    type="text"
                    value={selectedUser[key]}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}

            {selectedUser.userType === "faculty" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Department
                  </label>
                  <input
                    type="text"
                    value={selectedUser.faculty?.department || ""}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        faculty: {
                          ...prev.faculty,
                          department: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Position
                  </label>
                  <input
                    type="text"
                    value={selectedUser.faculty?.position || ""}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        faculty: { ...prev.faculty, position: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Teaching Courses
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.id} - {course.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => {
                        addfacultytocourse(selectedCourse, selectedUser.id);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Course
                    </button>

                    <button
                      onClick={() => {
                        removefacultyfromcourse(
                          selectedCourse,
                          selectedUser.id
                        );
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Remove from Course
                    </button>
                  </div>
                </div>
              </>
            )}

            {selectedUser.userType === "student" && (
              <>
                {["rollNumber", "major", "enrollmentYear"].map((field) => (
                  <div key={field} className="mb-4">
                    <label className="block text-gray-700 font-semibold">
                      {labelMapping[field]}
                    </label>
                    <input
                      type="text"
                      value={selectedUser.student?.[field] || ""}
                      onChange={(e) =>
                        setSelectedUser((prev) => ({
                          ...prev,
                          student: { ...prev.student, [field]: e.target.value },
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Enrolled Courses
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.id} - {course.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => {
                        addstudenttocourse(selectedCourse, selectedUser.id);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Course
                    </button>

                    <button
                      onClick={() => {
                        removestudentfromcourse(
                          selectedCourse,
                          selectedUser.id
                        );
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Remove from Course
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleSaveChanges}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;