import React from 'react';
import { BoardFeedbackDetailDto, BoardFeedbackDto } from '../types/feedback/BoardFeedbackDto';
import { TicketStatus, TicketStatusLabels } from '../types/feedback/TicketStatus';
import FeedbackCard from './FeedbackCard';


type GroupSectionProps = {
  groupingType: 'Client' | 'Application' | 'ClientAndApplication';
  feedbacks: BoardFeedbackDto[];
  toggleRow: (key: string) => void;
  expandedRows: Set<string>;
};

const BoardGroupSection: React.FC<GroupSectionProps> = ({ groupingType, feedbacks, toggleRow, expandedRows }) => {
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
              <FeedbackCard key={feedback.Id} feedback={feedback} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const grouped = groupFeedbacks();
  const isEmpty =
    !feedbacks.length ||
    (groupingType === 'Client' && grouped.every(group => group.entries.flatMap(entry => entry.Feedbacks).length === 0)) ||
    (groupingType === 'Application' && grouped.every(group => group.entries.flatMap(entry => entry.Feedbacks).length === 0)) ||
    (groupingType === 'ClientAndApplication' && grouped.every(group =>
      group.applications.every(app => app.entries.flatMap(entry => entry.Feedbacks).length === 0)
    ));

  const noDataContent = (
    <div className="text-center text-muted mt-5">
      <h5>No feedbacks available</h5>
    </div>
  );

  const dataAvailableContent= (
    <>
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
                        onClick={() => toggleRow(app.Application)}
                      >
                        {expandedRows.has(app.Application) ? '➖' : '➕'}
                      </button>
                      <strong>Application:</strong> {app.Application}
                    </div>
                    {expandedRows.has(app.Application) &&
                      renderFeedbacks(app.entries.flatMap((entry) => entry.Feedbacks))}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </>
  );

  return isEmpty ? noDataContent : dataAvailableContent;
};

export default BoardGroupSection;
