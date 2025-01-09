import React, { useState } from "react";
import { createPost } from "../../services/api";
import "./AddPost.css";

const AddPost = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) {
      setError("Başlık ve içerik boş olamaz.");
      return;
    }
    const tagsArray = tags.split(',').map(tag => tag.trim());
    try {
      await createPost({ title, content, tags: tagsArray, likes: 0, comments: [] });
      setContent("");
      setTitle("");
      setTags("");
      setError(null);
    } catch (err) {
      setError("Gönderi oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <div className="add-post-container">
      <h2 style={{marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)'}}>Yeni Gönderi Oluştur</h2>
      <form onSubmit={handleSubmit} className="add-post-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          className="post-title-input"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="post-textarea"
          placeholder="Düşüncelerinizi paylaşın..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          required
        />
        <input
          type="text"
          className="post-tags-input"
          placeholder="Etiketler (virgülle ayırın)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button 
          type="submit" 
          className="post-button"
          disabled={!content.trim() || !title.trim()}
        >
          Paylaş
        </button>
      </form>
    </div>
  );
};

export default AddPost;