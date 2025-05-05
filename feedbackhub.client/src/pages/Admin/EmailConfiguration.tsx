import React, { useEffect, useState } from 'react';
import api from '../../utils/HttpMiddleware';
import { useToast } from '../../contexts/ToastContext';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../../utils/HttpResponseParser';
import PagePanel from '../../components/PagePanel';

interface EmailConfig {
    EncryptionMethod: number;
    Host: string;
    Port: number;
    SenderEmail: string;
    Username: string;
    Password: string;
}
type EmailEncryptionMethod = {
    Label: string;
    Value: number;
};

const EmailConfiguration: React.FC = () => {

    useEffect(() => {

        fetchData();
        fetchEmailEncryptionMethods();
    }, []);

    const fetchData = async () => {
        try {

            const response = await api.get('/email-setting');
            if (isSuccess(response)) {
                setConfig(parseData<EmailConfig>(response));
            }
            else {
                showToast(parseMessage(response), parseResponseType(response), {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load email configuration', 'error');
        } finally {
        }
    };
    const fetchEmailEncryptionMethods = async () => {
        try {
            const response = await api.get('/email-encryption-methods');
            if (isSuccess(response)) {
                setEncryptionMethods(parseData<EmailEncryptionMethod[]>(response));
            }
            else {
                showToast(parseMessage(response), parseResponseType(response), {
                    autoClose: 3000,
                    draggable: true
                });
            }
        } catch (error) {
            console.error('Failed to fetch email providers', error);
        }
    };

    const [encryptionMethods, setEncryptionMethods] = useState<EmailEncryptionMethod[]>([]);

    const [config, setConfig] = useState<EmailConfig>({
        Host: '',
        EncryptionMethod: 0,
        Port: 587, // Default SMTP port
        SenderEmail: '',
        Username: '',
        Password: '',
    });

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const { showToast } = useToast();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!config.Host || !config.SenderEmail || !config.Username || !config.Password) {
            setError('All fields are required');
            return;
        }
        try {
            const response = await api.post('/email-setting', config);

            showToast(parseMessage(response), parseResponseType(response), {
                autoClose: 3000,
                draggable: true
            });

        } catch (err) {
            setError('Failed to save email setting');
            console.error('Email configuration saving error:', err);
        } finally {

        }
    };

    return (
        <PagePanel title='Email Setting'>
            <div className="container-fluid">

                <form onSubmit={handleSubmit} className="mt-4">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="Host" className="form-label">SMTP Server</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Host"
                                name="Host"
                                value={config.Host}
                                onChange={handleChange}
                                placeholder="Enter Host"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="SenderEmail" className="form-label">Sender Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="SenderEmail"
                                name="SenderEmail"
                                value={config.SenderEmail}
                                onChange={handleChange}
                                placeholder="Enter sender email"
                                required
                            />
                        </div>
                    </div>

                    {/* Second Row - Port and Username */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="Port" className="form-label">Port</label>
                            <input
                                type="number"
                                className="form-control"
                                id="Port"
                                name="Port"
                                value={config.Port}
                                onChange={handleChange}
                                placeholder="Enter Port"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="EncryptionMethod" className="form-label">Encryption Method</label>
                            <select
                                className="form-select"
                                id="EncryptionMethod"
                                name="EncryptionMethod"
                                value={config.EncryptionMethod}
                                onChange={(e) =>
                                    setConfig(prev => ({
                                        ...prev,
                                        EncryptionMethod: Number(e.target.value),
                                    }))
                                }
                            >
                                <option value="">-- Select Encryption --</option>
                                {encryptionMethods.map((method) => (
                                    <option key={method.Value} value={method.Value}>
                                        {method.Label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Third Row - Password */}

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="Username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Username"
                                name="Username"
                                value={config.Username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="Password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="Password"
                                name="Password"
                                value={config.Password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>
                    <div className='row pull-right'>
                        <button type="submit" className="btn btn-primary w-100">Save Configuration</button>
                    </div>

                </form>
            </div>
        </PagePanel>

    );
};

export default EmailConfiguration;
