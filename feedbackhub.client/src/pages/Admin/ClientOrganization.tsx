import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import PagePanel from '../../components/PagePanel';
import api from '../../utils/HttpMiddleware';
import { useToast } from '../../contexts/ToastContext';
import { isSuccess, parseMessage, parseResponseType } from '../../utils/HttpResponseParser';
import { ClientDto } from '../../types/client/ClientDto';
import Modal from '../../components/Modal';
import ConfirmDialog from "../../components/ConfirmDialog";
import { deleteClientAsync, editClientAsync, fetchClients, saveClientAsync } from '../../services/ClientService';
import Select from 'react-select';
import { fetchApplications } from '../../services/ApplicationService';
import { ApplicationDto } from '../../types/application/ApplicationDto';
import { SaveClientDto } from '../../types/client/SaveClientDto';


const ClientOrganizationIndexPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ClientDto[]>([]);
    const [applications, setApplications] = useState<ApplicationDto[]>([]);
    const { showToast } = useToast();

    const [showModal, setShowModal] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(0);

    const [formState, setFormState] = useState<SaveClientDto>({
        Id: 0,
        Name: '',
        Code: '',
        ApplicationIds: []
    });

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchClients();
            if (response.Success) {
                setData(response.Data);
            } else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }
        } catch {
            showToast('Failed to load client organizations', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getApplications = async () => {
        try {
            const response = await fetchApplications();
            if (response.Success) {
                setApplications(response.Data);
            } else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }
        } catch {
            showToast('Failed to load applications', 'error');
        }
    };

    useEffect(() => {
        fetchData();
        getApplications();
    }, []);

    const resetForm = () => {
        setFormState({
            Id: 0,
            Name: '',
            Code: '',
            ApplicationIds: []
        });
    };

    const save = async () => {
        try {
            setIsLoading(true);
            if (formState.Id == 0) {
                await saveClient(formState);
            }
            else {
                await updateClient(formState);
            }
        } catch {
            showToast('Failed to save/update client organization', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const saveClient = async (dto: SaveClientDto) => {
        const response = await saveClientAsync(formState);

        if (response.Success) {
            showToast('Client saved successfully', response.ResponseType, {
                autoClose: 3000,
                draggable: true
            });
            await cleanUpsAfterSaveUpdate();
        }
        else {
            showToast(response.Message, response.ResponseType, {
                autoClose: 3000,
                draggable: true
            });
        }
    }

    const updateClient = async (dto: SaveClientDto) => {
        const response = await editClientAsync(formState);

        if (response.Success) {
            showToast('Client updated successfully', response.ResponseType, {
                autoClose: 3000,
                draggable: true
            });
            await cleanUpsAfterSaveUpdate();
        }
        else {
            showToast(response.Message, response.ResponseType, {
                autoClose: 3000,
                draggable: true
            });
        }
    }

    const cleanUpsAfterSaveUpdate = async () => {
        resetForm();
        closeModal();
        await fetchData();
    }

    const disableClient = (id: number) => {
        setSelectedId(id);
        setShowDialog(true);
    };

    const editClientButtonClicked = (id: number) => {
        let client = data.find(a => a.Id == id);
        if (!client)
            return;
        setFormState({
            Id: id,
            Name: client.Name,
            Code: client.Code,
            ApplicationIds: client.SubscribedApplications.map(a => a.Id)
        });
        setShowModal(true);
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
            } else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }
        } catch {
            showToast('Failed to disable client organization', 'error');
        }
    };

    const columns = React.useMemo(
        () => [
            {
                id: 'Name',
                header: 'Name',
                accessorKey: 'Name',
                exportable:true,
            },
            {
                id: 'Code',
                header: 'Code',
                accessorKey: 'Code',
                exportable:true,
            },
            {
                id: 'Applications',
                header: 'Applications',
                exportable :true,
                exportValue: (row :any) => row.SubscribedApplications.length > 0 ? row.SubscribedApplications.map(a => a.ShortName).join(',') : 'N/A',
                cell: ({ row }: any) => (

                    row.original.SubscribedApplications.length > 0 ? row.original.SubscribedApplications.map(a => a.ShortName).join(',') : 'N/A'
                )
            },
            {
                id: 'Action',
                header: 'Action',
                exportable:false,
                cell: ({ row }: any) => (
                    <div>

                        <span
                            className='me-2'
                            role="button"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Edit Client"
                            onClick={() => editClientButtonClicked(row.original.Id)}
                        >
                            <i className="fas fa-edit text-primary"></i>
                        </span>

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
        [data]
    );
    const selectedApplicationOptions = applications.filter(app =>
        formState.ApplicationIds.includes(app.Id)
    );

    const [inputValue, setInputValue] = useState('');
    const headerContent = (
        <div>
            <button onClick={openModal} className="btn btn-primary btn-sm">
                <i className='fas fa-plus'></i>&nbsp; Add
            </button>
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
                <GenericTable columns={columns} data={data} isLoading={isLoading} enablePagination={true}
                exportProps={
                    {
                        enableExporting :true,
                        fileName : 'Client Organizations.xlsx'
                    }
                }/>
            </PagePanel>

            <Modal show={showModal} onClose={closeModal} title="Add Client Organization" footer={modalFooter}>
                <form onSubmit={(e) => { e.preventDefault(); save(); }}>
                    <div className="form-group mb-2">
                        <label className="text-start w-100">Client Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formState.Name}
                            onChange={(e) =>
                                setFormState(prev => ({ ...prev, Name: e.target.value }))
                            }
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label className="text-start w-100">Code</label>
                        <input
                            type="text"
                            placeholder="Code"
                            value={formState.Code}
                            onChange={(e) =>
                                setFormState(prev => ({ ...prev, Code: e.target.value }))
                            }
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Applications</label>
                        {applications.length > 0 && <Select
                            isMulti
                            options={applications}
                            getOptionLabel={(e) => e.Name}
                            getOptionValue={(e) => e.Id.toString()}
                            value={selectedApplicationOptions}
                            onChange={(selectedOptions: any[]) => {
                                const selectedIds = selectedOptions.map(opt => opt.Id);
                                setFormState(prev => ({
                                    ...prev,
                                    ApplicationIds: selectedIds
                                }));
                            }}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                        />
                        }
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                show={showDialog}
                onHide={() => setShowDialog(false)}
                onConfirm={handleDeleteConfirm}
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
