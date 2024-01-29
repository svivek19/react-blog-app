import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { BallTriangle } from 'react-loader-spinner';

const UserProfileCard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    // Simulate a 2-second loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const displayName = user ? (user.displayName || 'User') : 'User';
  const email = user ? (user.email || 'abc@gmail.com') : 'abc@gmail.com';
  const photoURL = user ? (user.photoURL || '') : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png';

  return (
    <div className="flex flex-col justify-center w-96 mx-auto p-6 shadow-md rounded-xl sm:px-12 mt-28 md:mt-36 bg-violet-50">
      {isLoading ? (
        <div className="flex items-center justify-center h-4/5">
          <div className="text-center">
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#1d1d1d"
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        </div>
      ) : (
        <>
          <h1 className='text-center text-slate-700 text-3xl uppercase font-medium mb-6'>Profile</h1>
          <img
            src={photoURL}
            alt="avatar"
            className="w-28 h-28 mx-auto rounded-full dark:bg-gray-500 mb-3 aspect-square"
          />
          <div className="space-y-4 text-center divide-y dark:divide-gray-700">
            <div className="my-2 space-y-5">
              <h2 className="text-xl font-semibold sm:text-2xl">{displayName}</h2>
              <p className="px-5 text-xs sm:text-base">{email}</p>
            </div>
            <div className="flex justify-center pt-4 space-x-4 align-center">
              <a href='https://github.com/svivek19' target='_blank' className='px-6 font-semibold  py-2 bg-gray-800 text-white rounded-md'>GitHub</a>
              <a href='https://www.linkedin.com/in/svivek018/' target='_blank' className='px-4 font-semibold  py-2 bg-[royalblue] text-white rounded-md'>LinkedIn</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileCard;
