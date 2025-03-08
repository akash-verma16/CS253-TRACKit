import React from "react";
export default function CourseCard({ code, name, instructor }) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg text-center">
        <h3 className="text-lg font-bold">{code}</h3>
        <p className="text-sm text-gray-600">{instructor}</p>
        <p className="text-xs text-gray-500">{name}</p>
      </div>
    );
  }
  