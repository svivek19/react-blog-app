import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
// loading animation
import { BallTriangle } from 'react-loader-spinner';

const Home = ({ isAuth }) => {

  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const postsCollectionRef = collection(db, 'posts');

  const getPosts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(postsCollectionRef);
      const posts = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPostList(posts);
      // console.log(posts);
    } catch (error) {
      console.error('Error getting posts: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);


  const handleDelete = async (id) => {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
    getPosts();
  }

  const toggleReadMore = (postId) => {
    setPostList((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
      )
    );
  };

  if (loading) {
    return (
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
    )
  }


  return (
    <div className="container mx-auto p-4 bg-gray-100">
      {postList.length === 0 ? (
        <h3 className="text-xl font-bold mb-4">No posts added!</h3>
      ) : (
        postList.map((post) => (
          <div key={post.id} className="bg-white shadow-md p-4 mb-4">
            <h2 className="text-lg font-bold mb-2 text-indigo-700">{post.title}</h2>
            <p className="text-gray-700 mb-4">
              {post.isExpanded ? post.post : `${post.post.slice(0, 100)}...`}
            </p>
            <div className="md:flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm mb-2 md:mb-0">
                Author: <span className="text-purple-700">{post.author?.name}</span>
              </p>
            </div>
            <button
              className="text-blue-500 hover:underline cursor-pointer text-sm"
              onClick={() => toggleReadMore(post.id)}
            >
              {post.isExpanded ? 'Read less' : 'Read more'}
            </button>
          </div>
        ))
        
      )}
    </div>
  )
}

export default Home
