import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { BallTriangle } from 'react-loader-spinner';
import bg from '../assets/bg.webp';
import Comment from '../component/Comment';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(true);

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

    const fetchComments = async () => {
      try {
        const commentsQuery = query(
          collection(db, 'comments'),
          where('postId', '==', postId),
          orderBy('timestamp', 'asc')
        );

        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
          const commentsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setComments(commentsData);
          setIsCommentLoading(false);
        });

        // Cleanup function to unsubscribe when component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error('Error getting comments: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  if (isLoading || isCommentLoading) {
    return (
      <div className="mt-28 flex items-center justify-center h-4/5">
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

      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md p-4 mb-4">
          <h2 className="text-4xl font-bold mb-4 text-indigo-700 text-center">{post.title}</h2>
          <p className="text-gray-700 mb-4 leading-loose text-justify">{post.post}</p>
          <div className="md:flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm my-4 md:mb-0">
              Author: <span className="text-purple-700">{post.author?.name}</span>
            </p>
          </div>
          <div className='mt-4'>
            <Comment postId={postId} />
            <h3 className="text-lg font-bold mb-2">Comments:</h3>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id}>{comment.text}</li>
                  // Display other comment details as needed
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
