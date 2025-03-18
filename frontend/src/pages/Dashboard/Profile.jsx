import React, { useEffect, useState } from 'react';
import imgMy from '../../assets/ved.png';
import texture from '../../assets/textures.jpg';
import { authFetch } from '../../services/auth';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get basic user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Fetch complete profile data including student/faculty specific information
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
          // Select the right endpoint based on user type
          const endpoint = user.userType === 'student' 
            ? `/api/student/${user.id}/profile`
            : user.userType === 'faculty' 
              ? `/api/faculty/${user.id}/profile`
              : `/api/users/${user.id}`;
          
          const result = await authFetch(endpoint);
          console.log('Profile API Response:', result);
          
          if (result.success) {
            // Merge the data with what we have in localStorage to ensure we have everything
            setProfileData({...user, ...result.data});
            
            // Update localStorage with more complete data
            localStorage.setItem('user', JSON.stringify({...user, ...result.data}));
          } else {
            setError('Failed to load complete profile data');
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Error loading profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user?.id, user?.userType]);
  
  // Use the combined data or fall back to localStorage data
  const displayData = profileData || user;
  
  console.log('Profile data:', displayData);
    
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='relative w-[80%] h-[80%] border shadow-2xl rounded-xl'>
            <div 
              className='h-[40%] w-full rounded-4xl'
              style={{ 
                backgroundImage: `url(${texture})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            >
            </div>
            <img src={imgMy} alt="img" className='flex flex-col items-start w-[130px] aspect-square rounded-full absolute right-[42%] top-[29%]' />

            <div>
                <p className='text-[50px] mt-[60px] text-center'>{displayData?.firstName} {displayData?.lastName}</p>
                
                {loading && <p className="text-center">Loading profile information...</p>}
                
                {/* Only show error if we don't have displayData */}
                {error && !displayData && <p className="text-center text-red-500">{error}</p>}
                
                {/* Show student-specific information */}
                {displayData?.userType === 'student' && (
                    <div >
                        <p className='text-center text-[18px] mt-6'>
                            <span className='font-bold'>Roll No :</span> <span>{displayData.rollNumber}</span>
                        </p>
                        <p className='text-center text-[18px] mt-2'>
                            <span className='font-bold'>Department :</span> <span>{displayData.major}</span>
                        </p>
                        {/* <p className='text-center text-[18px] mt-2'>
                            <span className='font-bold'>Year :</span> <span>{displayData.enrollmentYear}</span>
                        </p> */}
                    </div>
                )}
                
                {/* Show faculty-specific information */}
                {displayData?.userType === 'faculty' && (
                    <>
                        <p className='text-center text-[18px] mt-6'>
                            <span className='font-bold'>Department :</span> <span>{displayData.department}</span>
                        </p>
                        <p className='text-center text-[18px] mt-2'>
                            <span className='font-bold'>Position :</span> <span>{displayData.position}</span>
                        </p>
                    </>
                )}
                
                {/* Generic information for all users */}
                {/* <p className='text-center text-[18px] mt-2'>
                    <span className='font-bold'>Email :</span> <span>{displayData?.email}</span>
                </p> */}
            </div>
        </div>
    </div>
  )
}