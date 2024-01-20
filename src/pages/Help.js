import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const Help = () => {

  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: '',
  });

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const validateForm = () => {

      return (
        formData.user_name.trim() !== '' &&
        formData.user_email.trim() !== '' &&
        formData.message.trim() !== ''
      );
    };

    if (!validateForm()) {
      toast.error(
        <h3>Please fill out all required fields before submitting the form.</h3>
      );
      return;
    }

    const api1 = process.env.REACT_APP_FIRST;
    const api2 = process.env.REACT_APP_SECOND;
    const api3 = process.env.REACT_APP_THIRD;


    emailjs
      .sendForm(api1, api2, form.current, api3)
      .then(
        (result) => {
          console.log(result.text);
          console.log('message send');
          // Clear the form after successful submission
          setFormData({
            user_name: '',
            user_email: '',
            message: '',
          });
          toast.success(
            <h3>Thank you! Your information has been sent.</h3>
          );
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='w-11/12 md:w-5/6 mx-auto'>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeButton={true}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <form className='md:w-4/6 mx-auto' ref={form} onSubmit={sendEmail}>
        <h2 className='mb-8 font-semibold text-slate-800 text-3xl'>Contact Here!</h2>
        <div className="mb-5">
          <label htmlFor="text" className="block mb-2 text-slate-800 text-sm font-medium">Your Name</label>
          <input type="text" value={formData.user_name} name="user_name" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter your name.." onChange={handleChange} />
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-slate-800 text-sm font-medium">Your Email</label>
          <input type="email" value={formData.user_email} id="email" name="user_email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter your email.." onChange={handleChange} />
        </div>
        <div className='mb-5'>
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-slate-800">Message</label>
          <textarea onChange={handleChange} value={formData.message} id="message" name='message' rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="feel free to ask what you thing.."></textarea>
        </div>

        <div>
          <button value="Send" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Help
