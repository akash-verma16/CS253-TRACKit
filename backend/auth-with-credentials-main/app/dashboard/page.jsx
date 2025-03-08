import Sidebar from "@/components/student/sidebar";
import CourseCard from "@/components/student/CourseCard";
import CalendarView from "@/components/student/CalendarView";
import ProfileMenu from "@/components/student/ProfileMenu";

export default function Dashboard() {
  const courses = [
    { code: "EE320", name: "Communication", instructor: "Dr. Abhishek" },
    { code: "EE370", name: "Digital Electronics", instructor: "Dr. Sahay" },
    { code: "CS253", name: "Software Development", instructor: "Dr. Indranil" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <ProfileMenu />
        </div>

        {/* Courses */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>

        {/* Calendar View */}
        <div className="mt-6">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
