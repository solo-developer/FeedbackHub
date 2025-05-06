import React, { useState } from 'react';
import AdminLayout from '../../Admin/AdminLayout';
import ConsumerLayout from '../../Consumer/ConsumerLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { ADMIN_ROLE } from '../../../utils/Constants';
import PagePanel from '../../../components/PagePanel';
import { useParams } from 'react-router-dom';
import { AppSwitcherProvider } from '../../../contexts/AppSwitcherContext';

const EditFeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();


  const [activeTab, setActiveTab] = useState<'attachments' | 'history'>('history');
  const [historyComments, setHistoryComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setHistoryComments([...historyComments, newComment]);
      setNewComment('');
    }
  };

  const content = (
    <PagePanel title={`Ticket No : #50 | Client : MBL | Application : XmartCredit | Raised By : Niroj Dahal | Raised Date : 2025/05/07 04:45 PM`}>
      <div className="container-fluid">
        {/* Full-width ticket details */}
        <div className="row">
          <div className="col-12">

                     
            {/* Basic Details */}
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" placeholder="Enter ticket title" />
            </div>  
            
  
            {/* Ticket State (State) */}
            <div className="row">
              <div className="col-md-4 mb-3 align-items-center">
                <label className="form-label me-2">State</label>
                <select className="form-select">
                  <option>New</option>
                  <option>Active</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </div>
  
              <div className="col-md-4 mb-3 align-items-center">
                <label className="form-label me-2">Tags</label>
                <input className="form-control" placeholder="e.g., UI, Backend" />
              </div>

              <div className="col-md-4 mb-3 align-items-center">
                <label className="form-label me-2">Priority</label>
                <input className="form-control" placeholder="Priority" type='number' />
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
              <textarea className="form-control" rows={10} placeholder="Describe the issue..." />
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
                    <strong>Previous Activity:</strong>
                    <ul className="list-group mt-2 mb-3">
                      <li className="list-group-item">Ticket created by John Doe</li>
                      <li className="list-group-item">State changed to Active</li>
                      <li className="list-group-item">Assigned to Jane</li>
                      {historyComments.map((comment, index) => (
                        <li key={index} className="list-group-item">
                          {comment}
                        </li>
                      ))}
                    </ul>
  
                    <label className="form-label">Add History Comment</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add internal comment or update..."
                    />
                    <button className="btn btn-sm btn-primary mt-2" onClick={handleAddComment}>
                      Add Comment
                    </button>
                  </div>
                </div>
              )}
  
              {activeTab === 'attachments' && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Upload Attachment</label>
                    <input type="file" className="form-control" />
                  </div>
                  <ul className="list-group">
                    <li className="list-group-item">screenshot.png</li>
                    <li className="list-group-item">error-log.txt</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PagePanel>
  );
  
  
  return (
    role == ADMIN_ROLE ? (<AdminLayout>
        {content}
    </AdminLayout>) : ( <AppSwitcherProvider>
        <ConsumerLayout>
            {content}
        </ConsumerLayout>
      </AppSwitcherProvider>)
  );
};

export default EditFeedbackPage;
