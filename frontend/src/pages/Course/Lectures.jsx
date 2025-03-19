import React, { useState, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoIosArrowDropdown } from "react-icons/io";
import { FaPlus, FaRegEdit, FaDownload, FaFilePdf } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { NavLink } from 'react-router-dom';
import { useCourse } from '../../contexts/CourseContext';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export default function Lectures({ role }) {
  const { courseDetails } = useCourse();
  const { showNotification } = useNotification();

  const [lectures, setLectures] = useState([]);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('create');
  const [formData, setFormData] = useState({
    week: '',
    topicTitle: '',
    lectureTitle: '',
    lectureDescription: '',
    pdfUrl: ''
  });
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [pdfFile, setPdfFile] = useState(null); // New state for PDF file

  useEffect(() => {
    if (courseDetails?.id) {
      fetchLectures();
    }
  }, [courseDetails]);
  
  const url = `${BACKEND_URL}/api/lectures/${currentLectureId}/course/${courseDetails.id}`;
console.log('Final request URL:', url);  // Check if the URL is correct

  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BACKEND_URL}/api/lectures/course/${courseDetails.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const grouped = response.data.data.reduce((acc, lecture) => {
          const { week, topicTitle } = lecture;

          if (!acc[week]) acc[week] = {};
          if (!acc[week][topicTitle]) acc[week][topicTitle] = [];

          acc[week][topicTitle].push(lecture);
          return acc;
        }, {});

        setLectures(grouped);
      } else {
        showNotification('Failed to fetch lectures', 'error');
      }
    } catch (err) {
      console.error('Error fetching lectures:', err);
      showNotification('Error loading lectures', 'error');
    }
  };

  const toggleWeek = (week) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [week]: !prev[week],
    }));
  };

  const handleEditClick = (e, lecture) => {
    e.stopPropagation();
    setFormType('edit');
    setFormData({
      week: lecture.week,
      topicTitle: lecture.topicTitle,
      lectureTitle: lecture.lectureTitle,
      lectureDescription: lecture.lectureDescription,
      pdfUrl: lecture.pdfUrl
    });
    setCurrentLectureId(lecture.id);
    setShowForm(true);
  };

  const handleDeleteClick = (e, lecture) => {
    e.stopPropagation();
    setLectureToDelete(lecture);
    setShowDeleteConfirm(true);
  };

  const downloadHandler = (e, pdfUrl) => {
    e.stopPropagation();
    if (!pdfUrl) {
      console.error('PDF URL is undefined');
      showNotification('PDF file not available for download', 'error');
      return;
    }
  
    const link = document.createElement('a');
    link.href = pdfUrl; // Use the full URL provided by the backend
    link.download = pdfUrl.split('/').pop(); // Extract the file name from the URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      const formDataToSend1 = new FormData();
  
      formDataToSend.append('courseId', courseDetails.id);
      formDataToSend.append('week', formData.week);
      formDataToSend.append('topicTitle', formData.topicTitle);
      formDataToSend.append('lectureTitle', formData.lectureTitle);
      formDataToSend.append('lectureDescription', formData.lectureDescription);

      formDataToSend1.append('week', formData.week);
      formDataToSend1.append('topicTitle', formData.topicTitle);
      formDataToSend1.append('lectureTitle', formData.lectureTitle);
      formDataToSend1.append('lectureDescription', formData.lectureDescription);
  console.log('PDF File:', pdfFile); // Debug statement to check for PDF file
      if (pdfFile) {
        formDataToSend.append('pdfFile', pdfFile); // Append the PDF file
        formDataToSend1.append('pdfFile', pdfFile);
      }
  
      let response;
  
      if (formType === 'create') {
        response = await axios.post(`${BACKEND_URL}/api/lectures`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.data.success) {
          showNotification('Lecture created successfully', 'success');
          fetchLectures(); // Refresh lectures list
        }
      } else if (formType === 'edit') {
        response = await axios.put(
          `${BACKEND_URL}/api/lectures/${courseDetails.id}/${currentLectureId}`,
          formDataToSend1,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (response.data.success) {
          showNotification('Lecture updated successfully', 'success');
          // Update the lecture in the state
          setLectures((prev) => {
            const updatedLectures = { ...prev };
            const weekLectures = updatedLectures[formData.week] || {};
            const topicLectures = weekLectures[formData.topicTitle] || [];
        
            const updatedTopicLectures = topicLectures.map((lecture) =>
              lecture.id === currentLectureId
                ? {
                    ...lecture,
                    week: formData.week,
                    topicTitle: formData.topicTitle,
                    lectureTitle: formData.lectureTitle,
                    lectureDescription: formData.lectureDescription,
                    pdfUrl: response.data.data.pdfUrl, // Update the PDF URL
                    updatedAt: new Date().toISOString(),
                  }
                : lecture
            );
        
            updatedLectures[formData.week] = {
              ...weekLectures,
              [formData.topicTitle]: updatedTopicLectures,
            };
        
            return updatedLectures;
          });
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      showNotification(
        `Error ${formType === 'create' ? 'creating' : 'updating'} lecture`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
      setShowForm(false);
      setFormData({ week: '', topicTitle: '', lectureTitle: '', lectureDescription: '' });
      setPdfFile(null); // Reset the PDF file
      setCurrentLectureId(null);
    }
  };
  

  const handleDeleteConfirm = async () => {
    if (!lectureToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const url = `${BACKEND_URL}/api/lectures/${courseDetails.id}/${lectureToDelete.id}/`;

      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        showNotification('Lecture deleted successfully', 'success');
        setShowDeleteConfirm(false);
        fetchLectures(); // Refresh the lectures list
      } else {
        showNotification(response.data.message || 'Failed to delete lecture', 'error');
      }
    } catch (err) {
      console.error('Error deleting lecture:', err);
      showNotification('Error deleting lecture', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className='w-full h-screen overflow-y-auto'>
      {/* Header */}
      <div className='flex justify-between py-2 px-8 items-center sticky top-0 bg-[#F5F5F5] shadow-md'>
        <div>
          <p className='text-[32px] uppercase font-semibold m-4'>Lectures</p>
          <p className='text-gray-600 ml-4 -mt-3'>
            {courseDetails.code} • {courseDetails.credits} Credits • {courseDetails.semester}
          </p>
        </div>

        <div className='flex items-center gap-4'>
          {role !== "student" && (
            <button
              className='bg-blue-500 shadow-xl text-white py-2 px-4 flex justify-center items-center gap-2 hover:bg-green-600 hover:scale-95 transition-all duration-200 rounded'
              onClick={() => {
                setFormType('create');
                setFormData({
                  week: '', topicTitle: '', lectureTitle: '', lectureDescription: '', pdfUrl: ''
                });
                setShowForm(true);
              }}
            >
              <FaPlus className='text-[18px]' />
              <p>Add Lecture</p>
            </button>
          )}
          <NavLink to="/dashboard/profile">
            <CgProfile className='text-[40px] cursor-pointer hover:text-blue-500 duration-200 transition-all' />
          </NavLink>
        </div>
      </div>

      {/* Lecture Content */}
      <div className='p-6'>
        {Object.keys(lectures).length > 0 ? (
          Object.entries(lectures).map(([week, topics]) => (
            <div key={week} className='mb-3'>
              {/* Week Header */}
              <div
                className='w-[98%] py-3 ml-6 border-2 flex flex-col px-8 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200'
                onClick={() => toggleWeek(week)}
              >
                <div className='flex justify-between w-full font-semibold'>
                  <span className='text-lg'>Week {week}</span>
                  <IoIosArrowDropdown 
                    className={`text-[25px] transform transition-transform duration-500 ${
                      expandedWeeks[week] ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {/* Expanded Week with Topics and Lectures */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedWeeks[week] ? 'max-h-[1000px] opacity-100 py-3' : 'max-h-0 opacity-0'
                  }`}
                >
                  {Object.entries(topics).map(([topicTitle, lectures]) => (
                    <div key={topicTitle} className="mb-4">
                      <h3 className="font-medium text-lg mb-2">{topicTitle}</h3>
                      
                      {lectures.map((lecture) => (
                        <div 
                          key={lecture.id}
                          className="ml-4 mb-2 flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <span>{lecture.lectureTitle}</span>
                          
                          <div className='flex gap-4 items-center'>
                            <button 
                              onClick={(e) => downloadHandler(e, lecture.pdfUrl)}
                              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:underline"
                            >
                              <FaFilePdf className="text-red-500" />
                              <FaDownload className="text-[14px]" />
                            </button>
                            
                            {role !== "student" && (
                              <div className='flex gap-2 items-center'>
                                <button onClick={(e) => handleEditClick(e, lecture)}>
                                  <FaRegEdit className='text-[18px]' />
                                </button>
                                <button onClick={(e) => handleDeleteClick(e, lecture)}>
                                  <AiOutlineDelete className='text-[18px] text-red-600' />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center text-gray-600'>No lectures available.</div>
        )}
      </div>

      {/* Lecture Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {formType === 'create' ? 'Add Lecture' : 'Edit Lecture'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Week"
                  value={formData.week}
                  onChange={(e) => setFormData({ ...formData, week: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Topic Title"
                  value={formData.topicTitle}
                  onChange={(e) => setFormData({ ...formData, topicTitle: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Lecture Title"
                  value={formData.lectureTitle}
                  onChange={(e) => setFormData({ ...formData, lectureTitle: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Lecture Description"
                  value={formData.lectureDescription}
                  onChange={(e) => setFormData({ ...formData, lectureDescription: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="4"
                  required
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])} // Handle file selection
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this lecture?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}