// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Layout from './Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Posts from './pages/Posts';
import PostDetails from './pages/PostDetails';
import CreatePost from './pages/CreatePost';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/new" element={<CreatePost />} />
          <Route path="posts/:id" element={<PostDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}
