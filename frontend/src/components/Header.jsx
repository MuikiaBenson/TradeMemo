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
        <a href="/contact" className={styles.link}>Contact</a>
      </nav>

      <div className={styles.social}>
        <a
          href="https://x.com/BensonMuikia"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaXTwitter className={styles.svg} />
        </a>
        <a
          href="https://github.com/MuikiaBenson"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaGithub className={styles.svg} />
        </a>
        <a
          href="https://www.linkedin.com/in/benson-muigai-03905b173/"
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
