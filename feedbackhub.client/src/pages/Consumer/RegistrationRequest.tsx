import React, { useEffect, useState } from 'react';
import styles from '../../styles/LoginStyle';
import { RegistrationRequestDto } from '../../types/account/RegistrationRequestDto';
import { ClientDto } from '../../types/client/ClientDto';
import { fetchClients } from '../../services/ClientService';
import { useToast } from '../../contexts/ToastContext';
import { requestRegistration } from '../../services/RegistrationService';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [clients, setClients] = useState<ClientDto[]>([]);
    const [formData, setFormData] = useState<RegistrationRequestDto>({
        ClientId: 0,
        FullName: '',
        Email: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        getClients();
    }, []);

    const getClients = async () => {
        var response = await fetchClients();
        if (response.Success) {
            setClients(response.Data);
        }
        else {
            showToast(response.Message, response.ResponseType, {
                autoClose: 3000,
                draggable: true
            });
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'ClientId' ? parseInt(value) : value,
        }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.ClientId) newErrors.clientId = 'Client is required';
        if (!formData.FullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.Email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        var response= await requestRegistration(formData);
        if(response.Success){
            showToast('Registration request submitted successfully. You will be notified via email for login credentials.','success', {
                autoClose: 5000,
                draggable: true                
            });
            navigate('/login');
        }
        else{
            debugger;
             showToast(response.Message, response.ResponseType, {
                            autoClose: 3000,
                            draggable: true
                        });
        }
    };

    return (
        <div style={styles.mainContainer}>
            {/* Left Section */}
            <div style={styles.leftSection}>
                <div>
                    <h1 style={styles.heading}>Client Feedback Portal</h1>
                    <p style={styles.description}>
                        Track your feedback, stay updated on changes, and communicate directly with the development team. We value your input!
                    </p>
                </div>
            </div>

            {/* Right Section */}
            {/* Right Section: Registration Form */}
            <div style={styles.rightSection}>
                <div className="card shadow-sm w-100" style={{ maxWidth: '500px' }}>
                    <div className="card-body">
                        <h3 className="card-title text-center mb-4 text-primary">Register</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Client Dropdown */}
                            <div className="mb-3">
                                <label htmlFor="clientId" className="form-label">Client</label>
                                <select
                                    id="clientId"
                                    name="ClientId"
                                    className="form-select"
                                    value={formData.ClientId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={0}>-- Select Client --</option>
                                    {clients.map((client) => (
                                        <option key={client.Id} value={client.Id}>
                                            {client.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.clientId && (
                                    <div className="text-danger small">{errors.clientId}</div>
                                )}
                            </div>

                            {/* Full Name */}
                            <div className="mb-3">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="FullName"
                                    className="form-control"
                                    placeholder="Enter your full name"
                                    value={formData.FullName}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.fullName && (
                                    <div className="text-danger small">{errors.fullName}</div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="Email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-danger small">{errors.email}</div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RegistrationPage;

