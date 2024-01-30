import React, { useEffect, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BallTriangle } from 'react-loader-spinner';

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState('');
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  const postCollectionRef = collection(db, 'posts');

  const handleCreate = async (e) => {
    e.preventDefault();

    if (title === '' || post === '') {
      toast.error(<h3>Don't forget to provide information for all the mandatory fields.</h3>);
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        toast.error(<h3>User not authenticated.</h3>);
        return;
      }

      await addDoc(postCollectionRef, {
        title,
        post,
        authorId: user.uid,
        author: {
          id: user.uid,
          name: user.displayName || 'Anonymous', // You can use 'Anonymous' if displayName is not available
        },
      });

      navigate('/dashboard'); // Navigate to the dashboard page after creating the post

      toast.success(<h3>Post created successfully!</h3>);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(<h3>Oops! Something went wrong. Please try again later.</h3>);
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <div className="mt-28 flex items-center justify-center h-4/5">
        <div className="text-center">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#fff"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='mt-36 w-11/12 md:w-5/6 mx-auto'>
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
        <h2 className='mb-8 font-semibold text-slate-100 text-3xl'>Create a Post</h2>
        <div className="mb-5">
          <label htmlFor="text" className="block mb-2 text-slate-100 text-sm font-medium">Title</label>
          <input type="text" value={title} name="title" id="text" className="bg-violet-50 dark:bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-5">
          <label htmlFor="post" className="block mb-2 text-sm font-medium text-slate-100">Post</label>
          <textarea onChange={(e) => setPost(e.target.value)} value={post} id="post" name='post' rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-violet-50 dark:bg-slate-300 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Post..."></textarea>
        </div>

        <div>
          <button className="text-white bg-blue-700 dark:bg-blue-950 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={handleCreate}>Publish Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
