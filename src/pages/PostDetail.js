import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { BallTriangle } from 'react-loader-spinner';
import bg from '../assets/bg.webp';
import Comment from '../component/Comment';

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (isLoading) {
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

  if (!post) {
    return <div>Error loading post.</div>;
  }

  return (
    <div>
      <div>
        <img src={bg} alt="bg-img" className='object-cover w-full h-full' />
      </div>
      <div className='p-6'>

        <div className="container mx-auto">
          <div className="bg-violet-50 shadow-md p-4 mb-4 rounded-md">
            <h2 className="text-4xl font-bold mb-4 text-violet-950 text-center">{post.title}</h2>
            <p className="text-black font-semibold mb-4 leading-loose text-justify">{post.post}</p>
            <div className="md:flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm my-4 md:mb-0">
                Author: <span className="text-purple-700">{post.author?.name}</span>
              </p>
            </div>
          </div>
        </div>
        <div className='container mx-auto bg-violet-50 rounded-md'>
          <Comment postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
