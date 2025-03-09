import React from 'react'
import { BsSend } from "react-icons/bs";

export default function ContactUs({name, email}) {
  return (
    <div className='h-full w-full flex items-center justify-center'>
        {/* <div className='w-[16%]'>
            <img src={imgMy} alt="" className='w-full rounded-full aspect-square'/>
            <p className='text-center text-[19px]'>Ved Prakash</p>
            <p className='text-center text-[19px] font-semibold'>vedprakash22@iitk.ac.in</p>
        </div> */}

        <div className='w-[80%] h-[80%] border rounded-xl shadow-lg'>
            <div className='h-[14%] m-auto flex flex-col justify-center items-center text-white text-[18px] bg-blue-500 rounded-4xl'>
                <p>Phone Numbers During Office Hours (10:00 Hrs.-18:00 Hrs) : 8xxxxxxxxx</p>
                <p>Email : trackit@gmail.com</p>
            </div>
            <div className='p-8'>
                <p className='text-[25px] font-semibold'>Contact Us</p>
                <div className='flex text-[17px] mt-4'>
                <p><span className='font-semibold'>Your Name:</span><br></br> {name}</p>
                <p className='ml-[45%]'><span className='font-semibold'>Your Email Address :</span> <br></br>  {email}</p>
                </div>

                <form>
                    <div className='mt-6'>
                        <label className='font-semibold' for="subject">Subject <span className='text-red-500'>*</span></label> <br></br>
                        <input type="text" placeholder='Subject' id='subject' className=' mt-1 w-full px-6 rounded-lg h-[40px]'/>
                    </div>
                    <div className='mt-4'>
                        <label for="message" className='font-semibold' >Message  <span className='text-red-500'>*</span></label> <br></br>
                        <textarea type="text" placeholder='Your Query' id='message' className=' mt-1 w-full px-6 py-2 rounded-lg h-[160px]'/>
                    </div>
                    <button className='bg-blue-500 shadow-xl text-white py-2 px-4 mt-4 flex justify-center items-center gap-2 hover:bg-green-600 hover:scale-95 transition-all duration-200 rounded'><BsSend></BsSend><p>Send Message</p></button>
                </form>
            </div>
        </div>
    </div>
  )
}
