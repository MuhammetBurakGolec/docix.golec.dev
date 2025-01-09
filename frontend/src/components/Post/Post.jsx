import React, { useState } from "react";
import { likePost, addComment } from "../../services/api";
import "./Post.css";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);

  const handleLike = async () => {
    try {
      setLocalLikes(prev => prev + 1);
      await likePost(post.id, { ...post, likes: localLikes + 1 });
    } catch (error) {
      setLocalLikes(prev => prev - 1);
      console.error("Beğeni eklenirken hata oluştu:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment(post.id, comment);
      setComment("");
      setIsCommenting(false);
    } catch (error) {
      console.error("Yorum eklenirken hata oluştu:", error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user">
          <div className="user-avatar">
            {post.author ? post.author[0].toUpperCase() : "U"}
          </div>
          <span className="user-name">{post.author || "Anonim"}</span>
        </div>
        <span className="post-date">
          {new Date(post.createdAt || Date.now()).toLocaleDateString('tr-TR')}
        </span>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <button 
          className={`action-button like-button ${localLikes > 0 ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{localLikes}</span>
        </button>

        <button 
          className="action-button comment-button"
          onClick={() => setIsCommenting(!isCommenting)}
        >
          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {isCommenting && (
        <form onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            className="comment-input"
          />
          <button type="submit" className="submit-comment">
            Gönder
          </button>
        </form>
      )}

      {post.comments && post.comments.length > 0 && (
        <div className="comments-section">
          {post.comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-avatar">
                {comment.author ? comment.author[0].toUpperCase() : "U"}
              </div>
              <div className="comment-content">
                <span className="comment-author">{comment.author || "Anonim"}</span>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;