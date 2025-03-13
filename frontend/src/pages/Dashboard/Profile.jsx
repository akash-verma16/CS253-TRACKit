import React from 'react'
import imgMy from '../../assets/ved.png'
import texture from '../../assets/textures.jpg'

const user = JSON.parse(localStorage.getItem('user'));

export default function Profile() {
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
            <img src={imgMy} alt="img" className='w-[130px] aspect-square rounded-full absolute right-[42%] top-[29%]' />

            <div>
                <p className='text-[50px] mt-[60px] text-center'> {user.firstName} {user.lastName}</p>
                <p className='text-center text-[18px] mt-6'>
                    <span className='font-bold'>Roll No :</span> <span>220024</span>
                </p>
                <p className='text-center text-[18px] mt-2'>
                    <span className='font-bold'>Department :</span> <span>EE</span>
                </p>
            </div>
        </div>
      
    </div>
  )
}
