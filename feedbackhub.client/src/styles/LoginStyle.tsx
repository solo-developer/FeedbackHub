
// Inline styling for simplicity — replace with CSS modules or styled-components as needed
const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: {
    display: 'flex',
    // maxWidth: '1200px',
    margin: '2rem auto',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#333',
    backgroundColor: '#f3f6fa',
  },
  leftSection: {
    flex: 1,
    backgroundColor: '#eef4fb',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    color: '#0a6ebd',
  },
  description: {
    fontSize: '1.1rem',
    color: '#555',
    marginTop: '0.5rem',
  },
  rightSection: {
    flex: 1,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeading: {
    color: '#0a6ebd',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '1rem',
    border: '1px solid #ccd7e0',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: '#0a6ebd',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  forgotPassword: {
    marginTop: '1rem',
    color: '#0a6ebd',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default styles;