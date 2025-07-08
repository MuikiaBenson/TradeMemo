// src/pages/Home.jsx
import './Home.css';
import AuthForm from '../components/AuthForm';

export default function Home() {
  return (
    <div className="home-container">
      <video
        className="background-video"
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="content-overlay">
        <h1>Your Edge in Every Trade</h1>
        <p className="slogan">Where Traders Share Strategies & Stories</p>
      </div>
      <AuthForm />
    </div>
  );
}
