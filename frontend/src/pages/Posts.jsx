import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getHeaderMedia = (body) => {
    const mediaRegex = /!?\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = mediaRegex.exec(body)) !== null) {
      const url = match[1];
      const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
      if (isVideo || isImage) return url;
    }
    return null;
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/blogs');
      setPosts(res.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      alert('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchPosts();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCreatePost = () => {
    navigate('/posts/new');
  };

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`);
  };

  return (
    <div style={{ padding: '1rem', color: 'black' }}>
      <h1 style={{ color: 'black' }}>All Posts</h1>
      <button onClick={handleCreatePost} style={{ marginRight: 10, cursor: 'pointer' }}>
        + New Post
      </button>
      <button onClick={handleSignOut} style={{ cursor: 'pointer' }}>
        Sign Out
      </button>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          {posts.map((post) => {
            const headerMedia = getHeaderMedia(post.body);
            const isVideo = headerMedia?.match(/\.(mp4|webm|ogg)$/i);
            return (
              <div
                key={post._id}
                onClick={() => handlePostClick(post._id)}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  color: '#000'
                }}
              >
                {headerMedia && (
                  isVideo ? (
                    <video
                      src={headerMedia}
                      controls
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                      }}
                    />
                  ) : (
                    <img
                      src={headerMedia}
                      alt="Header"
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                      }}
                    />
                  )
                )}
                <div style={{ padding: '10px', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 4px', color: '#000' }}>{post.title}</h3>
                  <p style={{ margin: '0 0 4px', color: '#333', fontSize: '0.9rem' }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>
                    By: {post.author?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
