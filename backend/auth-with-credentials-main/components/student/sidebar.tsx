import Link from 'next/link';
import React from 'react';
export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-5 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">TRACKit</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/dashboard">
              <div className="p-3 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                📚 My Courses
              </div>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/performance">
              <div className="p-3 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                📊 Performance
              </div>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/profile">
              <div className="p-3 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                👤 Profile
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
