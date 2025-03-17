import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaTimes } from "react-icons/fa";

const ManageUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      UserName: "asharique22",
      FirstName: "Sharique",
      LastName: "Ahmad",
      Courses: ["EE370"],
      Email: "asharique@everyone.com",
      Enrollment_Year: 2022,
      Major: "Electrical Engineering",
      Role: "Student",
    },
    {
      UserName: "gaditiya22",
      FirstName: "Aditya",
      LastName: "Gautam",
      Courses: ["CS101", "CS102"],
      Email: "gaditiya@everyone.com",
      Enrollment_Year: 2022,
      Major: "Computer Science",
      Role: "Student",
    },
    {
      UserName: "pved22",
      FirstName: "Ved Prakash",
      LastName: "Vishwakarma",
      Courses: ["CS101", "CS102", "CS103"],
      Email: "abc@everyone.com",
      Enrollment_Year: 2022,
      Major: "BSBE",
      Role: "Faculty",
    },
    {
      UserName: "vdhruv22",
      FirstName: "Dhruv",
      LastName: "Varshney",
      Courses: ["CS101", "CS102", "CS103"],
      Email: "vdhruv@everyone.com",
      Enrollment_Year: 2022,
      Major: "Computer Science",
      Role: "Faculty",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteUser = (userName) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.UserName !== userName));
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleEditUser = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.UserName === selectedUser.UserName ? selectedUser : user
      )
    );
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) =>
    user.UserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-12">
      <div className="fixed top-0 left-0 right-0 bg-white p-6 shadow-lg z-20 flex justify-between items-center">
        <span
          className="text-4xl font-bold cursor-pointer"
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-4 w-2/3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="rounded-lg">
          {filteredUsers.map((user) => (
            <div
              key={user.UserName}
              className="p-4 rounded-lg mb-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">
                    {user.FirstName} {user.LastName}
                  </p>
                  <p className="text-sm text-gray-700">Role: {user.Role}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.UserName)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
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

            {Object.keys(selectedUser).map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-semibold">{key}</label>
                {key === "Courses" ? (
                  <div className="flex flex-col gap-2">
                    {selectedUser[key].map((course, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={course}
                          onChange={(e) => {
                            const updatedCourses = [...selectedUser[key]];
                            updatedCourses[index] = e.target.value;
                            handleEditUser(key, updatedCourses);
                          }}
                          className="p-2 border border-gray-300 rounded-lg w-full"
                        />
                        <button
                          onClick={() => {
                            const updatedCourses = selectedUser[key].filter((_, i) => i !== index);
                            handleEditUser(key, updatedCourses);
                          }}
                          className="bg-red-500 text-white p-1 rounded-lg"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleEditUser(key, [...selectedUser[key], ""])}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={selectedUser[key]}
                    onChange={(e) => handleEditUser(key, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                )}
              </div>
            ))}

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
