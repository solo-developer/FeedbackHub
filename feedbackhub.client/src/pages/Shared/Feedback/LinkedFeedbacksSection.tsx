import React, { useEffect, useState } from 'react';
import {
    getLinkedFeedbacksAsync,
    linkFeedbackAsync,
    unlinkFeedbackAsync,
    getFeedbackByTicketIdAsync,
    getLinkTypeOptions
} from '../../../services/FeedbackService';
import { FeedbackDto } from '../../../types/feedback/FeedbackBasicDetailDto';
import { useToast } from '../../../contexts/ToastContext';
import { handleApiResponse } from '../../../utils/ResponseHandler';
import { GenericDropdownDto } from '../../../types/GenericDropdownDto';
import { LinkFeedbackDto, UnlinkFeedbackDto } from '../../../types/feedback/UnlinkFeedbackDto';
import { FeedbackLinkDto } from '../../../types/feedback/FeedbackLinkDto';

interface Props {
    feedbackId: number;
}

const LinkedFeedbacksSection: React.FC<Props> = ({ feedbackId }) => {
    const { showToast } = useToast();
    const [linkedFeedbacks, setLinkedFeedbacks] = useState<FeedbackLinkDto[]>([]);
    const [linkInput, setLinkInput] = useState('');
    const [previewFeedback, setPreviewFeedback] = useState<FeedbackDto | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [linkTypes, setLinkTypes] = useState<GenericDropdownDto<number, string>[]>([]);
    const [selectedLinkType, setSelectedLinkType] = useState<number | null>(null);

    useEffect(() => {
        fetchLinkedFeedbacks();
        fetchLinkTypes();
    }, [feedbackId]);

    const fetchLinkedFeedbacks = async () => {
        const response = await getLinkedFeedbacksAsync(feedbackId);
        handleApiResponse(response, showToast, undefined, () => {
            setLinkedFeedbacks(response.Data);
        });
    };

    const fetchLinkTypes = async () => {
        const response = await getLinkTypeOptions();
        handleApiResponse(response, showToast, undefined, () => {
            setLinkTypes(response.Data);
            if (response.Data.length > 0) {
                setSelectedLinkType(response.Data[0].Value);
            }
        });
    };

    const handlePreview = async () => {
        if (!linkInput) return;
        const ticketId = Number(linkInput);
        if (!ticketId) return;

        setIsLoadingPreview(true);
        const response = await getFeedbackByTicketIdAsync(ticketId);
        setIsLoadingPreview(false);

        handleApiResponse(response, showToast, undefined, () => {
            setPreviewFeedback(response.Data);
        });
    };

    const handleLink = async () => {
        if (!previewFeedback || selectedLinkType == null) return;
        debugger;
        const data: LinkFeedbackDto = {
            SourceId: feedbackId,
            TargetId: previewFeedback.Id,
            LinkType: selectedLinkType
        }
        const response = await linkFeedbackAsync(data);
        handleApiResponse(response, showToast, 'Feedback linked successfully', () => {
            fetchLinkedFeedbacks();
            setPreviewFeedback(null);
            setLinkInput('');
        });
    };

    const handleUnlink = async (linkId: number) => {
         
        const response = await unlinkFeedbackAsync(linkId);
        handleApiResponse(response, showToast, 'Feedback unlinked successfully', fetchLinkedFeedbacks);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handlePreview();
        }
    };

    return (
        <div>
            <div className="mb-3">
                <label className="form-label">Link Ticket ID</label>
                <div className="input-group">
                    <input
                        type="number"
                        className="form-control"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter Ticket ID and press Enter"
                    />
                </div>
            </div>

            {linkTypes.length > 0 && (
                <div className="mb-3">
                    <label className="form-label">Link Type</label>
                    <select
                        className="form-select"
                        value={selectedLinkType ?? ''}
                        onChange={(e) => setSelectedLinkType(Number(e.target.value))}
                    >
                        {linkTypes.map((type) => (
                            <option key={type.Value} value={type.Value}>
                                {type.Label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {isLoadingPreview && <p>Checking ticket ID...</p>}

            {previewFeedback && (
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                        Found: #{previewFeedback.TicketId} - {previewFeedback.Title}
                    </div>
                    <button className="btn btn-success btn-sm" onClick={handleLink}>
                        Confirm & Link
                    </button>
                </div>
            )}

            <h6>Linked Feedbacks</h6>
            {linkedFeedbacks.length === 0 ? (
                <p>No linked feedbacks found.</p>
            ) : (
                <ul className="list-group">
                    {linkedFeedbacks.map((item) => (
                        <li key={item.LinkId} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                #{item.RelatedTicketId} - {item.RelatedFeedbackTitle} ({item.LinkType})
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={() => handleUnlink(item.LinkId)}>
                                Unlink
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LinkedFeedbacksSection;
