import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SimpleMDE from 'react-simplemde-editor';
import ReactMarkdown from 'react-markdown';
import 'easymde/dist/easymde.min.css';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [editingBody, setEditingBody] = useState(false);
  const [loading, setLoading] = useState(false);
  const editedBodyRef = useRef('');
  const token = localStorage.getItem('token');
  const userId = useRef(null);

  // Get current user's ID from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        userId.current = decoded.id;
      } catch (err) {
        console.error('Token decode failed:', err);
      }
    }
  }, [token]);

  // Fetch post initially
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/blogs/${id}`);
        const postData = res.data;

        if (!postData.headerImage) {
          const match = postData.body.match(/!?\[.*?\]\((.*?)\)/);
          postData.headerImage = match ? match[1] : null;
        }

        setPost(postData);
        editedBodyRef.current = postData.body;
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Post not found.');
      }
    };
    fetchPost();
  }, [id]);

  const isAuthor = post?.author?._id === userId.current;

  const updatePostState = (updatedData) => {
    setPost((prev) => ({
      ...prev,
      ...updatedData,
      author: prev.author, // Retain original author info
    }));
    editedBodyRef.current = updatedData.body || prev.body;
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5050/api/blogs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updatePostState(res.data);
    } catch (err) {
      alert('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5050/api/blogs/${id}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updatePostState(res.data);
      setComment('');
    } catch (err) {
      alert('Failed to comment');
    } finally {
      setLoading(false);
    }
  };

  const handleBodySave = async () => {
    const updatedBody = editedBodyRef.current;
    if (updatedBody !== post.body) {
      try {
        const res = await axios.put(
          `http://localhost:5050/api/blogs/${id}`,
          { body: updatedBody },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updatePostState(res.data);
      } catch (err) {
        alert('Failed to update post');
      }
    }
    setEditingBody(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5050/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Post deleted successfully!');
      navigate('/posts');
    } catch (err) {
      alert('Failed to delete post');
      console.error(err);
    }
  };

  const renderHeaderMedia = (url) => {
    if (!url) return null;
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
    return isVideo ? (
      <video
        src={url}
        controls
        style={{
          width: '100%',
          maxHeight: '300px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}
      />
    ) : (
      <img
        src={url}
        alt="Header"
        style={{
          width: '100%',
          maxHeight: '300px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}
      />
    );
  };

  if (!post) {
    return <p style={{ padding: '2rem' }}>Loading post...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{post.title}</h1>
      <p style={{ margin: '0 0 4px', color: '#555', fontSize: '0.9rem' }}>
        {new Date(post.createdAt).toLocaleString()}
      </p>
      <p style={{ fontStyle: 'italic', color: '#555' }}>
        Author: {post.author?.name || 'Unknown'}
      </p>

      {renderHeaderMedia(post.headerImage)}

      {editingBody && isAuthor ? (
        <>
          <SimpleMDE
            value={editedBodyRef.current}
            onChange={(value) => {
              editedBodyRef.current = value;
            }}
            options={{
              placeholder: 'Edit your post...',
              spellChecker: false,
              autofocus: true,
              forceSync: true,
              toolbar: [
                'bold', 'italic', 'heading', '|',
                'quote', 'unordered-list', 'ordered-list', '|',
                {
                  name: 'upload-media',
                  action: async function customFunction(editor) {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*,video/*';
                    input.style.display = 'none';

                    input.onchange = async () => {
                      const file = input.files[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('upload_preset', 'blog_upload');

                      try {
                        const res = await axios.post(
                          'https://api.cloudinary.com/v1_1/dgymlgxlf/upload',
                          formData
                        );
                        const url = res.data.secure_url;
                        const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        const syntax = isImage
                          ? `![alt text](${url})`
                          : `[Video File](${url})`;

                        const cm = editor.codemirror;
                        const doc = cm.getDoc();
                        const cursor = doc.getCursor();
                        doc.replaceRange(syntax + '\n', cursor);
                        doc.setCursor({ line: cursor.line + 1, ch: 0 });
                      } catch (err) {
                        console.error('Media upload failed:', err);
                        alert('Media upload failed');
                      }
                    };

                    document.body.appendChild(input);
                    input.click();
                    document.body.removeChild(input);
                  },
                  className: 'fa fa-upload',
                  title: 'Upload Media',
                },
                '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'
              ]
            }}
          />
          <button
            onClick={handleBodySave}
            style={{
              marginTop: '0.5rem',
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </>
      ) : (
        <div
          style={{ marginTop: '1rem', cursor: isAuthor ? 'pointer' : 'default' }}
          onClick={() => {
            if (isAuthor) {
              editedBodyRef.current = post.body;
              setEditingBody(true);
            }
          }}
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => {
                const isVideo = props.href.match(/\.(mp4|webm|ogg)$/i);
                return isVideo ? (
                  <video
                    src={props.href}
                    controls
                    style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }}
                  />
                ) : (
                  <a {...props} target="_blank" rel="noopener noreferrer">{props.children}</a>
                );
              }
            }}
          >
            {
              post.body.replace(
                /!?\[.*?\]\((.*?)\)/,
                (match, url) => (url === post.headerImage ? '' : match)
              )
            }
          </ReactMarkdown>
        </div>
      )}

      {post.tags?.length > 0 && (
        <p style={{ marginTop: '1rem' }}>
          <strong>Tags:</strong> {post.tags.join(', ')}
        </p>
      )}

      <button onClick={handleLike} style={{ marginTop: '1rem' }}>
        ❤️ {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
      </button>

      {isAuthor && (
        <button
          onClick={handleDelete}
          style={{
            marginTop: '1rem',
            marginLeft: '1rem',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete Post
        </button>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Comments</h3>
        {post.comments.length === 0 && <p>No comments yet.</p>}
        {post.comments.map((c, i) => (
          <div key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
            <p><strong>{c.user?.name || 'Anonymous'}</strong>:</p>
            <p>{c.text}</p>
          </div>
        ))}
        <form onSubmit={handleComment} style={{ marginTop: '1rem' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            rows={3}
            required
            style={{ width: '100%', padding: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}
