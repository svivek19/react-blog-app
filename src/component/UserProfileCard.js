import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const UserProfileCard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
    });
  };

  const displayName = user ? (user.displayName || 'User') : 'User';
  const email = user ? (user.email || 'abc@gmail.com') : 'abc@gmail.com';
  const photoURL = user ? (user.photoURL || '') : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'; // You can set a default empty avatar here

  return (
    <div className="flex flex-col justify-center w-96 mx-auto p-6 shadow-md rounded-xl sm:px-12 mt-28 md:mt-36 md:bg-slate-100">
      <h1 className='text-center text-3xl uppercase font-medium mb-6'>Profile</h1>
      <img
        src={photoURL}
        alt=""
        className="w-28 h-28 mx-auto rounded-full dark:bg-gray-500 mb-3 aspect-square"
      />
      <div className="space-y-4 text-center divide-y dark:divide-gray-700">
        <div className="my-2 space-y-5">
          <h2 className="text-xl font-semibold sm:text-2xl">{displayName}</h2>
          <p className="px-5 text-xs sm:text-base">{email}</p>
        </div>
        <div className="flex justify-center pt-4 space-x-4 align-center">
          <button className='px-6 font-semibold uppercase py-2 bg-slate-800 text-white rounded-md'>Edit</button>
          <button onClick={handleLogout} className='px-4 font-semibold uppercase py-2 bg-red-600 text-white rounded-md'>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
