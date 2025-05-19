import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Admin/AdminLayout';
import ConsumerLayout from '../../Consumer/ConsumerLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { ADMIN_ROLE } from '../../../utils/Constants';
import PagePanel from '../../../components/PagePanel';
import { useNavigate, useParams } from 'react-router-dom';
import { AppSwitcherProvider } from '../../../contexts/AppSwitcherContext';
import { addFeedbackCommentAsync, getAttachmentsAsync, getCommentsAsync, getFeedbackByIdAsync, saveFeedbackAttachments, updateFeedbackAsync } from '../../../services/FeedbackService';
import { useToast } from '../../../contexts/ToastContext';
import { FeedbackUpdateDto } from '../../../types/feedback/FeedbackUpdateDto';
import { FeedbackBasicDetailDto, FeedbackDto } from '../../../types/feedback/FeedbackBasicDetailDto';
import { FeedbackTypeDto } from '../../../types/feedbacktype/FeedbackTypeDto';
import { getAllFeedbackTypesAsync } from '../../../services/FeedbackTypeService';
import { EnumToDropdownOptions } from '../../../utils/EnumHelper';
import { TicketStatus } from '../../../types/feedback/TicketStatus';
import RichTextEditor from '../../../components/RichTextEditor';
import { formatToCustomDateTime } from '../../../utils/DateHelper';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { FeedbackCommentDto } from '../../../types/feedback/FeedbackCommentDto';
import { FeedbackAttachmentDto } from '../../../types/feedback/FeedbackAttachmentDto';
import { buildFormData } from '../../../utils/FormDataHelper';
import { deleteAttachmentAsync, downloadAttachment } from '../../../services/AttachmentService';
import FeedbackRevisionHistory from './FeedbackRevisionHistory';

const EditFeedbackPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const feedbackId = Number(id!);
    const { role, loading } = useAuth();

    if (loading) return (<div>Loading.....</div>);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const statusOptions = EnumToDropdownOptions(TicketStatus);

    const [feedbackDetail, setFeedbackDetail] = useState<FeedbackDto>();
    const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
    const [activeTab, setActiveTab] = useState<'attachments' | 'history' | 'revisions'>('history');
    const [historyComments, setHistoryComments] = useState<FeedbackCommentDto[]>([]);
    const [attachments, setAttachments] = useState<FeedbackAttachmentDto[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [showAddCommentConfirmation, setShowAddCommentConfirmation] = useState(false);
    const [showRemoveFileConfirmation, setShowRemoveFileConfirmation] = useState(false);

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
        fetchFeedbackComments();
        fetchAttachmentsAsync();
    }, [id]);

    const fetchFeedbackDetail = async () => {
        try {

            const response = await getFeedbackByIdAsync(feedbackId);
            if (response.Success) {

                setFeedbackDetail(response.Data);

                setFormData({
                    Id: feedbackId,
                    Title: response.Data.Title,
                    FeedbackTypeId: response.Data.FeedbackTypeId,
                    Status: response.Data.Status,
                    Priority: response.Data.Priority,
                    Description: response.Data.Description
                });
            } else {
                showToast(response.Message, response.ResponseType);
            }
        } catch {
            showToast('Failed to load feedback detail', 'error');
        }
    };
    const fetchFeedbackTypes = async () => {
        try {

            const response = await getAllFeedbackTypesAsync();

            if (response.Success) {
                setFeedbackTypes(response.Data);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load feedback types', 'error');
        }
    };

    const fetchFeedbackComments = async () => {
        try {

            const response = await getCommentsAsync(feedbackId);

            if (response.Success) {
                setHistoryComments(response.Data);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load comments', 'error');
        }
    };

    const fetchAttachmentsAsync = async () => {
        try {

            const response = await getAttachmentsAsync(feedbackId);

            if (response.Success) {
                setAttachments(response.Data);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load attachments', 'error');
        }
    };

    const saveButtonClicked = async () => {
        try {

            const response = await updateFeedbackAsync(formData);

            if (response.Success) {
                showToast('Feedback updated successfully', 'success', {
                    autoClose: 3000,
                    draggable: true
                });
                refreshRevisions();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

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

    const addCommentBtnClicked = () => {
        if (newComment.trim().length == 0) {
            showToast('Please enter comment.', 'info', {
                autoClose: 3000,
                draggable: true
            });
            return;
        }
        setShowAddCommentConfirmation(true);
    };

    const addRecordInHistory = async () => {
        try {
            setShowAddCommentConfirmation(false);

            const response = await addFeedbackCommentAsync({
                FeedbackId: feedbackId,
                Comment: newComment
            });

            if (response.Success) {
                fetchFeedbackComments();
                setNewComment('');
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to add comment', 'error');
        }
    }

    const handleDescriptionChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            Description: content
        }));
    };
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleUpload = async () => {

        const fullForm = {
            FeedbackId: feedbackId,
            Attachments: selectedFiles,
        };

        const formToSend = buildFormData(fullForm as Record<string, any>);

        try {
            const response = await saveFeedbackAttachments(formToSend);

            if (response.Success) {
                fetchAttachmentsAsync();
                showToast("Attachments submitted successfully", response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to submit attachment', 'error');
        }

    };

    const [fileSelectionForDelete, setFileSelectionForDelete] = useState<string>('');
    const [showRevisions, setShowRevisions] = useState(false);
    const removeAttachmentBtnClicked = (identifier: string) => {
        setFileSelectionForDelete(identifier);

        setShowRemoveFileConfirmation(true);
    };

    const removeAttachment = async (identifier: string) => {
        try {
            setShowRemoveFileConfirmation(false);

            const response = await deleteAttachmentAsync(identifier);

            if (response.Success) {
                setFileSelectionForDelete('');
                fetchAttachmentsAsync();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to remove attachment', 'error');
        }
    }


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

                    {/* Full-width ticket details */}
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


                            {/* Ticket State (State) */}
                            <div className="row">
                                <div className="col-md-4 mb-3 align-items-center">
                                    <label className="form-label me-2">Type</label>
                                    <select className="form-select"
                                        name="FeedbackTypeId"
                                        value={formData.FeedbackTypeId}
                                        onChange={handleChange}>
                                        <option value="">Feedback Type</option>
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
                                        <option value="">Select...</option>
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

                    {/* Two-column layout: Description + Tabs */}
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
                                    <div>
                                        <div className="mb-3">

                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add Comment ......."
                                            />
                                            <button className="btn btn-sm btn-primary mt-2" onClick={addCommentBtnClicked}>
                                                Add Comment
                                            </button>
                                            <br />
                                            {historyComments.length > 0 && 
                                            <> <h6>Previous Comments</h6>


                                            <div className="comment-history">
                                                {historyComments.map((cmt, index) => (
                                                    <div key={index} className="card mb-2 p-3 shadow-sm mt-2">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <strong>{cmt.EnteredBy}</strong>
                                                            <small className="text-muted">
                                                                {formatToCustomDateTime(cmt.EnteredDate.toString())}
                                                            </small>
                                                        </div>
                                                        <div>{cmt.Comment}</div>
                                                    </div>
                                                ))}
                                            </div> </>
                                            }

                                        </div>
                                    </div>
                                )}

                                {activeTab === 'revisions' && (
                                    <div>
                                        {showRevisions && <FeedbackRevisionHistory key={revisionReloadKey} feedbackId={feedbackId} />}
                                    </div>
                                )}


                                {activeTab === 'attachments' && (
                                    <div>
                                        {/* Upload Section */}
                                        <div className="mb-3">
                                            <label className="form-label">Upload Attachment</label>
                                            <div className="input-group">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="form-control"
                                                    onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                                                />
                                                <button
                                                    className="btn btn-outline-success"
                                                    onClick={handleUpload}
                                                    disabled={!selectedFiles.length}
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        </div>

                                        {/* Attachments List */}
                                        <ul className="list-group">
                                            {attachments.map((att, index) => (
                                                <li key={index} className="list-group-item">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            📎 <strong>{att.DisplayName}</strong>
                                                            <br />
                                                            <small className="text-secondary">
                                                                Uploaded by <strong>{att.EnteredBy}</strong> on{" "}
                                                                {formatToCustomDateTime(att.EnteredDate.toString())}
                                                            </small>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <a
                                                                href='#'
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => downloadAttachment(att.AttachmentIdentifier, att.DisplayName)}
                                                            >
                                                                View
                                                            </a>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => removeAttachmentBtnClicked(att.AttachmentIdentifier)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </PagePanel>
            <ConfirmDialog
                show={showAddCommentConfirmation}
                onHide={() => setShowAddCommentConfirmation(false)}
                onConfirm={() => addRecordInHistory()}
                title="Confirm Save"
                message="Are you sure you want to add the comment? This action cannot be undone."
                confirmText="Save"
                cancelText="Cancel"
                variant="primary"
            />

            <ConfirmDialog
                show={showRemoveFileConfirmation}
                onHide={() => setShowRemoveFileConfirmation(false)}
                onConfirm={() => removeAttachment(fileSelectionForDelete)}
                title="Confirm Remove"
                message="Are you sure you want to remove the file? This action cannot be undone."
                confirmText="Remove"
                cancelText="Cancel"
                variant="danger"
            />
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
