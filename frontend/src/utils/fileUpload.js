/**
 * Utility functions for handling file uploads in the application
 */

/**
 * Creates a properly configured FormData object for file uploads
 * @param {File} file - The file to upload
 * @param {string} fieldName - The name of the form field (default: 'file')
 * @param {Object} additionalFields - Additional form fields to include
 * @returns {FormData} The configured FormData object
 */
export const createFileUploadFormData = (file, fieldName = 'file', additionalFields = {}) => {
  const formData = new FormData();
  
  // Add the file - Make sure it's a File object
  if (file instanceof File) {
    formData.append(fieldName, file);
    console.log(`File appended to FormData: ${file.name} (${file.size} bytes, ${file.type})`);
  } else {
    console.error('Not a valid File object:', file);
    throw new Error('Invalid file object provided');
  }
  
  // Add any additional fields
  Object.entries(additionalFields).forEach(([key, value]) => {
    formData.append(key, value);
    console.log(`Added form field: ${key}`);
  });
  
  return formData;
};

/**
 * Validates a file for CSV uploads with detailed logging
 * @param {File} file - The file to validate
 * @returns {Object} Result with isValid flag and any error message
 */
export const validateCSVFile = (file) => {
  // Log detailed file information for debugging
  console.log('Validating file:');
  console.log('- Name:', file?.name);
  console.log('- Size:', file?.size);
  console.log('- Type:', file?.type);
  
  if (!file) {
    console.error('No file provided');
    return { isValid: false, message: 'No file selected' };
  }
  
  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    console.error('File too large:', file.size);
    return { isValid: false, message: 'File size too large. Maximum size is 5MB.' };
  }
  
  // Check file type - be lenient with CSV files
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain', 'application/octet-stream'];
  const validExtensions = ['.csv', '.txt'];
  
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  console.log('File extension:', fileExtension);
  
  // Accept file if either the MIME type or extension is valid
  const validType = validTypes.includes(file.type);
  const validExtension = validExtensions.includes(fileExtension);
  
  if (!validType && !validExtension) {
    console.error('Invalid file type:', file.type, fileExtension);
    return { 
      isValid: false, 
      message: `Invalid file type. Please upload a CSV file. Received: ${file.type} with extension ${fileExtension}` 
    };
  }
  
  console.log('File validation passed');
  return { isValid: true };
};

/**
 * Configures Axios request options for file uploads with token handling
 * @param {string} authToken - Authentication token
 * @param {Function} onProgress - Optional progress callback
 * @returns {Object} Axios request configuration
 */
export const getFileUploadConfig = (authToken, onProgress = null) => {
  // Log token information (without revealing the full token)
  console.log('Configuring upload with token:', authToken ? `${authToken.substring(0, 10)}...` : 'No token');
  
  const config = {
    headers: {
      // Critical: Do NOT set Content-Type manually for FormData / file uploads
      // The browser will set the correct Content-Type with boundary for multipart/form-data
      // 'Content-Type': 'multipart/form-data', -- Remove this line
      'x-access-token': authToken,
      'Authorization': `Bearer ${authToken}`
    },
    timeout: 60000 // 60 seconds
  };
  
  if (onProgress && typeof onProgress === 'function') {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${percentCompleted}%`);
      onProgress(percentCompleted);
    };
  }
  
  return config;
};

/**
 * Full standalone upload function that handles all steps
 * @param {string} url - The URL to upload to
 * @param {File} file - The file to upload
 * @param {string} token - Authentication token
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise} Promise with upload result
 */
export const uploadCSVFile = async (url, file, token, onProgress = null) => {
  // Validate file
  const validation = validateCSVFile(file);
  if (!validation.isValid) {
    throw new Error(validation.message);
  }
  
  // Create FormData
  const formData = createFileUploadFormData(file);
  
  // Get config with auth and progress tracking
  const config = getFileUploadConfig(token, onProgress);
  
  // Log request details
  console.log(`Making upload request to ${url} with file ${file.name}`);
  
  // Make the request
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload failed:', errorData);
      throw new Error(errorData.message || 'Upload failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
