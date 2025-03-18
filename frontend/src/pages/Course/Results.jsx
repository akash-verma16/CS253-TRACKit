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

  return (
    <div className="w-full h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
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