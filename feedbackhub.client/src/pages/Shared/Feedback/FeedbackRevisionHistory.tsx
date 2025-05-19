import React, { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { FeedbackRevisionDto } from '../../../types/feedback/FeedbackRevisionDto';
import { getRevisionsByFeedbackIdAsync } from '../../../services/FeedbackService';
import { formatToCustomDateTime } from '../../../utils/DateHelper';

interface Props {
    feedbackId: number;
}

const FeedbackRevisionHistory: React.FC<Props> = ({ feedbackId }) => {
    const [revisions, setRevisions] = useState<FeedbackRevisionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchRevisions();
    }, [feedbackId]);

    const fetchRevisions = async () => {
        try {
            const response = await getRevisionsByFeedbackIdAsync(feedbackId);
            if (response.Success) {
                setRevisions(response.Data);
            } else {
                showToast(response.Message, response.ResponseType);
            }
        } catch {
            showToast('Failed to load revision history', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading revisions...</div>;

    if (!revisions.length) return <div>No revision history available.</div>;

    return (
        <div className="revision-history">
            {revisions.length === 0 ? (
                <div className="text-muted">No revisions found.</div>
            ) : (
                <ul className="list-unstyled">
                    {revisions.map((rev, index) => (
                        <li key={index} className="mb-3 pb-2 border-bottom">
                            <div className="mb-2">
                                <strong>👤 {rev.ChangedBy}</strong>{' '}
                                <small className="text-muted">
                                    on {formatToCustomDateTime(rev.ChangedAt.toString())}
                                </small>
                            </div>

                            {rev.ChangedFields.map((field, i) => (
                                <div key={i} className="ms-3 mb-1">
                                    <span className="fw-bold">📝 {field.DisplayName}</span>
                                    <div className="ms-3 small text-secondary">
                                        <span className="text-danger">“{field.OldValue}”</span> →{' '}
                                        <span className="text-success">“{field.NewValue}”</span>
                                    </div>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FeedbackRevisionHistory;
