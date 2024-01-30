import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { arrayUnion } from "firebase/firestore";

const Comment = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const authInstance = getAuth();
  const [currentlyLoggedinUser, setCurrentlyLoggedinUser] = useState(null);
  const commentRef = doc(db, 'posts', postId);

  useEffect(() => {
    const docRef = doc(db, "posts", postId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setComments(snapshot.data().comments || []);
        setIsLoadingComments(false);
      } else {
        console.error('Post not found.');
      }
    });

    const authUnsubscribe = onAuthStateChanged(authInstance, (user) => {
      setCurrentlyLoggedinUser(user);
    });

    return () => {
      unsubscribe(); // Cleanup subscription on unmount
      authUnsubscribe(); // Cleanup auth subscription on unmount
    };
  }, [postId, authInstance]);

  const delComment = async (commentId) => {
    try {
      await updateDoc(commentRef, {
        comments: comments.filter(comment => comment.commentId !== commentId)
      });
    } catch (error) {
      console.error('Error deleting comment: ', error);
    }
  };

  const handleChangeComment = (e) => {
    if (e.key === 'Enter' && comment.trim() !== "") {
      updateDoc(commentRef, {
        comments: arrayUnion({
          commentId: Date.now(),
          user: currentlyLoggedinUser ? currentlyLoggedinUser.uid : null,
          userName: currentlyLoggedinUser ? currentlyLoggedinUser.displayName : "Anonymous",
          comment: comment.trim(),
          createdAt: new Date(),
        })
      }).then(() => {
        setComment("");
      });
    }
  };

  return (
    <div>
  <h3 className="text-center leading-loose text-3xl text-violet-950 font-bold">Comments</h3>
  <div className="mb-3">
    <input
      type="text"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder={
        currentlyLoggedinUser
          ? "Add a comment..."
          : "Login to add a comment"
      }
      className={`mt-4 p-4 w-full border rounded-md ${currentlyLoggedinUser ? 'bg-blue-100' : 'bg-gray-200'}`}
      onKeyUp={(e) =>
        currentlyLoggedinUser ? handleChangeComment(e) : null
      }
      disabled={!currentlyLoggedinUser}
    />
  </div>

  {isLoadingComments ? (
    <p className="text-center text-gray-500">Loading comments...</p>
  ) : (
    comments.map(({ commentId, user, comment, userName }, index) => (
      <div key={commentId} className={`mb-4 p-4 border rounded-lg md:flex justify-between items-center overflow-hidden ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} shadow-md hover:shadow-lg transition duration-300`}>
        <div className="text-gray-700">
          <span className="font-bold text-indigo-900">{userName}:</span>
          <p className="font-medium mt-1 text-gray-900">{comment}</p>
        </div>
        {user === currentlyLoggedinUser?.uid && (
          <button
            onClick={() => delComment(commentId)}
            className="px-4 py-2 border mt-2 md:mt-0 text-white bg-red-500 rounded-md transition duration-300 hover:bg-red-500 hover:text-white focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200"
          >
            Delete
          </button>
        )}
      </div>
    ))
  )}
</div>



  );
};

export default Comment;