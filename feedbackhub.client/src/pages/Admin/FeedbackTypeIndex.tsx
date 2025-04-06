import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import PagePanel from '../../components/PagePanel';
import { get, post } from '../../utils/HttpMiddleware';
import { useToast } from '../../contexts/ToastContext';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../../utils/HttpResponseParser';
import { FeedbackTypeDto } from '../../types/feedbacktype/FeedbackTypeDto';
import Modal from '../../components/Modal';

const FeedbackTypeIndexPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<FeedbackTypeDto[]>([]);
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [typeName, setTypeName] = useState('');
    const [color, setColor] = useState('');


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await get('/feedback-type');

            if (isSuccess(response)) {
                setData(parseData<FeedbackTypeDto[]>(response));
            }
            else {
                showToast(parseMessage(response), parseResponseType(response), {
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
    alert(id);
    };

    const saveFeedbackType = async () => {
        try {
            setIsLoading(true);
            const response = await post('/feedback-type', {
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
            },
            {
                id: 'Action',
                header: 'Action',
                cell: ({ row  }) => (
                    <div>                     
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => deleteFeedbackType(row.original.Color)}
                      >
                        Delete
                      </button>
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
                <GenericTable columns={columns} data={data} isLoading={isLoading} />
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
        </>
    );
};

export default FeedbackTypeIndexPage;
