import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Edit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setTitle(postData.title);
          setContent(postData.post);
        } else {
          console.error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post data: ', error);
      }
    };

    fetchData();
  }, [postId]);

  const handleUpdate = async () => {
    try {
      const postDocRef = doc(db, 'posts', postId);
      await updateDoc(postDocRef, {
        title,
        post: content,
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating post: ', error);
    }
  };

  return (
    <div className='w-11/12 md:w-5/6 mx-auto'>
      <div className='md:w-4/6 mx-auto'>
        <h2 className='mb-8 font-semibold text-slate-800 text-3xl'>Edit Post</h2>
        <div className="mb-5">
          <label htmlFor="text" className="block mb-2 text-slate-800 text-sm font-medium">Title</label>
          <input type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='mb-5'>
          <label htmlFor="post" className="block mb-2 text-sm font-medium text-slate-800">Content</label>
          <textarea id="post" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>

        <div>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={handleUpdate}>Update Post</button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
