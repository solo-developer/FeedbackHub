import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RichTextEditor from '../../../components/RichTextEditor';
import { FeedbackTypeDto } from '../../../types/feedbacktype/FeedbackTypeDto';
import { useToast } from '../../../contexts/ToastContext';
import { getAllFeedbackTypesAsync } from '../../../services/FeedbackTypeService';
import PagePanel from '../../../components/PagePanel';
import { buildFormData } from '../../../utils/FormDataHelper';
import { SaveFeedbackDto } from '../../../types/feedback/SaveFeedbackDto';
import { saveNewFeedbackAsync } from '../../../services/FeedbackService';
import { useNavigate } from 'react-router-dom';


const AddFeedbackPage: React.FC = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        fetchFeedbackTypes();
    }, []);

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
    }
    const [formData, setFormData] = useState<Omit<SaveFeedbackDto, 'Attachments'>>({
        FeedbackTypeId: 0,
        Priority: 0,
        Title: '',
        Description: ''
    });

    const [attachments, setAttachments] = useState<File[]>([]);

    const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'Priority' || name === 'FeedbackTypeId' ? parseInt(value) : value
        }));
    };

    const handleDescriptionChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            Description: content
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleFileRemove = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fullForm: SaveFeedbackDto = {
            ...formData,
            Attachments: attachments,
        };

        const formToSend = buildFormData(fullForm as Record<string, any>);

        try {
            const response = await saveNewFeedbackAsync(formToSend);

            if (response.Success) {
                showToast("Feedback submitted successfully", response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
                navigate('/consumer/open-feedbacks');
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to submit feedback', 'error');
        }
    };

    return (
        <>
            <PagePanel title='Add Feedback'>
                <div className="container mt-4">

                    <form onSubmit={handleSubmit}>
                        {/* Feedback Type & Priority */}
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Feedback Type</label>
                            <div className="col-sm-4">
                                <select
                                    className="form-select"
                                    name="FeedbackTypeId"
                                    value={formData.FeedbackTypeId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select...</option>
                                    {feedbackTypes.map(ft => (
                                        <option key={ft.Id} value={ft.Id}>{ft.Type}</option>
                                    ))}
                                </select>
                            </div>

                            <label className="col-sm-2 col-form-label">Priority</label>
                            <div className="col-sm-4">
                                <input className='form-control' type='number' name="Priority"
                                    value={formData.Priority}
                                    onChange={handleChange}></input>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Title</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description (TinyMCE) */}
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Description</label>
                            <div className="col-sm-10 tiptap-editor">
                                <RichTextEditor
                                    value={formData.Description}
                                    onChange={handleDescriptionChange}
                                />
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Attachments</label>
                            <div className="col-sm-10">
                                <input
                                    type="file"
                                    className="form-control"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                {attachments.length > 0 && (
                                    <ul className="list-group mt-2">
                                        {attachments.map((file, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                {file.name}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleFileRemove(index)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Submit Feedback</button>
                        </div>
                    </form>
                </div>
            </PagePanel>
        </>

    );
};

export default AddFeedbackPage;
