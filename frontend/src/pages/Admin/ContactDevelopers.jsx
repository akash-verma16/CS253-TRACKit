import { useNavigate } from "react-router-dom";
import profilePic from "../../assets/icon-7797704.png";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";

const developers = [
  {
    id: 1,
    name: "Aditya Gautam",
    role: "UI Designer",
    phone: "+91-98765-4321",
    email: "gaditiya@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 2,
    name: "Sharique Ahmad",
    role: "Backend Developer",
    phone: "+91-98765-4322",
    email: "asharique@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 3,
    name: "Ved Prakash Vishwakarma",
    role: "Full Stack Engineer",
    phone: "+91-98765-4323",
    email: "pved@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 4,
    name: "Dhruv Varshney",
    role: "DevOps Engineer",
    phone: "+91-98765-4324",
    email: "vdhruv@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 5,
    name: "Dhruv Rai",
    role: "DevOps Engineer",
    phone: "+91-98765-4324",
    email: "rdhruv@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 6,
    name: "Mayur",
    role: "DevOps Engineer",
    phone: "+91-98765-4324",
    email: "mayur@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 7,
    name: "Abhijeet Agarwal",
    role: "DevOps Engineer",
    phone: "+91-98765-4324",
    email: "abhijeet@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 8,
    name: "Aaayush Singh",
    role: "DevOps Engineer",
    phone: "+91-98765-4324",
    email: "aayush@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 9,
    name: "Aryan Bansal",
    role: "DevOps Engineer",
    phone: "+91-98765-4324",
    email: "aryan@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
  {
    id: 10,
    name: "Rahul Ahriwar",
    role: "DevOps Engineer",
    phone: "+91-98765-4324",
    email: "rahul@example.com",
    linkedin: "https://www.google.com",
    whatsapp: "https://www.google.com"
  },
];

export default function ContactDevelopers() {
  const navigate = useNavigate();

  const handleContactClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const cardColors = ["bg-blue-100", "bg-blue-100", "bg-blue-100", "bg-blue-100", "bg-blue-100", "bg-blue-100", "bg-blue-100", "bg-blue-100", "bg-blue-100", "bg-blue-100"];

  return (
    <div className="pt-32 min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
      <div className="fixed top-0 left-0 right-0 bg-white p-8 shadow-lg z-10 flex justify-between items-center animate-fade-in">
        <span
          className="text-3xl font-semibold cursor-pointer"
          onClick={() => navigate("/Admin")}
        >
          TRACKit
        </span>
        <h1 className="text-xl font-semibold text-gray-700">Contact Developers</h1>
      </div>

      {developers.map((dev, index) => (
        <div
          key={dev.id}
          className={`flex flex-col items-center p-4 border rounded-xl shadow-md transition-transform transform hover:scale-[102%] hover:shadow-xl ${cardColors[index % cardColors.length]}`}
        >
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-300 mb-4 overflow-hidden">
            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{dev.name}</h2>
          <p className="text-md text-gray-600">{dev.role}</p>
          <div className="mt-3 space-y-1 text-center">
            <p className="text-gray-600">📞 {dev.phone}</p>
            <p className="text-gray-600">✉️ {dev.email}</p>
            <div className="flex justify-center gap-4">
              <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 transition-transform transform hover:scale-125 hover:text-blue-800">
                <FaLinkedin size={24} />
              </a>
              <a href={dev.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-600 transition-transform transform hover:scale-125 hover:text-green-800">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
          <button
            onClick={() => handleContactClick(dev.email)}
            className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-md font-semibold transition-transform transform hover:scale-110 hover:animate-bounce"
          >
            Contact me
          </button>
        </div>
      ))}
    </div>
  );
}
