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
import { Bar,Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Results() {
  const { currentUser } = useAuth();
  const { courseDetails, loading: courseLoading, error: courseError } = useCourse();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Faculty-specific state variables
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingExamDetails, setLoadingExamDetails] = useState(false);
  
  // Add Result form state variables
  const [showAddResultForm, setShowAddResultForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [newExam, setNewExam] = useState({
    examName: '',
    totalMarks: '',
    weightage: '',
    results: []
  });
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [publishing, setPublishing] = useState(false);

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
    else if (currentUser.userType === 'faculty' && courseDetails?.id) {
      const fetchExams = async () => {
        setLoadingExams(true);
        try {
          const response = await axios.get(
            `http://localhost:3001/api/result/course/${courseDetails.id}/exams`
          );
          setExams(response.data || []);
        } catch (err) {
          console.error('Error fetching exams:', err);
          setError('Failed to fetch exams. Please try again later.');
        } finally {
          setLoadingExams(false);
          setLoading(false);
        }
      };

      fetchExams();
    }
  }, [currentUser.id, currentUser.userType, courseDetails?.id]);

  // Fetch exam details when an exam is selected
  useEffect(() => {
    if (selectedExamId && courseDetails?.id) {
      const fetchExamDetails = async () => {
        setLoadingExamDetails(true);
        try {
          const response = await axios.get(
            `http://localhost:3001/api/result/course/${courseDetails.id}/exam/${selectedExamId}`
          );
          setExamDetails(response.data);
        } catch (err) {
          console.error('Error fetching exam details:', err);
          setError('Failed to fetch exam details. Please try again later.');
        } finally {
          setLoadingExamDetails(false);
        }
      };

      fetchExamDetails();
    }
  }, [selectedExamId, courseDetails?.id]);

  const handleExamChange = (e) => {
    setSelectedExamId(e.target.value);
  };
  
  // Add Result form functions
  const handleShowAddResultForm = async () => {
    setShowAddResultForm(true);
    setLoadingStudents(true);
    setValidationErrors({});
    
    try {
      const response = await axios.get(
        `http://localhost:3001/api/result/course/${courseDetails.id}/students`
      );
      const studentList = response.data;
      setStudents(studentList);
      
      // Initialize results array with student data
      setNewExam(prev => ({
        ...prev,
        results: studentList.map(student => ({
          userId: student.userId,
          obtainedMarks: ''
        }))
      }));
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students. Please try again later.');
    } finally {
      setLoadingStudents(false);
    }
  };
  
  const handleCancelAddResult = () => {
    setShowAddResultForm(false);
    setNewExam({
      examName: '',
      totalMarks: '',
      weightage: '',
      results: []
    });
    setValidationErrors({});
  };
  
  const handleExamInputChange = (e) => {
    const { name, value } = e.target;
    setNewExam(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field if exists
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleStudentMarkChange = (userId, value) => {
    setNewExam(prev => ({
      ...prev,
      results: prev.results.map(result => 
        result.userId === userId 
          ? { ...result, obtainedMarks: value } 
          : result
      )
    }));
    
    // Clear validation error for this student if exists
    if (validationErrors[`student-${userId}`]) {
      setValidationErrors(prev => ({
        ...prev,
        [`student-${userId}`]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    const totalMarksNum = parseFloat(newExam.totalMarks);
    
    // Validate exam details
    if (!newExam.examName.trim()) {
      errors.examName = 'Exam name is required';
    }
    
    if (!newExam.totalMarks) {
      errors.totalMarks = 'Total marks is required';
    } else if (isNaN(totalMarksNum) || totalMarksNum <= 0) {
      errors.totalMarks = 'Total marks must be a positive number';
    }
    
    if (!newExam.weightage) {
      errors.weightage = 'Weightage is required';
    } else if (isNaN(parseFloat(newExam.weightage)) || parseFloat(newExam.weightage) <= 0 || parseFloat(newExam.weightage) > 100) {
      errors.weightage = 'Weightage must be a positive number between 1 and 100';
    }
    
    // Validate student marks
    newExam.results.forEach(result => {
      if (result.obtainedMarks === '') {
        errors[`student-${result.userId}`] = 'Mark is required';
      } else {
        const markNum = parseFloat(result.obtainedMarks);
        if (isNaN(markNum)) {
          errors[`student-${result.userId}`] = 'Must be a number';
        } else if (markNum < 0) {
          errors[`student-${result.userId}`] = 'Cannot be negative';
        } else if (markNum > totalMarksNum) {
          errors[`student-${result.userId}`] = `Max is ${totalMarksNum}`;
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlePublishResults = async () => {
    if (!validateForm()) {
      return;
    }
    
    setPublishing(true);
    try {
      // Format the data as expected by the API
      const formattedData = {
        examName: newExam.examName,
        weightage: parseFloat(newExam.weightage),
        totalMarks: parseFloat(newExam.totalMarks),
        results: newExam.results.map(result => ({
          userId: result.userId,
          obtainedMarks: parseFloat(result.obtainedMarks)
        }))
      };
      
      await axios.post(
        `http://localhost:3001/api/result/course/${courseDetails.id}/publish`,
        formattedData
      );
      
      // Refresh exam list
      const response = await axios.get(
        `http://localhost:3001/api/result/course/${courseDetails.id}/exams`
      );
      setExams(response.data || []);
      
      // Reset form
      setShowAddResultForm(false);
      setNewExam({
        examName: '',
        totalMarks: '',
        weightage: '',
        results: []
      });
      setError(null);
    } catch (err) {
      console.error('Error publishing results:', err);
      setError('Failed to publish results. Please try again later.');
    } finally {
      setPublishing(false);
    }
  };

  if (courseLoading) {
    return <div>Loading course details...</div>;
  }

  if (courseError) {
    return <div>Error loading course details: {courseError}</div>;
  }

  // Faculty View
  if (currentUser.userType === 'faculty') {
    return (
      <div className="w-full h-screen p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Exam Results</h1>
        
        {/* Exam Selection Controls */}
        <div className="flex flex-col md:flex-row md:items-end mb-6 gap-4">
          <div className="flex-grow">
            <label className="block mb-2 font-semibold">Select Exam:</label>
            <select
              className="p-2 border border-gray-300 rounded w-full"
              onChange={handleExamChange}
              value={selectedExamId || ""}
              disabled={loadingExams || showAddResultForm}
            >
              <option value="">-- Select an exam --</option>
              {exams && exams.length > 0 ? (
                exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.examName}</option>
                ))
              ) : (
                !loadingExams && <option value="" disabled>No exams available</option>
              )}
            </select>
          </div>
          
          {!showAddResultForm && (
            <button
              onClick={handleShowAddResultForm}
              disabled={loadingExams}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add Result
            </button>
          )}
        </div>

        {/* Loading State */}
        {(loadingExams || loadingExamDetails) && !showAddResultForm && (
          <div className="text-center py-4">Loading...</div>
        )}

        {/* No Exams Message */}
        {!loadingExams && exams.length === 0 && !showAddResultForm && (
          <div className="text-center py-4 text-gray-500">
            No results available yet. Add an exam to see results here.
          </div>
        )}

        {/* Add Result Form */}
        {showAddResultForm && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Exam Result</h2>
            
            {/* Exam Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block mb-1 font-medium">Exam Name</label>
                <input
                  type="text"
                  name="examName"
                  value={newExam.examName}
                  onChange={handleExamInputChange}
                  className={`w-full p-2 border ${validationErrors.examName ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="e.g., Midterm Exam"
                  disabled={publishing}
                />
                {validationErrors.examName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.examName}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={newExam.totalMarks}
                  onChange={handleExamInputChange}
                  className={`w-full p-2 border ${validationErrors.totalMarks ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="e.g., 100"
                  min="0"
                  step="any"
                  disabled={publishing}
                />
                {validationErrors.totalMarks && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.totalMarks}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Weightage (%)</label>
                <input
                  type="number"
                  name="weightage"
                  value={newExam.weightage}
                  onChange={handleExamInputChange}
                  className={`w-full p-2 border ${validationErrors.weightage ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="e.g., 20"
                  min="0"
                  max="100"
                  step="any"
                  disabled={publishing}
                />
                {validationErrors.weightage && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.weightage}</p>
                )}
              </div>
            </div>
            
            {/* Loading Students */}
            {loadingStudents && (
              <div className="text-center py-4">Loading students...</div>
            )}
            
            {/* Student Marks Table */}
            {!loadingStudents && students.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-2">Student Marks</h3>
                <div className="overflow-x-auto max-h-96 overflow-y-auto mb-4">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b text-left">Roll Number</th>
                        <th className="py-2 px-4 border-b text-left">Name</th>
                        <th className="py-2 px-4 border-b text-center">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student.userId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2 px-4 border-b">{student.rollNumber}</td>
                          <td className="py-2 px-4 border-b">{`${student.user.firstName} ${student.user.lastName}`}</td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="number"
                              value={newExam.results.find(r => r.userId === student.userId)?.obtainedMarks || ''}
                              onChange={(e) => handleStudentMarkChange(student.userId, e.target.value)}
                              className={`w-full p-1 border ${validationErrors[`student-${student.userId}`] ? 'border-red-500' : 'border-gray-300'} rounded text-center`}
                              placeholder="0"
                              min="0"
                              step="any"
                              disabled={publishing}
                            />
                            {validationErrors[`student-${student.userId}`] && (
                              <p className="text-red-500 text-sm">{validationErrors[`student-${student.userId}`]}</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleCancelAddResult}
                    disabled={publishing}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublishResults}
                    disabled={publishing}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {publishing ? 'Publishing...' : 'Publish Results'}
                  </button>
                </div>
              </>
            )}
            
            {/* No Students Message */}
            {!loadingStudents && students.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No students enrolled in this course
              </div>
            )}
          </div>
        )}

        {/* Exam Details and Results */}
        {selectedExamId && examDetails && !loadingExamDetails && !showAddResultForm && (
          <div>
            {/* Exam Statistics */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-3">{examDetails.examName}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-500">Total Marks</p>
                  <p className="text-xl font-semibold">{examDetails.totalMarks}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-sm text-gray-500">Weightage</p>
                  <p className="text-xl font-semibold">{examDetails.weightage}%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-sm text-gray-500">Mean</p>
                  <p className="text-xl font-semibold">{examDetails.mean?.toFixed(1) || 'N/A'}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded">
                  <p className="text-sm text-gray-500">Median</p>
                  <p className="text-xl font-semibold">{examDetails.median || 'N/A'}</p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-sm text-gray-500">Maximum</p>
                  <p className="text-xl font-semibold">{examDetails.max || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Standard Deviation</p>
                  <p className="text-xl font-semibold">{examDetails.deviation?.toFixed(1) || 'N/A'}</p>
                </div>
              </div>
            </div>
         

{ /* Performance Visualization - Single centered chart */ }
<div className="bg-white p-4 rounded-lg shadow mb-6">
  <h3 className="text-lg font-bold mb-4 text-center">Class Performance</h3>
  
  {/* Centered Score Distribution Chart */}
  <div className="max-w-3xl mx-auto mb-6">
    <div className="bg-gray-50 p-5 rounded-lg">
      <h4 className="text-md font-medium mb-3 text-center text-gray-700">Score Distribution</h4>
      <div className="h-72">
        <Bar
          data={(() => {
            // Define grade ranges with improved colors
            const ranges = [
              { min: 0, max: 20, label: '0-20%', color: 'rgba(255, 99, 132, 0.7)' },
              { min: 20, max: 40, label: '20-40%', color: 'rgba(255, 159, 64, 0.7)' },
              { min: 40, max: 60, label: '40-60%', color: 'rgba(255, 205, 86, 0.7)' },
              { min: 60, max: 80, label: '60-80%', color: 'rgba(75, 192, 192, 0.7)' },
              { min: 80, max: 100, label: '80-100%', color: 'rgba(54, 162, 235, 0.7)' }
            ];

            // Calculate percentages for each student
            const percentages = examDetails.results
              .map(r => (r.obtainedMarks / examDetails.totalMarks) * 100)
              .filter(p => !isNaN(p));
            
            // Initialize counts with all zeros
            const rangeCounts = ranges.map(range => ({
              range: range.label,
              count: 0,
              color: range.color
            }));

            // Place each student in exactly one range
            percentages.forEach(p => {
              if (p === 100) {
                // Handle 100% exactly
                rangeCounts[4].count++;
              } else {
                const rangeIndex = Math.floor(p / 20);
                if (rangeIndex >= 0 && rangeIndex < 5) {
                  rangeCounts[rangeIndex].count++;
                }
              }
            });

            return {
              labels: rangeCounts.map(c => c.range),
              datasets: [
                {
                  label: 'Number of Students',
                  data: rangeCounts.map(c => c.count),
                  backgroundColor: rangeCounts.map(c => c.color),
                  borderColor: rangeCounts.map(c => c.color.replace('0.7', '1')),
                  borderWidth: 1,
                  borderRadius: 5,
                }
              ]
            };
          })()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.raw} students (${(context.raw / examDetails.results.length * 100).toFixed(1)}%)`;
                  }
                }
              }
            },
            scales: {
              x: {
                title: { display: true, text: 'Score Range' }
              },
              y: {
                title: { display: true, text: 'Number of Students' },
                beginAtZero: true,
                ticks: { precision: 0 }
              }
            }
          }}
        />
      </div>
    </div>
  </div>
</div>

            {/* Student Results Table */}
            <h3 className="text-lg font-semibold mb-2">Student Results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Roll Number</th>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-center">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {examDetails.results.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                        No student results available
                      </td>
                    </tr>
                  ) : (
                    examDetails.results.map((result, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4 border-b">{result.rollNumber}</td>
                        <td className="py-2 px-4 border-b">{result.name}</td>
                        <td className="py-2 px-4 border-b text-center">
                          {result.obtainedMarks !== null ? result.obtainedMarks : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-red-500 py-2">{error}</div>
        )}
      </div>
    );
  }

  // Student View - Loading and Error States
  if (loading) {
    return <div>Loading results...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Prepare data for the graph
  const examNames = results.map((result) => result.examName);
  const obtainedMarks = results.map((result) => result.obtainedMarks || 0);
  const unobtainedMarks = results.map(
    (result) => (result.totalMarks || 0) - (result.obtainedMarks || 0)
  );
  const totalWeightage = results.map((result) => result.weightage || 0);
  const obtainedWeightage = results.map(
    (result) => (result.obtainedMarks * result.weightage) / result.totalMarks || 0
  );
  const unobtainedWeightage = totalWeightage.map(
    (total, index) => total - obtainedWeightage[index]
  );

  const chartData = {
    labels: examNames,
    datasets: [
      {
        label: 'Obtained Marks',
        data: obtainedMarks,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        stack: 'Marks',
      },
      {
        label: 'Remaining Marks',
        data: unobtainedMarks,
        backgroundColor: 'rgba(200, 200, 200, 0.6)',
        borderColor: 'rgba(200, 200, 200, 1)',
        borderWidth: 1,
        stack: 'Marks',
      },
      {
        label: 'Obtained Weightage',
        data: obtainedWeightage,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        stack: 'Weightage',
      },
      {
        label: 'Remaining Weightage',
        data: unobtainedWeightage,
        backgroundColor: 'rgba(230, 230, 230, 0.6)',
        borderColor: 'rgba(230, 230, 230, 1)',
        borderWidth: 1,
        stack: 'Weightage',
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
            legendItem.text !== 'Remaining Marks' && legendItem.text !== 'Remaining Weightage',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Exams',
        },
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: 'Marks / Weightage',
        },
        beginAtZero: true,
        stacked: true,
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