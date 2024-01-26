import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Comment = ({ postId }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Add comment to Firestore
    try {
      const commentsCollectionRef = collection(db, 'comments');
      await addDoc(commentsCollectionRef, {
        postId,
        text: commentText,
        // Add other fields like author, timestamp, etc.
        timestamp: serverTimestamp(),
      });

      // Clear the comment input after submission
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  return (
    <div className="p-4 rounded-md shadow-md">
      <form onSubmit={handleCommentSubmit}>
        <textarea
          className="w-full p-2 mb-2 border rounded-md"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          rows="4"
          cols="50"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          Submit Comment
        </button>
      </form>
    </div>

  );
};

export default Comment;
