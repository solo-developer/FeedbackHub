import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import PagePanel from '../../components/PagePanel';
import api from '../../utils/HttpMiddleware';
import { useToast } from '../../contexts/ToastContext';
import { isSuccess, parseMessage, parseResponseType } from '../../utils/HttpResponseParser';
import { FeedbackTypeDto } from '../../types/feedbacktype/FeedbackTypeDto';
import Modal from '../../components/Modal';
import ConfirmDialog from "../../components/ConfirmDialog";
import { getAllFeedbackTypesAsync } from '../../services/FeedbackTypeService';

const FeedbackTypeIndexPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<FeedbackTypeDto[]>([]);
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [typeName, setTypeName] = useState('');
    const [color, setColor] = useState('');

    const [showDialog, setShowDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const handleDeleteConfirm = async () => {
        setShowDialog(false);
        try {
            const response = await api.delete(`/feedback-type/${selectedId}`);

            showToast(parseMessage(response), parseResponseType(response), {
                autoClose: 3000,
                draggable: true
            });

            if (isSuccess(response)) {
                await fetchData();
            }

        } catch (err) {
            showToast('Failed to delete feedback type', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await getAllFeedbackTypesAsync();

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
            showToast('Failed to load feedback types', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setTypeName('');
        setColor('');
    };

    const deleteFeedbackType = (id: number) => {
        setSelectedId(id);
        setShowDialog(true);
    };

    const saveFeedbackType = async () => {
        try {
            setIsLoading(true);
            const response = await api.post('/feedback-type', {
                'Color': color,
                'Type': typeName
            });

            showToast(parseMessage(response), parseResponseType(response), {
                autoClose: 3000,
                draggable: true
            });

            if (isSuccess(response)) {
                resetForm();
                closeModal();
                await fetchData();
            }

        } catch (err) {
            showToast('Failed to save feedback types', 'error');
        }
    };

    const columns = React.useMemo(
        () => [
            {
                id: 'Type',
                header: 'Type',
                accessorKey: 'Type',
            },
            {
                id: 'Color',
                header: 'Color',
                accessorKey: 'Color',
                cell: ({ row }: any) => (
                    <div
                        style={{
                            width: '50px',
                            height: '20px',
                            backgroundColor: row.original.Color,
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        title={row.original.Color}
                    />
                ),
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
                            title="Delete Feedback Type"
                            onClick={() => deleteFeedbackType(row.original.Id)}
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
            <button onClick={saveFeedbackType} className='btn btn-primary'>Save Changes</button>
        </div>
    );
    return (
        <>
            <PagePanel title='Feedback Type Setup' headerContent={headerContent}>
                <GenericTable columns={columns} data={data} isLoading={isLoading} enablePagination={true}/>
            </PagePanel>
            <Modal show={showModal} onClose={closeModal} title="Add Feedback Type" footer={modalFooter}>
                <form onSubmit={saveFeedbackType}>
                    <div className="form-group">
                        <label className="text-start w-100">Feedback Type</label>
                        <input
                            type="text"
                            placeholder="Type"
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label className="text-start w-100">Color</label>
                        <input
                            type="color"
                            placeholder="Color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                show={showDialog}
                onHide={() => setShowDialog(false)}
                onConfirm={() => handleDeleteConfirm()}
                title="Confirm Delete"
                message="Are you sure you want to delete this item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
};

export default FeedbackTypeIndexPage;
