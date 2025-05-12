import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TicketStatus, TicketStatusLabels } from '../../types/feedback/TicketStatus';
import { BoardFeedbackDetailDto, BoardFeedbackDto } from '../../types/feedback/BoardFeedbackDto';
import { getBoardFeedbacksAsync } from '../../services/FeedbackService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

type GroupType = 'Client' | 'Application' | 'ClientAndApplication';

const Board: React.FC = () => {
  const [groupingType, setGroupingType] = useState<GroupType>('Client');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<BoardFeedbackDto[]>([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await getBoardFeedbacksAsync();
      if (response.Success) {
        setFeedbacks(response.Data);
      } else {
        showToast(response.Message, response.ResponseType, {
          autoClose: 3000,
          draggable: true,
        });
      }
    } catch {
      showToast('Failed to load feedbacks', 'error');
    }
  };

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const toggleApplicationRow = (app: string) => {
    setExpandedApplications((prev) => {
      const newSet = new Set(prev);
      newSet.has(app) ? newSet.delete(app) : newSet.add(app);
      return newSet;
    });
  };

  const handleOpenInNewWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  const groupFeedbacks = () => {
    if (groupingType === 'Client') {
      const clientMap: { [client: string]: BoardFeedbackDto[] } = {};
      feedbacks.forEach((fb) => {
        if (!clientMap[fb.Client]) clientMap[fb.Client] = [];
        clientMap[fb.Client].push(fb);
      });

      return Object.entries(clientMap).map(([Client, entries]) => ({ Client, entries }));
    }

    if (groupingType === 'Application') {
      const appMap: { [app: string]: BoardFeedbackDto[] } = {};
      feedbacks.forEach((fb) => {
        if (!appMap[fb.Application]) appMap[fb.Application] = [];
        appMap[fb.Application].push(fb);
      });

      return Object.entries(appMap).map(([Application, entries]) => ({ Application, entries }));
    }

    // Client & Application
    const clientMap = new Map<string, Map<string, BoardFeedbackDto[]>>();

    feedbacks.forEach((fb) => {
      if (!clientMap.has(fb.Client)) clientMap.set(fb.Client, new Map());
      const appMap = clientMap.get(fb.Client)!;
      if (!appMap.has(fb.Application)) appMap.set(fb.Application, []);
      appMap.get(fb.Application)!.push(fb);
    });

    const combined: {
      Client: string;
      applications: { Application: string; entries: BoardFeedbackDto[] }[];
    }[] = [];

    clientMap.forEach((appMap, client) => {
      const applications = Array.from(appMap.entries()).map(([Application, entries]) => ({
        Application,
        entries,
      }));
      combined.push({ Client: client, applications });
    });

    return combined;
  };

  const renderFeedbacks = (feedbacks: BoardFeedbackDetailDto[]) => {
    const feedbacksByStatus: { [key: number]: BoardFeedbackDetailDto[] } = {
      [TicketStatus.Open]: [],
      [TicketStatus.Closed]: [],
      [TicketStatus.Declined]: [],
      [TicketStatus.Resolved]: [],
      // [TicketStatus.OnHold]: [],
    };

    feedbacks.forEach((feedback) => {
      feedbacksByStatus[feedback.Status].push(feedback);
    });

    return (
      <div className="d-flex justify-content-start mt-3">
        {Object.keys(feedbacksByStatus).map((status) => (
          <div className="col-3" key={status} style={{ borderRight: '2px solid #ddd', paddingRight: '20px' }}>
            <h6 className="text-center">{TicketStatusLabels[Number(status)]}</h6>
            {feedbacksByStatus[Number(status)].map((feedback) => (
              <div className="card mb-2" key={feedback.Id}
                style={{
                  cursor: 'pointer',
                  borderLeft: `5px solid ${feedback.FeedbackType.Color}`,
                  borderRadius: '4px'
                }}
                onClick={() => handleOpenInNewWindow(`/feedback/${feedback.Id}`)}

              >
                <div className="card-body">
                  <h6 className="card-title">{feedback.Title}</h6>
                  <p className="card-text">{feedback.RaisedBy}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const grouped = groupFeedbacks();

  const toggleFullScreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className={`container-fluid ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Controls */}
      <div className="d-flex justify-content-between mb-4">
        <div className="w-25">
          <select
            className="form-select"
            value={groupingType}
            onChange={(e) => setGroupingType(e.target.value as GroupType)}
          >
            <option value="Client">Group by Client</option>
            <option value="Application">Group by Application</option>
            <option value="ClientAndApplication">Group by Client & Application</option>
          </select>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={toggleFullScreen}>
          {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      </div>

      {/* Group by Client */}
      {groupingType === 'Client' &&
        grouped.map((group) => (
          <div className="card border-primary shadow-sm mb-3" key={group.Client}>
            <div className="card-body">
              <div className="d-flex justify-content-start align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => toggleRow(group.Client)}
                >
                  {expandedRows.has(group.Client) ? '➖' : '➕'}
                </button>
                <strong>Client:</strong> {group.Client}
              </div>
              {expandedRows.has(group.Client) &&
                renderFeedbacks(group.entries.flatMap((entry) => entry.Feedbacks))}
            </div>
          </div>
        ))}

      {/* Group by Application */}
      {groupingType === 'Application' &&
        grouped.map((group) => (
          <div className="card border-success shadow-sm mb-3" key={group.Application}>
            <div className="card-body">
              <div className="d-flex justify-content-start align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => toggleRow(group.Application)}
                >
                  {expandedRows.has(group.Application) ? '➖' : '➕'}
                </button>
                <strong>Application:</strong> {group.Application}
              </div>
              {expandedRows.has(group.Application) &&
                renderFeedbacks(group.entries.flatMap((entry) => entry.Feedbacks))}
            </div>
          </div>
        ))}

      {/* Group by Client & Application */}
      {groupingType === 'ClientAndApplication' &&
        grouped.map((group) => (
          <div className="card border-warning shadow-sm mb-4" key={group.Client}>
            <div className="card-body">
              <div className="d-flex justify-content-start align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => toggleRow(group.Client)}
                >
                  {expandedRows.has(group.Client) ? '➖' : '➕'}
                </button>
                <strong>Client:</strong> {group.Client}
              </div>

              {expandedRows.has(group.Client) &&
                group.applications.map((app) => (
                  <div key={app.Application} style={{ paddingLeft: '20px', backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex justify-content-start align-items-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => toggleApplicationRow(app.Application)}
                      >
                        {expandedApplications.has(app.Application) ? '➖' : '➕'}
                      </button>
                      <strong>Application:</strong> {app.Application}
                    </div>
                    {expandedApplications.has(app.Application) &&
                      renderFeedbacks(app.entries.flatMap((entry) => entry.Feedbacks))}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Board;
