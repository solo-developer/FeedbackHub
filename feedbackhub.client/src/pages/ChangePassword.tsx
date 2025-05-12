import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FullScreenLoader from '../components/FullScreenLoader';
import { ADMIN_ROLE } from '../utils/Constants';
import AdminLayout from './Admin/AdminLayout';
import { AppSwitcherProvider } from '../contexts/AppSwitcherContext';
import ConsumerLayout from './Consumer/ConsumerLayout';
import { ChangePasswordDto } from '../types/account/ChangePasswordDto';
import { useToast } from '../contexts/ToastContext';
import { changePasswordAsync } from '../services/UserService';
import { useNavigate } from 'react-router-dom';


const ChangePasswordPage: React.FC = () => {
    const { role, loading } = useAuth();

    if (loading) return <FullScreenLoader />;

    const {showToast} = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ChangePasswordDto>({
        CurrentPassword: '',
        NewPassword: '',
        ConfirmPassword: ''
    });

    const [message, setMessage] = useState('');

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();

        const { CurrentPassword, NewPassword, ConfirmPassword } = formData;

        if (!CurrentPassword || !NewPassword || !ConfirmPassword) {
            setMessage('All fields are required.');
            return;
        }

        if (NewPassword !== ConfirmPassword) {
            setMessage('New password and confirmation do not match.');
            return;
        }

        try {
            const response = await changePasswordAsync(formData);

            if (response.Success) {
                showToast("Password changed successfully", response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
                navigate("/login");
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to change password', 'error');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const content = (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h4 className="mb-4">Change Password</h4>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="CurrentPassword"
                        value={formData.CurrentPassword}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="NewPassword"
                        value={formData.NewPassword}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="ConfirmPassword"
                        value={formData.ConfirmPassword}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Change Password
                </button>
            </form>
        </div>
    );

    return role === ADMIN_ROLE ? (
        <AdminLayout>{content}</AdminLayout>
    ) : (
        <AppSwitcherProvider>
            <ConsumerLayout>{content}</ConsumerLayout>
        </AppSwitcherProvider>
    );
};

export default ChangePasswordPage;
