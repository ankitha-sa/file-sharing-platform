import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.logo}>SafeSender</h2>
      </header>

      <main style={styles.main}>
        <h1 style={styles.heading}>Welcome to Secure File Sharing</h1>
        <p style={styles.subheading}>
          Share files safely and easily with just an email. Encrypted transfers, simple interface, and real-time access to sent files.
        </p>
        <p style={styles.description}>
          Whether you're collaborating with a teammate or sending sensitive documents, our platform ensures your files stay private and reach the right person. No public links, no confusion—just secure sharing.
        </p>
        <div style={styles.links}>
          <Link href="/register" legacyBehavior>
            <a style={styles.linkButton}>Register</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a style={styles.linkButton}>Login</a>
          </Link>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fafb',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    width: '100%',
    padding: '1rem 2rem',
    backgroundColor: '#1f2937',
    color: '#fff',
    textAlign: 'left',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '1rem',
    color: '#333',
    fontSize: '2.5rem',
  },
  subheading: {
    fontSize: '1.25rem',
    color: '#555',
    marginBottom: '1rem',
    maxWidth: '700px',
  },
  description: {
    fontSize: '1rem',
    color: '#666',
    maxWidth: '700px',
    marginBottom: '2rem',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  linkButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4a90e2',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s ease',
  },
};
