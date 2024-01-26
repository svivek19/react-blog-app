// postdetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { BallTriangle } from 'react-loader-spinner';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          setPost({ ...postDoc.data(), id: postDoc.id });
        } else {
          console.error('Post not found.');
        }
      } catch (error) {
        console.error('Error getting post: ', error);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    // Simulate a 2-second loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  if (!post) {
    return <div className="flex items-center justify-center h-4/5">
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
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <div className="bg-white shadow-md p-4 mb-4">
        <h2 className="text-lg font-bold mb-2 text-indigo-700">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.post}</p>
        <div className="md:flex items-center justify-between mb-2">
          <p className="text-gray-500 text-sm mb-2 md:mb-0">
            Author: <span className="text-purple-700">{post.author?.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
