import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { BallTriangle } from 'react-loader-spinner';
import EmptyPage from '../component/EmptyPage'

const Home = () => {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const postsCollectionRef = collection(db, 'posts');

  const getPosts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(postsCollectionRef);
      const posts = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPostList(posts);
    } catch (error) {
      console.error('Error getting posts: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (loading) {
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
    )
  }

  return (
    <div className="container mt-28 mx-auto p-2 bg-gray-50 rounded-md">
      {postList.length === 0 ? (
        <EmptyPage/>
      ) : (
        postList.map((post) => (
          <article key={post.id} className="flex bg-white transition mb-4 hover:shadow-xl">
            <div className="flex flex-1 flex-col justify-between">
              <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                <h3 className="font-bold text-2xl uppercase text-gray-900">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                  {post.isExpanded ? post.post : `${post.post.slice(0, 150)}...`}
                </p>


                <p className="text-gray-500 mt-5 text-sm mb-2 md:mb-0">
                  Author: <span className="text-purple-700">{post.author?.name}</span>
                </p>
              </div>

              <div className="sm:flex sm:items-end sm:justify-end">
                <Link
                  to={`/post/${post.id}`}
                  className="block bg-yellow-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
                >
                  Read Blog
                </Link>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  )
}

export default Home;
