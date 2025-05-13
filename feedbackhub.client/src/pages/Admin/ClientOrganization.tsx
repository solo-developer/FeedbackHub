import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import PagePanel from '../../components/PagePanel';
import { useToast } from '../../contexts/ToastContext';
import { ClientDto, SaveClientDto } from '../../types/client/ClientDto';
import Modal from '../../components/Modal';
import ConfirmDialog from "../../components/ConfirmDialog";
import { deleteClientAsync, fetchClients, saveClientAsync } from '../../services/ClientService';
import { ApplicationDto } from '../../types/application/ApplicationDto';
import Select from 'react-select';
import { fetchApplications } from '../../services/ApplicationService';

const ClientOrganizationIndexPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ClientDto[]>([]);
    const [applications, setApplications] = useState<ApplicationDto[]>([]);
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [showDialog, setShowDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(0);

    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleChange = (selectedOptions: any[]) => {
        const selectedIds = selectedOptions.map(opt => opt.Id);
        setSelectedOptions(selectedOptions);       

    };

    const handleDeleteConfirm = async () => {
        setShowDialog(false);
        try {
            const response = await deleteClientAsync(selectedId);

            if (response.Success) {
                showToast('Client disabled successfully', 'success', {
                    autoClose: 3000,
                    draggable: true
                });
                await fetchData();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to disable client organization', 'error');
        }
    };


    useEffect(() => {
        fetchData();
        fetchApplicationData();
    }, []);

    const fetchApplicationData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchApplications();

            if (response.Success) {
                setApplications(response.Data);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load applications', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchClients();

            if (response.Success) {
                setData(response.Data);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load client organizations', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setCode('');
        setSelectedOptions([]);
        
    };

    const disableClient = (id: number) => {
        setSelectedId(id);
        setShowDialog(true);
    };

    const save = async () => {
        try {
            setIsLoading(true);

            let clientDto: SaveClientDto = {
                Id: 0,
                Name: name,
                Code: code,
                ApplicationIds: selectedOptions.map(a=> parseInt(a))
            }
            const response = await saveClientAsync(clientDto);

            if (response.Success) {
                resetForm();
                closeModal();
                await fetchData();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to save client organization', 'error');
        }
    };

    const columns = React.useMemo(
        () => [
            {
                id: 'Name',
                header: 'Name',
                accessorKey: 'Name',
            },
            {
                id: 'Code',
                header: 'Code',
                accessorKey: 'Code',
            },
            {
                id: 'Action',
                header: 'Action',
                cell: ({ row }: any) => (
                    <div>
                        <span
                            role="button"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Disable Client"
                            onClick={() => disableClient(row.original.Id)}
                        >
                            <i className="fas fa-ban text-danger"></i>
                        </span>
                    </div>
                ),
            }
        ],
        []
    );

    const headerContent = (
        <div>
            <button onClick={openModal} className="btn btn-primary btn-sm"><i className='fas fa-plus'></i>&nbsp; Add</button>
        </div>
    );

    const modalFooter = (
        <div>
            <button onClick={closeModal} style={{ marginRight: '10px' }} className='pull-left'>
                Cancel
            </button>
            <button onClick={save} className='btn btn-primary'>Save Changes</button>
        </div>
    );
    return (
        <>
            <PagePanel title='Client Organization Setup' headerContent={headerContent}>
                <GenericTable columns={columns} data={data} isLoading={isLoading} />
            </PagePanel>
            <Modal show={showModal} onClose={closeModal} title="Add Client Organization" footer={modalFooter}>
                <form onSubmit={save}>
                    <div className="form-group mb-2">
                        <label className="text-start w-100">Client Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label className="text-start w-100">Code</label>
                        <input
                            type="text"
                            placeholder="Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group mb-2">
                        <label>Applications</label>
                        {
                            applications.length > 0 && <Select
                                isMulti
                                options={applications}
                                getOptionLabel={(e) => e.Name}
                                getOptionValue={(e) => e.Id.toString()}
                                value={selectedOptions}
                                onChange={handleChange}
                                inputValue={inputValue}
                            />
                        }


                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                show={showDialog}
                onHide={() => setShowDialog(false)}
                onConfirm={() => handleDeleteConfirm()}
                title="Confirm Disable"
                message="Are you sure you want to disable this client? This action cannot be undone."
                confirmText="Disable"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
};

export default ClientOrganizationIndexPage;
