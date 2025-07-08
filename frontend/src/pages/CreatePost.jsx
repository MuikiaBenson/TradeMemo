import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import ReactMarkdown from 'react-markdown';
import 'easymde/dist/easymde.min.css';

export default function CreatePost() {
  const [formData, setFormData] = useState({ title: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bodyRef = useRef('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleBodyChange = (value) => {
    bodyRef.current = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a post.');
      navigate('/');
      return;
    }

    try {
      const postPayload = {
        title: formData.title,
        body: bodyRef.current,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      await axios.post('http://localhost:5050/api/blogs', postPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Post created successfully!');
      navigate('/posts');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: 'white', color: 'black' }}>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 1000, marginTop: 20 }}>
        {/* Title Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: 'black' }}>Title</label><br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc',
              color: 'black'
            }}
          />
        </div>

        {/* Body Editor and Preview */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: 'black' }}>Body (Markdown Supported)</label><br />
            <SimpleMDE
              value={bodyRef.current}
              onChange={handleBodyChange}
              options={{
                spellChecker: false,
                placeholder: 'Write your post here...',
                autofocus: false,
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
          </div>

          {/* Markdown Preview */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              overflowY: 'auto',
              maxHeight: '400px',
              color: 'black'
            }}
          >
            <label style={{ color: 'black' }}>Live Preview</label>
            <hr style={{ margin: '0.5rem 0' }} />
            <ReactMarkdown>{bodyRef.current || 'Nothing to preview...'}</ReactMarkdown>
          </div>
        </div>

        {/* Tags Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: 'black' }}>Tags (comma separated)</label><br />
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. trading, forex, strategies"
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc',
              color: 'black'
            }}
          />
        </div>

        {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: 4,
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
