import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { BallTriangle } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import EmptyPage from '../component/EmptyPage';

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
        // Display a confirmation message using SweetAlert
        const result = await Swal.fire({
            title: "Are you sure you want to delete this blog?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        // If the user confirms the deletion
        if (result.isConfirmed) {
            try {
                const postDoc = doc(db, 'posts', id);
                await deleteDoc(postDoc);
                setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
                Swal.fire("Deleted!", "Your blog has been deleted.", "success");
            } catch (error) {
                console.error('Error deleting the post: ', error);
                Swal.fire("Error", "An error occurred while deleting the blog.", "error");
            }
        }
    };

    return (
        <div className="mt-28 bg-gray-50 container mx-auto p-2 rounded-md">
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
                        <EmptyPage/>
                    ) : (
                        userPosts.map((post) => (
                            <div key={post.id} className="w-full px-8 py-4 mb-3 bg-white rounded-lg shadow-md items-center">
                                <div className="md:flex justify-between">
                                    <div className="mt-2">
                                        <h2 className="text-xl font-bold text-gray-700" tabIndex="0">{post.title}</h2>
                                        <p className="mt-2 text-gray-600 text-justify mb-3">{post.isExpanded ? post.post : `${post.post.slice(0, 100)}...`}</p>
                                    </div>
                                    <div>
                                        <Link to={`/edit/${post.id}`} className="bg-slate-800 mr-2 px-3 py-1 text-white rounded-md text-sm" tabIndex="0" role="button">Edit</Link>
                                        <button className="bg-red-500 px-3 py-1 text-white rounded-md text-sm mr-2" tabIndex="0" onClick={() => handleDelete(post.id)}>Delete</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline" tabIndex="0">Read more</Link>
                                    <div className=" items-center">
                                        <p className="font-medium text-slate-500 cursor-pointer" tabIndex="0">~{post?.author.name}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
