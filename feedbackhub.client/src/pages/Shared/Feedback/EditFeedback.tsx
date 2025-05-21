import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Admin/AdminLayout';
import ConsumerLayout from '../../Consumer/ConsumerLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { ADMIN_ROLE } from '../../../utils/Constants';
import PagePanel from '../../../components/PagePanel';
import { useNavigate, useParams } from 'react-router-dom';
import { AppSwitcherProvider } from '../../../contexts/AppSwitcherContext';
import { getFeedbackByIdAsync, updateFeedbackAsync } from '../../../services/FeedbackService';
import { useToast } from '../../../contexts/ToastContext';
import { FeedbackUpdateDto } from '../../../types/feedback/FeedbackUpdateDto';
import { FeedbackDto } from '../../../types/feedback/FeedbackBasicDetailDto';
import { FeedbackTypeDto } from '../../../types/feedbacktype/FeedbackTypeDto';
import { getAllFeedbackTypesAsync } from '../../../services/FeedbackTypeService';
import { EnumToDropdownOptions } from '../../../utils/EnumHelper';
import { TicketStatus } from '../../../types/feedback/TicketStatus';
import RichTextEditor from '../../../components/RichTextEditor';
import { formatToCustomDateTime } from '../../../utils/DateHelper';
import FeedbackRevisionHistory from './FeedbackRevisionHistory';
import AttachmentSection from './AttachmentSection';
import FeedbackHistoryComments from './FeedbackHistoryComment';
import { handleApiResponse } from '../../../utils/ResponseHandler';

const EditFeedbackPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const feedbackId = Number(id!);
    const { role, loading } = useAuth();

    if (loading) return (<div>Loading.....</div>);
    const { showToast } = useToast();
    const statusOptions = EnumToDropdownOptions(TicketStatus);

    const [feedbackDetail, setFeedbackDetail] = useState<FeedbackDto>();
    const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
    const [activeTab, setActiveTab] = useState<'attachments' | 'history' | 'revisions'>('history');
    const [revisionReloadKey, setRevisionReloadKey] = useState(0);

    const refreshRevisions = () => {
        setRevisionReloadKey(prev => prev + 1);
    };

    const [formData, setFormData] = useState<FeedbackUpdateDto>({
        Id: feedbackId,
        Title: '',
        FeedbackTypeId: 0,
        Status: TicketStatus.Open,
        Priority: 1,
        Description: ''
    });

    useEffect(() => {
        fetchFeedbackTypes();
        fetchFeedbackDetail();
    }, [id]);

    const fetchFeedbackDetail = async () => {
        try {

            const response = await getFeedbackByIdAsync(feedbackId);
            handleApiResponse(response, showToast, undefined, () => {
                 setFeedbackDetail(response.Data);

                setFormData({
                    Id: feedbackId,
                    Title: response.Data.Title,
                    FeedbackTypeId: response.Data.FeedbackTypeId,
                    Status: response.Data.Status,
                    Priority: response.Data.Priority,
                    Description: response.Data.Description
                });
            });
        } catch {
            showToast('Failed to load feedback detail', 'error');
        }
    };
    const fetchFeedbackTypes = async () => {
        try {
            const response = await getAllFeedbackTypesAsync();
            handleApiResponse(response, showToast, undefined, () => { setFeedbackTypes(response.Data); });
        } catch (err) {
            showToast('Failed to load feedback types', 'error');
        }
    };

    const saveButtonClicked = async () => {
        try {

            const response = await updateFeedbackAsync(formData);

            handleApiResponse(response, showToast, "Feedback updated successfully", refreshRevisions);

        } catch (err) {
            showToast('Failed to update feedback', 'error');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'Priority' || name === 'FeedbackTypeId' || name === 'Status' ? parseInt(value) : value
        }));
    };

    const handleDescriptionChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            Description: content
        }));
    };

    const [showRevisions, setShowRevisions] = useState(false);
    const content = (
        <>
            <PagePanel title={`Ticket No : #${feedbackDetail?.TicketId} | Client : ${feedbackDetail?.Client} | Application : ${feedbackDetail?.Application} | Raised By : ${feedbackDetail?.CreatedBy} | Raised Date : ${feedbackDetail?.CreatedDate ? formatToCustomDateTime(feedbackDetail.CreatedDate.toString()) : 'N/A'}`}>
                <div className="container-fluid">

                    <div className="row mb-2">
                        <div className="col-12 d-flex justify-content-start" style={{ backgroundColor: '#e8eef0', padding: '0.5rem' }}>
                            <button
                                className="btn btn-default p-2 border-0"
                                style={{ width: '36px', height: '36px' }}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Save"
                                onClick={saveButtonClicked}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-save"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8.5 1v2h-1V1H2.5A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V5.707a1 1 0 0 0-.293-.707l-3.707-3.707A1 1 0 0 0 10.293 1H8.5zm-3 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V5h-6V3z" />
                                    <path d="M4 6v5h8V6H4zm7 4H5V7h6v3z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            {/* Basic Details */}
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="row">
                                <div className="col-md-4 mb-3 align-items-center">
                                    <label className="form-label me-2">Type</label>
                                    <select className="form-select"
                                        name="FeedbackTypeId"
                                        value={formData.FeedbackTypeId}
                                        onChange={handleChange}>
                                        {feedbackTypes.map(ft => (
                                            <option key={ft.Id} value={ft.Id}>{ft.Type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3 align-items-center">
                                    <label className="form-label me-2">Status</label>
                                    <select className="form-select"
                                        name="Status"
                                        value={formData.Status}
                                        onChange={handleChange}>
                                        {statusOptions.map(ft => (
                                            <option key={ft.value} value={ft.value}>{ft.label}</option>
                                        ))}
                                    </select>
                                </div>


                                <div className="col-md-4 mb-3 align-items-center">
                                    <label className="form-label me-2">Priority</label>
                                    <input className='form-control' type='number' name="Priority"
                                        value={formData.Priority}
                                        onChange={handleChange}></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Description column */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <RichTextEditor
                                    value={formData.Description}
                                    onChange={handleDescriptionChange}
                                />
                            </div>
                        </div>

                        {/* Tabs column */}
                        <div className="col-md-6">
                            <ul className="nav nav-tabs mb-3">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('history')}
                                    >
                                        History
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'revisions' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveTab('revisions')
                                            setShowRevisions(true);
                                        }}
                                    >
                                        Revisions
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'attachments' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('attachments')}
                                    >
                                        Attachments
                                    </button>
                                </li>
                            </ul>

                            <div className="border p-3 rounded">
                                {activeTab === 'history' && (
                                    <FeedbackHistoryComments feedbackId={feedbackId} />
                                )}

                                {activeTab === 'revisions' && (
                                    <div>
                                        {showRevisions && <FeedbackRevisionHistory key={revisionReloadKey} feedbackId={feedbackId} />}
                                    </div>
                                )}


                                {activeTab === 'attachments' && (
                                    <AttachmentSection key={feedbackId} feedbackId={feedbackId} />
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </PagePanel>
        </>
    );

    return (
        role == ADMIN_ROLE ? (<AdminLayout>
            {content}
        </AdminLayout>) : (<AppSwitcherProvider>
            <ConsumerLayout>
                {content}
            </ConsumerLayout>
        </AppSwitcherProvider>)
    );
};

export default EditFeedbackPage;
