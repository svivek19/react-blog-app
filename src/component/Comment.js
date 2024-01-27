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
    <div>
      {isLoadingComments ? (
        <p>Loading comments...</p>
      ) : (
        comments.map(({ commentId, user, comment, userName }) => (
          <div key={commentId} className="mb-2">
            <p>
              <span className="font-bold">{userName}:</span> {comment}
            </p>
            {user === currentlyLoggedinUser?.uid && (
              <button onClick={() => delComment(commentId)} className="text-red-500">
                Delete
              </button>
            )}
          </div>
        ))
      )}

      {currentlyLoggedinUser && (
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          onKeyUp={(e) => handleChangeComment(e)}
        />
      )}
    </div>
  );
};

export default Comment;
