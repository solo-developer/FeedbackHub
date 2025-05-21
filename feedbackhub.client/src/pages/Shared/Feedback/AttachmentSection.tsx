import React, { useEffect, useState } from "react";
import { formatToCustomDateTime } from "../../../utils/DateHelper";
import { FeedbackAttachmentDto } from "../../../types/feedback/FeedbackAttachmentDto";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { deleteAttachmentAsync, downloadAttachment } from "../../../services/AttachmentService";
import { getAttachmentsAsync, saveFeedbackAttachments } from "../../../services/FeedbackService";
import { useToast } from "../../../contexts/ToastContext";
import { buildFormData } from "../../../utils/FormDataHelper";

interface AttachmentSectionProps {
  feedbackId: number;
}

const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  feedbackId
}) => {

  useEffect(() => {
    fetchAttachmentsAsync();
  }, [feedbackId]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileSelectionForDelete, setFileSelectionForDelete] = useState<string>('');
  const [showRemoveFileConfirmation, setShowRemoveFileConfirmation] = useState(false);
  const [attachments, setAttachments] = useState<FeedbackAttachmentDto[]>([]);
  const { showToast } = useToast();
  const removeAttachmentBtnClicked = (identifier: string) => {
    setFileSelectionForDelete(identifier);

    setShowRemoveFileConfirmation(true);
  };

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

  return (


    <>
      <div>
        {/* Upload Section */}
        <div className="mb-3">
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
                    href="#"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      downloadAttachment(att.AttachmentIdentifier, att.DisplayName)
                    }
                  >
                    View
                  </a>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      removeAttachmentBtnClicked(att.AttachmentIdentifier)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ConfirmDialog
        show={showRemoveFileConfirmation}
        onHide={() => setShowRemoveFileConfirmation(false)}
        onConfirm={() => removeAttachment(fileSelectionForDelete)}
        title="Confirm Remove"
        message="Are you sure you want to remove the file? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      /></>
  );
};

export default AttachmentSection;
