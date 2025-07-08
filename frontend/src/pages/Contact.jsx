export default function Contact() {
  return (
    <div style={{ padding: '2rem', color: '#333' }}>
      <h1>Contact Us</h1>
      <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
        We'd love to hear from you. Whether you have feedback, questions, or suggestions — reach out!
      </p>
      <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
        <li>Email: <a href="mailto:support@tradememo.com">support@tradememo.com</a></li>
        <li>Phone: +1 (234) 567-8901</li>
        <li>Twitter: <a href="https://twitter.com/tradememo" target="_blank" rel="noopener noreferrer">@tradememo</a></li>
      </ul>
    </div>
  );
}
