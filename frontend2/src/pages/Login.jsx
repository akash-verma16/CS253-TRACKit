import React from 'react'
import loginImg from '../assets/login.png';

export default function Login() {
  return (
    <div className='w-full h-screen relative flex justify-around items-center'>
        <img src={loginImg} className='absolute h-full w-full z-[-100]' />
        <div className='h-full absolute w-[40%] left-[100px]'>
            <h1 className='text-[60px] font-[800] top-[60px] absolute'>TRACKit</h1>
            <p className='absolute top-[140px] w-full font-semibold'>Testing Reporting Academic Comprehensive Kit</p>
        </div>

        <div className='bg-white w-[30%] rounded-xl h-[97%] flex flex-col justify-center items-center absolute right-5'>
          <div className='w-[80%]'>
            <p className='font-semibold text-[28px]'>Welcome to TRACKit</p>
            <h1 className='text-[30px] mt-2'>Sign In</h1>
          </div>
        
            <form className='flex flex-col items-start gap-3 w-[80%] relative'>
                <input type="text" placeholder='Enter Your User Id' className=' h-[40px] w-full bg-[#F5F5F5] px-[25px] rounded-lg mt-6'/>
                <input type="text" placeholder='Enter Your Password' className='h-[40px] w-full bg-[#F5F5F5] px-[25px] rounded-lg mt-1'/>
                <a href="#" className='text-blue-500 text-[13px] absolute right-0 bottom-[52px] hover:scale-105 duration-200 transition-all'>Forgot Password</a>
                <button className='bg-black text-white w-full mt-5 h-[40px] rounded-lg transition-all duration-200 hover:scale-95'>Continue</button>
            </form>
        </div>
    </div>
  )
}
