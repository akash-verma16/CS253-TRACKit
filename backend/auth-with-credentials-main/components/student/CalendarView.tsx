"use client"
import { useState } from "react";
import React from "react";

export default function CalendarView() {
  const [events] = useState([
    { time: "8 AM", title: "EE320 - Lecture" },
    { time: "10 AM", title: "EE390 - Lab" },
    { time: "12 PM", title: "CS637 - Tutorial" },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">📅 Weekly Schedule</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index} className="p-2 bg-gray-100 rounded-md mb-2">
            <span className="font-bold">{event.time}</span>: {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
