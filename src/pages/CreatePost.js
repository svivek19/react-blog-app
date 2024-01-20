import React, { useEffect, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const CreatePost = ({isAuth}) => {
  const [title, setTitle] = useState('');
  const [post, setPost] = useState('');

  let navigate = useNavigate();

  const postCollectionRef = collection(db, 'posts');
  const handleCreate = async (e) => {
    e.preventDefault();
    if (title === '' || post === '') {
      toast.error(
        <h3>Don't forget to provide information for all the mandatory fields.</h3>
      );
      return false;
    } else {
      try {
        await addDoc(postCollectionRef, {
          title, post,
          author: {
            name: auth.currentUser.displayName,
            id: auth.currentUser.uid
          }
        })
        navigate('/')
        console.log(auth);
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(()=>{
    if(!isAuth){
      navigate('/login');
    }
  })

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
      <form className='md:w-4/6 mx-auto'>
        <h2 className='mb-8 font-semibold text-slate-800 text-3xl'>Create a Post</h2>
        <div className="mb-5">
          <label htmlFor="text" className="block mb-2 text-slate-800 text-sm font-medium">Title</label>
          <input type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='mb-5'>
          <label htmlFor="post" className="block mb-2 text-sm font-medium text-slate-800">Post</label>
          <textarea id="post" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Post..." onChange={(e) => setPost(e.target.value)}></textarea>
        </div>

        <div>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={handleCreate}>Publish Post</button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
