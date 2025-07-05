// src/components/Header.jsx
import styles from './Header.module.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // X (formerly Twitter)

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>TradeMemo</div>

      <nav className={styles.nav}>
        <a href="/" className={styles.link}>Home</a>
        <a href="/about" className={styles.link}>About</a>
        <a href="/blog" className={styles.link}>Blog</a>
        <a href="/contact" className={styles.link}>Contact</a>
      </nav>

      <div className={styles.social}>
        <a
          href="https://twitter.com/YOUR_HANDLE"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaXTwitter className={styles.svg} />
        </a>
        <a
          href="https://github.com/YOUR_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaGithub className={styles.svg} />
        </a>
        <a
          href="https://www.linkedin.com/in/YOUR_PROFILE"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaLinkedin className={styles.svg} />
        </a>
      </div>
    </header>
  );
}
