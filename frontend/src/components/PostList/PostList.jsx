import React, { useEffect, useState } from "react";
import { fetchPosts } from "../../services/api";
import Post from "../Post/Post";
import "./PostList.css";

const PostList = ({ viewMode }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        setPosts(Array.isArray(response) ? response.reverse() : []);
      } catch (error) {
        setError("Gönderiler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Gönderiler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={`posts-container ${viewMode}`}>
      {posts.length === 0 ? (
        <div className="no-posts">
          <svg className="no-posts-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>Henüz hiç gönderi yok</p>
        </div>
      ) : (
        <div className={`posts-${viewMode}`}>
          {posts.map((post) => (
            <Post key={post.id} post={post} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;