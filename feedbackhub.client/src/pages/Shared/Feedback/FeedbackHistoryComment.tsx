// components/FeedbackHistoryComments.tsx
import React, { useState } from "react";
import { formatToCustomDateTime } from "../../../utils/DateHelper";
import { FeedbackCommentDto } from "../../../types/feedback/FeedbackCommentDto";
import { useToast } from "../../../contexts/ToastContext";
import { addFeedbackCommentAsync, getCommentsAsync } from "../../../services/FeedbackService";
import ConfirmDialog from "../../../components/ConfirmDialog";

interface FeedbackHistoryProps {
    feedbackId: number;
}

const FeedbackHistoryComments: React.FC<FeedbackHistoryProps> = ({
    feedbackId
}) => {
    const { showToast } = useToast();
    
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
    
    useState(() => {
        fetchFeedbackComments();
    }, [feedbackId]);

    const [historyComments, setHistoryComments] = useState<FeedbackCommentDto[]>([]);

    const [newComment, setNewComment] = useState<string>('');
    const [showAddCommentConfirmation, setShowAddCommentConfirmation] = useState(false);

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

    return (
        <>
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
                    {historyComments.length > 0 && (
                        <>
                            <h6>Previous Comments</h6>
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
                            </div>
                        </>
                    )}
                </div>
            </div>
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

        </>

    );
};

export default FeedbackHistoryComments;
