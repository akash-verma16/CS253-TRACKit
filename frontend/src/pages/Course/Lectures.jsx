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
    heading: '', // Updated from week
    subheading: '', // Updated from topicTitle
    lectureTitle: '',
    lectureDescription: '',
    pdfUrl: '',
    youtubeLink: '' // Add YouTube link field
  });
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]); // Updated state for multiple PDF files
  const [showHeadingForm, setShowHeadingForm] = useState(false);
  const [showSubheadingForm, setShowSubheadingForm] = useState({});
  const [newHeadingData, setNewHeadingData] = useState({ // Replace newHeading with newHeadingData object
    heading: '',
    subheading: ''
  });
  const [subheadingFormData, setSubheadingFormData] = useState({
    heading: '',
    subheading: '',
  });
  const [showSubsectionForm, setShowSubsectionForm] = useState(false); // New state for subsection modal
  const [subsectionFormData, setSubsectionFormData] = useState({
    heading: '',
    subheading: '',
  }); // New state for subsection form data

  useEffect(() => {
    if (courseDetails?.id) {
      fetchLectures();
    }
  }, [courseDetails]);

  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BACKEND_URL}/api/lectures/course/${courseDetails.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const grouped = response.data.data
          .filter((lecture) => lecture.heading) // Filter out lectures with null heading
          .reduce((acc, lecture) => {
            const { heading, subheading } = lecture;

            if (!acc[heading]) acc[heading] = {};
            if (!acc[heading][subheading]) acc[heading][subheading] = [];

            acc[heading][subheading].push(lecture);
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
      heading: lecture.heading, // Updated from week
      subheading: lecture.subheading, // Updated from topicTitle
      lectureTitle: lecture.lectureTitle,
      lectureDescription: lecture.lectureDescription,
      pdfUrl: lecture.pdfUrl,
      youtubeLink: lecture.youtubeLink // Include YouTube link
    });
    setCurrentLectureId(lecture.id);
    setShowForm(true);
  };

  const handleDeleteClick = (e, lecture) => {
    e.stopPropagation();
    setLectureToDelete(lecture);
    setShowDeleteConfirm(true);
  };

  const downloadHandler = (e, pdfUrls) => {
    e.stopPropagation();
    if (!pdfUrls || pdfUrls.length === 0) {
      console.error('No PDF files available');
      showNotification('No PDF files available for download', 'error');
      return;
    }

    const pdfList = pdfUrls.map((url, index) => ({
      name: `Supplement ${index + 1}`,
      url,
    }));

    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '80px'; // Changed from '0' to '80px' to bring it down from top
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.zIndex = '1000';
    overlay.style.transform = 'translateY(-100%)';
    overlay.style.transition = 'transform 0.3s ease-in-out';
    
    // Create the content box
    const contentBox = document.createElement('div');
    contentBox.style.backgroundColor = '#ffffff';
    contentBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    contentBox.style.borderBottomLeftRadius = '8px';
    contentBox.style.borderBottomRightRadius = '8px';
    contentBox.style.padding = '20px';
    contentBox.style.maxWidth = '800px';
    contentBox.style.margin = '0 auto';
    contentBox.style.position = 'relative';
    
    // Create header with title and close button
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '15px';
    
    const title = document.createElement('h3');
    title.textContent = 'Lecture Supplements';
    title.style.margin = '0';
    title.style.fontSize = '20px';
    title.style.fontWeight = 'bold';
    title.style.color = '#111827';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#4B5563';
    closeButton.style.padding = '0 5px';
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Create PDF links list
    const linksList = document.createElement('div');
    linksList.style.display = 'flex';
    linksList.style.flexWrap = 'wrap';
    linksList.style.gap = '10px';
    
    pdfList.forEach(pdf => {
      const linkContainer = document.createElement('div');
      linkContainer.style.padding = '8px 12px';
      linkContainer.style.backgroundColor = '#F3F4F6';
      linkContainer.style.borderRadius = '6px';
      linkContainer.style.display = 'flex';
      linkContainer.style.alignItems = 'center';
      linkContainer.style.gap = '8px';
      
      const pdfIcon = document.createElement('span');
      pdfIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #EF4444;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
      
      const link = document.createElement('a');
      link.href = pdf.url;
      link.textContent = pdf.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.color = '#1D4ED8';
      link.style.textDecoration = 'none';
      link.style.fontWeight = '500';
      
      linkContainer.appendChild(pdfIcon);
      linkContainer.appendChild(link);
      linksList.appendChild(linkContainer);
    });
    
    // Assemble everything
    contentBox.appendChild(header);
    contentBox.appendChild(linksList);
    overlay.appendChild(contentBox);
    document.body.appendChild(overlay);
    
    // Force reflow for animation
    void overlay.offsetHeight; // Use void operator to avoid unused expression error
    
    // Show the overlay with animation
    overlay.style.transform = 'translateY(0)';
    
    // Close handlers
    const closeOverlay = () => {
      overlay.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300); // Match the transition duration
    };
    
    closeButton.addEventListener('click', closeOverlay);
    
    // Close when clicking outside the content box (optional)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeOverlay();
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.heading) { // Prevent creating a lecture with null heading
      showNotification('Heading cannot be null', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      formDataToSend.append('courseId', courseDetails.id);
      formDataToSend.append('heading', formData.heading); // Include heading
      formDataToSend.append('subheading', formData.subheading); // Include subheading
      formDataToSend.append('lectureTitle', formData.lectureTitle);
      formDataToSend.append('lectureDescription', formData.lectureDescription);
      formDataToSend.append('youtubeLink', formData.youtubeLink); // Append null if YouTube link is not provided
      // formDataToSend.append('youtubeLink', formData.youtubeLink); // Include YouTube link

      if (pdfFiles.length > 0) {
        pdfFiles.forEach((file) => formDataToSend.append('pdfFiles', file)); // Append multiple PDF files
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
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.success) {
          showNotification('Lecture updated successfully', 'success');
          fetchLectures(); // Refresh lectures list
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
      setFormData({ heading: '', subheading: '', lectureTitle: '', lectureDescription: '', pdfUrl: '', youtubeLink: '' });
      setPdfFiles([]); // Reset the PDF files
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

  const handleAddHeading = async () => {
    if (!newHeadingData.heading.trim() || !newHeadingData.subheading.trim()) {
      showNotification('Both Module name and Section name are required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Create heading with required subheading
      const response = await axios.post(
        `${BACKEND_URL}/api/lectures/heading`,
        { 
          courseId: courseDetails.id, 
          heading: newHeadingData.heading,
          subheading: newHeadingData.subheading 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification('Module and Section added successfully', 'success');
        fetchLectures(); // Refresh the lectures list
      } else {
        showNotification(response.data.message || 'Failed to add module', 'error');
      }
    } catch (err) {
      console.error('Error adding heading:', err);
      showNotification('Error adding module', 'error');
    } finally {
      setShowHeadingForm(false);
      setNewHeadingData({ heading: '', subheading: '' });
    }
  };

  const handleAddSubheading = async (heading) => {
    if (!subheadingFormData.subheading.trim()) {
      showNotification('Subheading cannot be empty', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BACKEND_URL}/api/lectures/subheading`,
        { courseId: courseDetails.id, heading, subheading: subheadingFormData.subheading },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification('Subheading added successfully', 'success');
        fetchLectures(); // Refresh the lectures list
      } else {
        showNotification(response.data.message || 'Failed to add subheading', 'error');
      }
    } catch (err) {
      console.error('Error adding subheading:', err);
      showNotification('Error adding subheading', 'error');
    } finally {
      setShowSubheadingForm((prev) => ({ ...prev, [heading]: false }));
      setSubheadingFormData({ heading: '', subheading: '' });
    }
  };

  const handleAddLecture = (heading, subheading) => {
    setFormType('create');
    setFormData({
      heading, // Pass the heading directly
      subheading, // Pass the subheading directly
      lectureTitle: '',
      lectureDescription: '',
      pdfUrl: '',
      youtubeLink: '' // Add YouTube link field
    });
    setShowForm(true);
  };

  const handleAddSubsectionClick = (heading) => {
    setSubsectionFormData({ heading, subheading: '' }); // Initialize form data with the heading
    setShowSubsectionForm(true); // Open the modal
  };

  const handleSubsectionFormSubmit = async (e) => {
    e.preventDefault();
    if (!subsectionFormData.subheading.trim()) {
      showNotification('Subsection cannot be empty', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BACKEND_URL}/api/lectures/subheading`,
        {
          courseId: courseDetails.id,
          heading: subsectionFormData.heading,
          subheading: subsectionFormData.subheading,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification('Subsection added successfully', 'success');
        fetchLectures(); // Refresh the lectures list
      } else {
        showNotification(response.data.message || 'Failed to add subsection', 'error');
      }
    } catch (err) {
      console.error('Error adding subsection:', err);
      showNotification('Error adding subsection', 'error');
    } finally {
      setShowSubsectionForm(false); // Close the modal
      setSubsectionFormData({ heading: '', subheading: '' }); // Reset form data
    }
  };

  const handleEditSubheadingClick = (heading, subheading) => {
    // Store both the heading and subheading information
    setSubheadingFormData({ 
      heading: heading, // Store the heading (module name)
      subheading: subheading,
      currentSubheading: subheading // Store the original subheading value
    });
    setShowSubheadingForm((prev) => ({ ...prev, [`${heading}-${subheading}`]: true }));
  };

  const handleEditSubheadingSubmit = async (e, heading) => {
    e.preventDefault();
    if (!subheadingFormData.subheading.trim()) {
      showNotification('Subheading cannot be empty', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BACKEND_URL}/api/lectures/${courseDetails.id}/subheading`,
        {
          heading: subheadingFormData.heading, // Include the heading (module name)
          currentSubheading: subheadingFormData.currentSubheading || subheadingFormData.subheading, // Use stored original subheading
          newSubheading: subheadingFormData.subheading  // New subheading value
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification('Subheading updated successfully', 'success');
        fetchLectures(); // Refresh the lectures list
      } else {
        showNotification(response.data.message || 'Failed to update subheading', 'error');
      }
    } catch (err) {
      console.error('Error updating subheading:', err);
      showNotification('Error updating subheading', 'error');
    } finally {
      // Use the same key format when closing the form
      setShowSubheadingForm((prev) => ({ ...prev, [`${heading}-${subheadingFormData.currentSubheading || subheadingFormData.subheading}`]: false }));
      setSubheadingFormData({ heading: '', subheading: '', currentSubheading: '' });
    }
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
        <NavLink to="/dashboard/profile">
          <CgProfile className='text-[40px] cursor-pointer hover:text-blue-500 duration-200 transition-all' />
        </NavLink>
      </div>

      {/* Add Section Button */}
      {role !== "student" && (
        <div className='flex justify-start py-2 px-8'> {/* Reduced padding from py-4 to py-2 */}
          <button
            className='bg-black text-white py-2 px-4 flex justify-center items-center gap-2 hover:bg-gray-800 transition-all duration-200 rounded-full'
            onClick={() => setShowHeadingForm(true)}
          >
            <p>Add Module</p>
          </button>
        </div>
      )}

      {/* Lecture Content */}
      <div className='p-6'>
        {Object.keys(lectures).length > 0 ? (
          Object.entries(lectures).map(([heading, topics]) => (
            <div key={heading} className='mb-3'>
              {/* Heading Header */}
              <div
                className='w-[98%] py-3 ml-6 border-2 flex flex-col px-8 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200'
                onClick={() => toggleWeek(heading)}
              >
                <div className='flex justify-between w-full font-semibold'>
                  <span className='text-lg'>{heading}</span>
                  <div className='flex items-center gap-2'>
                    {role !== "student" && (
                      <button
                        className='bg-black text-white py-1 px-2 rounded-full hover:bg-gray-800 transition-all duration-200'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSubsectionClick(heading); // Open the modal
                        }}
                      >
                        Add Section
                      </button>
                    )}
                    <IoIosArrowDropdown
                      className={`text-[25px] transform transition-transform duration-500 ${
                        expandedWeeks[heading] ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Heading with Subheadings and Lectures */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedWeeks[heading] ? 'max-h-[1000px] opacity-100 py-3' : 'max-h-0 opacity-0'
                  }`}
                >
                  {Object.entries(topics).map(([subheading, lectures]) => (
                    <div key={subheading} className="mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg mb-2">{subheading}</h3>
                          {role !== "student" && (
                            <button
                              className='bg-gray-200 p-1 rounded-full hover:bg-gray-300 transition-all duration-200'
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent parent click
                                handleEditSubheadingClick(heading, subheading); // Use the function we defined instead of inline logic
                              }}
                            >
                              <FaRegEdit className='text-[14px]' />
                            </button>
                          )}
                        </div>
                        {role !== "student" && (
                          <button
                            className='bg-black text-white py-1 px-2 rounded-full hover:bg-gray-800 transition-all duration-200'
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent click
                              handleAddLecture(heading, subheading);
                            }}
                          >
                            Add Lecture
                          </button>
                        )}
                      </div>

                      {lectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className="ml-4 mb-2 flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <a
                            href={lecture.youtubeLink || '#'}
                            target={lecture.youtubeLink ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className={`text-blue-600 hover:underline ${!lecture.youtubeLink && 'cursor-not-allowed'}`}
                            onClick={(e) => {
                              
                              console.log('YouTube Link:', lecture.youtubeLink, typeof lecture.youtubeLink);

                                if (!lecture.youtubeLink || lecture.youtubeLink === "null") {
                                  e.preventDefault();
                                  showNotification('No video lecture uploaded', 'error');
                                }
                            }}
                          >
                            {lecture.lectureTitle}
                          </a>

                          <div className='flex gap-4 items-center'>
                            <button
                              onClick={(e) => downloadHandler(e, lecture.pdfUrls)} // Updated to handle multiple PDFs
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

      {/* Heading Form Modal */}
      {showHeadingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Module</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Module Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Module Name"
                  value={newHeadingData.heading}
                  onChange={(e) => setNewHeadingData({...newHeadingData, heading: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Section Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Section Name"
                  value={newHeadingData.subheading}
                  onChange={(e) => setNewHeadingData({...newHeadingData, subheading: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowHeadingForm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddHeading}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save Module
              </button>
            </div>
          </div>
        </div>
      )}

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
                
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Upload PDF Files
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => setPdfFiles(Array.from(e.target.files))}
                    className="w-full p-2 border rounded"
                    id="pdfFileInput"
                    style={{display: 'block'}}
                  />
                  {pdfFiles.length > 0 && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border">
                      <p className="text-sm font-medium text-gray-700 mb-1">Selected files:</p>
                      <ul className="max-h-24 overflow-y-auto">
                        {pdfFiles.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                            <FaFilePdf className="text-red-500" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <input
                  type="url"
                  placeholder="YouTube Link"
                  value={formData.youtubeLink}
                  onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
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

      {/* Delete Confirmation Modal */}
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

      {/* Subsection Form Modal */}
      {showSubsectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Section</h2>
            <form onSubmit={handleSubsectionFormSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={subsectionFormData.heading}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
                <input
                  type="text"
                  placeholder="Section Title"
                  value={subsectionFormData.subheading}
                  onChange={(e) =>
                    setSubsectionFormData({ ...subsectionFormData, subheading: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowSubsectionForm(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save Subsection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add the Edit Subheading Modal */}
      {Object.entries(showSubheadingForm).some(([key, value]) => value === true) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Section</h2>
            <form onSubmit={(e) => handleEditSubheadingSubmit(e, subheadingFormData.heading)}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Module Name</label>
                  <input
                    type="text"
                    value={subheadingFormData.heading}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Section Name</label>
                  <input
                    type="text"
                    placeholder="Edit Section Name"
                    value={subheadingFormData.subheading}
                    onChange={(e) => setSubheadingFormData({ ...subheadingFormData, subheading: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => {
                    // Close all subheading forms
                    const updatedForms = {};
                    Object.keys(showSubheadingForm).forEach(key => {
                      updatedForms[key] = false;
                    });
                    setShowSubheadingForm(updatedForms);
                    setSubheadingFormData({ heading: '', subheading: '', currentSubheading: '' });
                  }}
                > 
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}