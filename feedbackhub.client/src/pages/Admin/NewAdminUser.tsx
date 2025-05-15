import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import PagePanel from '../../components/PagePanel';
import { useNavigate } from 'react-router-dom';
import { CreateAdminUserDto, AdminUserApplicationAccessDto } from '../../types/account/CreateAdminUserDto';

const mockClients = [
  { Id: 1, Name: 'Client A' },
  { Id: 2, Name: 'Client B' },
];

const mockApplications = [
  { Id: 101, Name: 'App A1', ClientId: 1 },
  { Id: 102, Name: 'App A2', ClientId: 1 },
  { Id: 201, Name: 'App B1', ClientId: 2 },
  { Id: 202, Name: 'App B2', ClientId: 2 },
];

const NewAdminUserPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateAdminUserDto>({
    FullName: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Accesses: []
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<{ [clientId: number]: number[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'Password' || name === 'ConfirmPassword') {
        setPasswordMismatch(updated.Password !== updated.ConfirmPassword);
      }
      return updated;
    });
  };

  const handleClientToggle = (clientId: number) => {
    setSelectedClients(prev => {
      const exists = prev.includes(clientId);
      const updated = exists ? prev.filter(id => id !== clientId) : [...prev, clientId];
      if (!exists) {
        setSelectedApplications(prevApps => ({
          ...prevApps,
          [clientId]: [],
        }));
      } else {
        setSelectedApplications(prevApps => {
          const { [clientId]: _, ...rest } = prevApps;
          return rest;
        });
      }
      return updated;
    });
  };

  const handleApplicationToggle = (clientId: number, appId: number) => {
    setSelectedApplications(prev => {
      const currentApps = prev[clientId] || [];
      const updatedApps = currentApps.includes(appId)
        ? currentApps.filter(id => id !== appId)
        : [...currentApps, appId];

      return {
        ...prev,
        [clientId]: updatedApps
      };
    });
  };

  const handleSelectAllApplications = (clientId: number) => {
    const appsForClient = mockApplications.filter(app => app.ClientId === clientId).map(app => app.Id);
    setSelectedApplications(prev => ({
      ...prev,
      [clientId]: appsForClient
    }));
  };

  const handleDeselectAllApplications = (clientId: number) => {
    setSelectedApplications(prev => ({
      ...prev,
      [clientId]: []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.FullName || !formData.Email || !formData.Password || !formData.ConfirmPassword) {
      showToast('All fields are required', 'info');
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setPasswordMismatch(true);
      showToast('Passwords do not match', 'warning');
      return;
    }

    const accesses: AdminUserApplicationAccessDto[] = Object.entries(selectedApplications)
      .filter(([_, appIds]) => appIds.length > 0)
      .map(([clientId, appIds]) => ({
        ClientId: parseInt(clientId),
        ApplicationIds: appIds
      }));

    const finalPayload: CreateAdminUserDto = {
      ...formData,
      Accesses: accesses
    };

    try {
      // Replace with actual API call
      console.log('POST Payload:', finalPayload);
      showToast("User created successfully", 'success');
      navigate("/admin/admin-users");
    } catch {
      showToast("Failed to create user", 'error');
    }
  };

  return (
    <PagePanel title="New Admin User">
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="FullName" className="form-control" value={formData.FullName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="Email" className="form-control" value={formData.Email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="Password" className="form-control" value={formData.Password} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="ConfirmPassword"
              className={`form-control ${passwordMismatch ? 'is-invalid' : ''}`}
              value={formData.ConfirmPassword}
              onChange={handleChange}
            />
            {passwordMismatch && <div className="invalid-feedback">Passwords do not match</div>}
          </div>

          {/* Access Panel */}
          <div className="card border mb-4">
            <div className="card-header bg-light"><strong>Application Access</strong></div>
            <div className="card-body">
              {mockClients.map(client => (
                <div key={client.Id} className="mb-3 border-bottom pb-2">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedClients.includes(client.Id)}
                      onChange={() => handleClientToggle(client.Id)}
                      id={`client-${client.Id}`}
                    />
                    <label className="form-check-label" htmlFor={`client-${client.Id}`}>
                      {client.Name}
                    </label>
                  </div>

                  {selectedClients.includes(client.Id) && (
                    <>
                      <div className="d-flex mb-2">
                        <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => handleSelectAllApplications(client.Id)}>Select All</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleDeselectAllApplications(client.Id)}>Deselect All</button>
                      </div>
                      <div className="row">
                        {mockApplications.filter(app => app.ClientId === client.Id).map(app => (
                          <div className="col-md-4" key={app.Id}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`app-${client.Id}-${app.Id}`}
                                checked={selectedApplications[client.Id]?.includes(app.Id) || false}
                                onChange={() => handleApplicationToggle(client.Id, app.Id)}
                              />
                              <label className="form-check-label" htmlFor={`app-${client.Id}-${app.Id}`}>
                                {app.Name}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary"><i className="fas fa-plus"></i>&nbsp; Submit</button>
        </form>
      </div>
    </PagePanel>
  );
};

export default NewAdminUserPage;
