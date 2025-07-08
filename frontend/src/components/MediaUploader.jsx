import { useState } from 'react';
import axios from 'axios';

export default function MediaUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog_upload'); // ← match your Cloudinary preset

    setUploading(true);
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dgymlgxlf/upload', // replace with your Cloud name
        formData
      );
      const uploadedUrl = res.data.secure_url;
      setUrl(uploadedUrl);
      onUpload(uploadedUrl); // insert into editor
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label style={{ cursor: 'pointer', color: '#1da1f2', fontWeight: 'bold' }}>
        Upload Image/Video
        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      </label>
      {uploading && <p>Uploading...</p>}
      {url && (
        <p>
          Uploaded: <a href={url} target="_blank" rel="noreferrer">{url}</a>
        </p>
      )}
    </div>
  );
}
