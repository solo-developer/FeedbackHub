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

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
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

  const renderColumns = (entries: FeedbackEntry[]) => {
    const allFeedbacks = entries.flatMap((e) => e.feedbacks);
    const statuses = Object.values(TicketStatus).filter(
      (v) => typeof v === 'number'
    ) as TicketStatus[];

    return (
      <div className="row mt-3">
        {statuses.map((status) => {
          const feedbacks = allFeedbacks.filter((f) => f.status === status);
          return (
            <div className="col" key={status}>
              <div className="card h-100">
                <div className="card-header bg-light fw-bold text-center">
                  {TicketStatusLabels[status]}
                </div>
                <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {feedbacks.length > 0 ? (
                    feedbacks.map((fb) => (
                      <div className="card mb-2 shadow-sm" key={fb.id}>
                        <div className="card-body p-2">
                          <h6 className="mb-1">{fb.title}</h6>
                          <small className="text-muted">{fb.description}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small">No feedbacks</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const grouped = groupFeedbacks();

  return (
    <div className="container-fluid">
      {/* Dropdown */}
      <div className="d-flex justify-content-end mb-4">
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
      </div>

      {/* Group by Client */}
      {groupingType === 'Client' &&
        grouped.map((group) => (
          <div className="card border-primary shadow-sm mb-3" key={group.client}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => toggleRow(group.client)}
                >
                  {expandedRows.has(group.client) ? '➖' : '➕'}
                </button>
                <strong>Client:</strong> {group.client}
              </div>
              {expandedRows.has(group.client) && renderColumns(group.entries)}
            </div>
          </div>
        ))}

      {/* Group by Application */}
      {groupingType === 'Application' &&
        grouped.map((group) => (
          <div className="card border-success shadow-sm mb-3" key={group.application}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => toggleRow(group.application)}
                >
                  {expandedRows.has(group.application) ? '➖' : '➕'}
                </button>
                <strong>Application:</strong> {group.application}
              </div>
              {expandedRows.has(group.application) && renderColumns(group.entries)}
            </div>
          </div>
        ))}

      {/* Group by Client & Application */}
      {groupingType === 'ClientAndApplication' &&
        grouped.map((group) => (
          <div className="card border-warning shadow-sm mb-4" key={group.client}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => toggleRow(group.client)}
                >
                  {expandedRows.has(group.client) ? '➖' : '➕'}
                </button>
                <strong>Client:</strong> {group.client}
              </div>

              {expandedRows.has(group.client) &&
                group.applications.map((app, idx) => (
                  <div className="card border-info shadow-sm mt-3" key={idx}>
                    <div className="card-body">
                      <h6>Application: {app.application}</h6>
                      {renderColumns(app.entries)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Board;
