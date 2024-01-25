//dashboard.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { BallTriangle } from 'react-loader-spinner';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                // Fetch posts from Firebase for the authenticated user
                const userPostsCollectionRef = collection(db, 'posts');
                const querySnapshot = await getDocs(userPostsCollectionRef);

                const posts = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }))
                    .filter((post) => post.author?.id === auth.currentUser?.uid);

                setUserPosts(posts);
            } catch (error) {
                console.error('Error getting user posts: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    const handleDelete = async (id) => {
        const postDoc = doc(db, 'posts', id);
        await deleteDoc(postDoc);
        setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    };

    return (
        <div className="container mx-auto p-4 bg-gray-100">
            {loading ? (
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
                <div>
                    {userPosts.length === 0 ? (
                        <h3 className="text-xl font-bold mb-4">No posts added!</h3>
                    ) : (
                        userPosts.map((post) => (
                            <div key={post.id} className="bg-white shadow-md p-4 mb-4">
                                <h2 className="text-lg font-bold mb-2 text-indigo-700">{post.title}</h2>
                                <p className="text-gray-700 mb-4">{post.post}</p>
                                <div className="md:flex items-center justify-between mb-2">
                                    <p className="text-gray-500 text-sm mb-2 md:mb-0">
                                        Author: <span className="text-purple-700">{post.author?.name}</span>
                                    </p>
                                    <div className="flex">
                                        <button
                                            className="bg-red-500 px-3 py-1 text-white rounded-md text-sm mr-2"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            to={`/edit/${post.id}`}
                                            className="bg-slate-800 px-3 py-1 text-white rounded-md text-sm"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )
            }
        </div >
    );
};

export default Dashboard;
