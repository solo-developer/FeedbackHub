import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TicketStatus, TicketStatusLabels } from '../../types/feedback/TicketStatus';

type GroupType = 'Client' | 'Application' | 'ClientAndApplication';

interface Feedback {
  id: number;
  status: TicketStatus;
  title: string;
  description: string;
}

interface FeedbackEntry {
  client: string;
  application: string;
  feedbacks: Feedback[];
}

const mockData: FeedbackEntry[] = [
  {
    client: 'Client A',
    application: 'App X',
    feedbacks: [
      { id: 1, status: TicketStatus.Open, title: 'Login fails', description: 'OAuth redirect issue' },
      { id: 2, status: TicketStatus.Resolved, title: 'UI glitch', description: 'Alignment issue on dashboard' },
    ],
  },
  {
    client: 'Client B',
    application: 'App Y',
    feedbacks: [
      { id: 3, status: TicketStatus.Closed, title: 'Data not saving', description: 'Missing DB transaction' },
      { id: 4, status: TicketStatus.Declined, title: 'Feature request', description: 'Export to PDF' },
    ],
  },
  {
    client: 'Client A',
    application: 'App Y',
    feedbacks: [
      { id: 5, status: TicketStatus.OnHold, title: 'Cache issue', description: 'Outdated state display' },
    ],
  },
];

const Board: React.FC = () => {
  const [groupingType, setGroupingType] = useState<GroupType>('Client');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const groupFeedbacks = () => {
    if (groupingType === 'Client') {
      return mockData.reduce((acc: any[], curr) => {
        const clientEntry = acc.find((item) => item.client === curr.client);
        if (!clientEntry) acc.push({ client: curr.client, entries: [curr] });
        else clientEntry.entries.push(curr);
        return acc;
      }, []);
    }

    if (groupingType === 'Application') {
      return mockData.reduce((acc: any[], curr) => {
        const appEntry = acc.find((item) => item.application === curr.application);
        if (!appEntry) acc.push({ application: curr.application, entries: [curr] });
        else appEntry.entries.push(curr);
        return acc;
      }, []);
    }

    // ClientAndApplication
    return mockData.reduce((acc: any[], curr) => {
      const clientEntry = acc.find((item) => item.client === curr.client);
      if (!clientEntry) {
        acc.push({ client: curr.client, applications: [{ application: curr.application, entries: [curr] }] });
      } else {
        const appEntry = clientEntry.applications.find((app) => app.application === curr.application);
        if (!appEntry) {
          clientEntry.applications.push({ application: curr.application, entries: [curr] });
        } else {
          appEntry.entries.push(curr);
        }
      }
      return acc;
    }, []);
  };

  const renderFeedbacks = (feedbacks: Feedback[]) => {
    const feedbacksByStatus: { [key: number]: Feedback[] } = {
      [TicketStatus.Open]: [],
      [TicketStatus.Closed]: [],
      [TicketStatus.Declined]: [],
      [TicketStatus.Resolved]: [],
      [TicketStatus.OnHold]: [],
    };

    feedbacks.forEach((feedback) => {
      feedbacksByStatus[feedback.status].push(feedback);
    });

    return (
      <div className="d-flex justify-content-between mt-3">
        {Object.keys(feedbacksByStatus).map((status) => (
          <div className="col-2" key={status} style={{ borderRight: '2px solid #ddd', paddingRight: '20px' }}>
            <h6 className="text-center">{TicketStatusLabels[Number(status)]}</h6>
            {feedbacksByStatus[Number(status)].map((feedback) => (
              <div className="card mb-2" key={feedback.id}>
                <div className="card-body">
                  <h6 className="card-title">{feedback.title}</h6>
                  <p className="card-text">{feedback.description}</p>
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
      {/* Dropdown */}
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

        {/* Fullscreen Button */}
        <button className="btn btn-outline-primary btn-sm" onClick={toggleFullScreen}>
          {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      </div>

      {/* Group by Client */}
      {groupingType === 'Client' &&
        grouped.map((group) => (
          <div className="card border-primary shadow-sm mb-3" key={group.client}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => toggleRow(group.client)}
                  >
                    {expandedRows.has(group.client) ? '➖' : '➕'}
                  </button>
                  <strong>Client:</strong> {group.client}
                </div>
              </div>
              {expandedRows.has(group.client) && renderFeedbacks(group.entries.flatMap((entry) => entry.feedbacks))}
            </div>
          </div>
        ))}

      {/* Group by Application */}
      {groupingType === 'Application' &&
        grouped.map((group) => (
          <div className="card border-success shadow-sm mb-3" key={group.application}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => toggleRow(group.application)}
                  >
                    {expandedRows.has(group.application) ? '➖' : '➕'}
                  </button>
                  <strong>Application:</strong> {group.application}
                </div>
              </div>
              {expandedRows.has(group.application) && renderFeedbacks(group.entries.flatMap((entry) => entry.feedbacks))}
            </div>
          </div>
        ))}

      {/* Group by Client & Application */}
      {groupingType === 'ClientAndApplication' &&
        grouped.map((group) => (
          <div className="card border-warning shadow-sm mb-4" key={group.client}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => toggleRow(group.client)}
                  >
                    {expandedRows.has(group.client) ? '➖' : '➕'}
                  </button>
                  <strong>Client:</strong> {group.client}
                </div>
              </div>

              {expandedRows.has(group.client) &&
                group.applications.map((app) => (
                  <div key={app.application} style={{ paddingLeft: '20px', backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex justify-content-start align-items-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => toggleApplicationRow(app.application)}
                      >
                        {expandedApplications.has(app.application) ? '➖' : '➕'}
                      </button>
                      <strong>Application:</strong> {app.application}
                    </div>
                    {expandedApplications.has(app.application) && renderFeedbacks(app.entries.flatMap((entry) => entry.feedbacks))}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Board;
