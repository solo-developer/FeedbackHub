import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import PagePanel from '../../components/PagePanel';
import api  from '../../utils/HttpMiddleware';
import { useToast } from '../../contexts/ToastContext';
import { isSuccess, parseMessage, parseResponseType } from '../../utils/HttpResponseParser';
import { ClientDto } from '../../types/client/ClientDto';
import Modal from '../../components/Modal';
import ConfirmDialog from "../../components/ConfirmDialog";
import { ApplicationDto } from '../../types/application/ApplicationDto';
import { fetchApplications, saveApplicationAsync,deleteApplicationAsync } from '../../services/ApplicationService';

const ApplicationIndexPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ApplicationDto[]>([]);
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [application, setApplication] = useState<ApplicationDto>({
        Id:  0,
        Name: '',
        ShortName: '',
        Logo : ''
      } as ApplicationDto);

    const [showDialog, setShowDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const handleDeleteConfirm =async () => {
        setShowDialog(false);
        try {
            const response = await deleteApplicationAsync(selectedId);
            if (response.Success) {   
                showToast('Application deleted successfully.', 'success', {
                    autoClose: 3000,
                    draggable: true
                });            
                await fetchData();
            }
            else{
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
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchApplications();

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
            showToast('Failed to load applications', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleValueChange = (key: keyof ApplicationDto, value: string) => {
        setApplication((prev) => ({
          ...prev,
          [key]: value,
        }));
      };
      
      const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        const base64 = await toBase64(file);
      
        setApplication((prev) => ({
          ...prev,
          logo: base64,
        }));
      };
      
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file); // includes the data prefix
          reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1]; // remove prefix
            resolve(base64String);
          };
          reader.onerror = (error) => reject(error);
        });
      
    const resetForm = () => {
        setApplication({
            Id:  0,
            Name: '',
            ShortName: '',
            Logo : ''
        });
    };

    const deleteApplication = (id: number) => {
        setSelectedId(id);
        setShowDialog(true);
    };

    const save = async () => {
        try {
            setIsLoading(true);
            const response =await saveApplicationAsync(application);

            if (response.Success) {
                resetForm();
                closeModal();
                showToast('Application saved successfully.', 'success', {
                    autoClose: 3000,
                    draggable: true
                });
                await fetchData();
            }
            else{
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to save application', 'error');
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
                id: 'ShortName',
                header: 'ShortName',
                accessorKey: 'ShortName',
            },
            {
                id: 'Logo',
                header: 'Logo',
                accessorFn: (row) => row.Logo, // base64 string
                cell: ({ getValue }) => {
                  const base64 = getValue<string>();
                  if (!base64) return 'No logo';
          
                  return (
                    <img
                      src={`data:image/png;base64,${base64}`}
                      alt="Logo"
                      style={{ width: 70, height: 50, objectFit: 'contain' }}
                    />
                  );
                },
            },
            {
                id: 'Action',
                header: 'Action',
                cell: ({ row }) => (
                    <div>
                         <span
                                role="button"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Delete Application"
                                onClick={() => deleteApplication(row.original.Id)}
                            >
                               <i className="fas fa-trash text-danger"></i>
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
            <PagePanel title='Applications' headerContent={headerContent}>
                <GenericTable columns={columns} data={data} isLoading={isLoading}  enablePagination={true}/>
            </PagePanel>
            <Modal show={showModal} onClose={closeModal} title="Add application" footer={modalFooter}>
                <form onSubmit={save}>
                    <div className="form-group">
                        <label className="text-start w-100"> Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={application.Name}
                            onChange={(e) => handleValueChange('Name', e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label className="text-start w-100">Short Name</label>
                        <input
                            type="text"
                            placeholder="Short Name"
                            value={application.ShortName}
                            onChange={(e) => handleValueChange('ShortName', e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Logo (Image)</label>
                        <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleLogoChange}
                        />
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                show={showDialog}
                onHide={() => setShowDialog(false)}
                onConfirm={() => handleDeleteConfirm()}
                title="Confirm Delete"
                message="Are you sure you want to delete this application? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
             />
        </>
    );
};

export default ApplicationIndexPage;
