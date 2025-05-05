import React, { useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import PagePanel from '../../components/PagePanel';
import { CreateAdminUserDto } from '../../types/account/CreateAdminUserDto';
import { createAdminUserAsync } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

const NewAdminUserPage: React.FC = () => {

  const { showToast } = useToast();
   const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAdminUserDto>({
    FullName: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedForm = { ...prev, [name]: value };

      if (name === 'Password' || name === 'ConfirmPassword') {
        setPasswordMismatch(updatedForm.Password !== updatedForm.ConfirmPassword);
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.FullName || !formData.Email || !formData.Password || !formData.ConfirmPassword) {
      showToast('All fields are required', 'info');
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setPasswordMismatch(true);
      showToast("Passwords do not match", "warning");
      return;
    }

    try {
      const response = await createAdminUserAsync(formData);

      if (response.Success) {
        showToast("User Created successfully. An email will be sent to registered email for login credentials", 'success');
        navigate("/admin/admin-users");
      } else {
        showToast(response.Message, response.ResponseType, {
          autoClose: 3000,
          draggable: true
        });
      }

    } catch (err) {
      showToast("Failed to create user", 'error');
    }
  };

  return (
    <PagePanel title='New Admin User'>
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="FullName" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="FullName"
              name="FullName"
              value={formData.FullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="ConfirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${passwordMismatch ? 'is-invalid' : ''}`}
              id="ConfirmPassword"
              name="ConfirmPassword"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              required
            />
            {passwordMismatch && (
              <div className="invalid-feedback">
                Passwords do not match.
              </div>
            )}
          </div>

          <button onClick={handleSubmit} className="btn btn-primary btn-sm"><i className='fas fa-plus'></i>&nbsp; Submit</button>
        </form>
      </div>
    </PagePanel>
  );
};

export default NewAdminUserPage;
