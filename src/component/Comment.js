import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
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
    <div className="mt-6">
      <h3 className="text-center text-2xl text-slate-800">Comments</h3>
      <div className="mb-3">
        {currentlyLoggedinUser && (
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="mt-4 p-2 w-full border rounded-md"
            onKeyUp={(e) => handleChangeComment(e)}
          />
        )}
      </div>

      {isLoadingComments ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : (
        comments.map(({ commentId, user, comment, userName }) => (
          <div key={commentId} className="mb-2 border p-3 rounded-lg md:flex justify-between overflow-x-hidden">
            <p className="text-gray-700 whitespace-pre-wrap">
              <span className="font-bold text-indigo-900">{userName}:</span> {comment}
            </p>
            {user === currentlyLoggedinUser?.uid && (
              <button
                onClick={() => delComment(commentId)}
                className="text-red-500 inline-block px-3 py-1 border border-red-500 rounded-md transition duration-300 hover:bg-red-500 mt-4 md:mt-0 hover:text-white focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200"
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
