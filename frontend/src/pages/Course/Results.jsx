/*
import React from 'react'

export default function Results() {
  return (
    <div>
      Results
    </div>
  )
}
*/

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCourse } from '../../contexts/CourseContext';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2
import 'chart.js/auto'; // Import Chart.js auto configuration

export default function Results() {
  const { currentUser } = useAuth();
  const { courseDetails, loading: courseLoading, error: courseError } = useCourse();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser.userType === 'student' && courseDetails?.id) {
      const fetchResults = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/api/result/student/${currentUser.id}/course/${courseDetails.id}`
          );
          setResults(response.data);
        } catch (err) {
          console.error('Error fetching results:', err);
          setError('Failed to fetch results. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [currentUser.id, currentUser.userType, courseDetails?.id]);

  if (courseLoading) {
    return <div>Loading course details...</div>;
  }

  if (courseError) {
    return <div>Error loading course details: {courseError}</div>;
  }

  if (currentUser.userType === 'faculty') {
    return <div>It is faculty result page</div>;
  }

  if (loading) {
    return <div>Loading results...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Prepare data for the graph
  const examNames = results.map((result) => result.examName);
  const obtainedMarks = results.map((result) => result.obtainedMarks || 0); // Obtained marks
  const unobtainedMarks = results.map(
    (result) => (result.totalMarks || 0) - (result.obtainedMarks || 0)
  ); // Unobtained marks
  const totalWeightage = results.map((result) => result.weightage || 0); // Total weightage
  const obtainedWeightage = results.map(
    (result) => (result.obtainedMarks * result.weightage) / result.totalMarks || 0
  ); // Obtained weightage
  const unobtainedWeightage = totalWeightage.map(
    (total, index) => total - obtainedWeightage[index]
  ); // Unobtained weightage

  const chartData = {
    labels: examNames,
    datasets: [
      {
        label: 'Obtained Marks',
        data: obtainedMarks,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Darker shade for obtained marks
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        stack: 'Marks', // Stack for marks
      },
      {
        label: 'Remaining Marks',
        data: unobtainedMarks,
        backgroundColor: 'rgba(200, 200, 200, 0.6)', // Lighter shade for unobtained marks
        borderColor: 'rgba(200, 200, 200, 1)',
        borderWidth: 1,
        stack: 'Marks', // Stack for marks
      },
      {
        label: 'Obtained Weightage',
        data: obtainedWeightage,
        backgroundColor: 'rgba(153, 102, 255, 0.6)', // Darker shade for obtained weightage
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        stack: 'Weightage', // Stack for weightage
      },
      {
        label: 'Remaining Weightage',
        data: unobtainedWeightage,
        backgroundColor: 'rgba(230, 230, 230, 0.6)', // Lighter shade for unobtained weightage
        borderColor: 'rgba(230, 230, 230, 1)',
        borderWidth: 1,
        stack: 'Weightage', // Stack for weightage
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          filter: (legendItem) =>
            legendItem.text !== 'Remaining Marks' && legendItem.text !== 'Remaining Weightage', // Remove legends for unobtained marks and weightage
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Exams',
        },
        stacked: true, // Enable stacking for the x-axis
      },
      y: {
        title: {
          display: true,
          text: 'Marks / Weightage',
        },
        beginAtZero: true,
        stacked: true, // Enable stacking for the y-axis
      },
    },
  };

  return (
    <div className="w-full h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Results</h1>

      {/* Graph Section */}
      {results.length > 0 && (
        <div className="w-full h-96 mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Table Section */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center w-32">Exam Name</th>
            <th className="py-2 px-4 border-b text-center w-24">Weightage</th>
            <th className="py-2 px-4 border-b text-center w-24">Total Marks</th>
            <th className="py-2 px-4 border-b text-center w-32">Obtained Marks</th>
            <th className="py-2 px-4 border-b text-center w-24">Mean</th>
            <th className="py-2 px-4 border-b text-center w-24">Median</th>
            <th className="py-2 px-4 border-b text-center w-24">Max</th>
            <th className="py-2 px-4 border-b text-center w-32">Deviation</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                No results available yet
              </td>
            </tr>
          ) : (
            results.map((result, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-center w-32 overflow-x-auto">
                  {result.examName}
                </td>
                <td className="py-2 px-4 border-b text-center w-24 overflow-x-auto">
                  {result.weightage}
                </td>
                <td className="py-2 px-4 border-b text-center w-24 overflow-x-auto">
                  {result.totalMarks}
                </td>
                <td className="py-2 px-4 border-b text-center w-32 overflow-x-auto">
                  {result.obtainedMarks !== null ? result.obtainedMarks : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b text-center w-24 overflow-x-auto">
                  {result.mean}
                </td>
                <td className="py-2 px-4 border-b text-center w-24 overflow-x-auto">
                  {result.median}
                </td>
                <td className="py-2 px-4 border-b text-center w-24 overflow-x-auto">
                  {result.max}
                </td>
                <td className="py-2 px-4 border-b text-center w-32 overflow-x-auto">
                  {result.deviation !== null ? result.deviation.toFixed(1) : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}