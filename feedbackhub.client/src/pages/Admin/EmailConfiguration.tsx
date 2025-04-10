import React, { useState } from 'react';

interface EmailConfig {
  smtpServer: string;
  port: number;
  senderEmail: string;
  username: string;
  password: string;
}

const EmailConfiguration: React.FC = () => {
  const [config, setConfig] = useState<EmailConfig>({
    smtpServer: '',
    port: 587, // Default SMTP port
    senderEmail: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation check
    if (!config.smtpServer || !config.senderEmail || !config.username || !config.password) {
      setError('All fields are required');
      return;
    }

    // Make API request to save the email configuration or send the configuration
    // For example, you can call an API to save the configuration in your backend.
    // This is just a mock API call to simulate the save action.

    setError('');
    setSuccess('Email configuration saved successfully!');
    console.log(config); // Here you would replace this with the real API call
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
    <h2 className="text-center">Email Configuration</h2>

    <form onSubmit={handleSubmit} className="mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* First Row - SMTP Server and Sender Email */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="smtpServer" className="form-label">SMTP Server</label>
          <input
            type="text"
            className="form-control"
            id="smtpServer"
            name="smtpServer"
            value={config.smtpServer}
            onChange={handleChange}
            placeholder="Enter SMTP server"
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="senderEmail" className="form-label">Sender Email</label>
          <input
            type="email"
            className="form-control"
            id="senderEmail"
            name="senderEmail"
            value={config.senderEmail}
            onChange={handleChange}
            placeholder="Enter sender email"
            required
          />
        </div>
      </div>

      {/* Second Row - Port and Username */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="port" className="form-label">Port</label>
          <input
            type="number"
            className="form-control"
            id="port"
            name="port"
            value={config.port}
            onChange={handleChange}
            placeholder="Enter Port (default: 587)"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={config.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </div>
      </div>

      {/* Third Row - Password */}
      <div className="row mb-3">
        <div className="col-md-12">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={config.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">Save Configuration</button>
    </form>
  </div>
  );
};

export default EmailConfiguration;
