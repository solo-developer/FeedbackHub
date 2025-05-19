import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { BoardFeedbackDetailDto, BoardFeedbackDto } from '../types/feedback/BoardFeedbackDto';
import { TicketStatus, TicketStatusLabels } from '../types/feedback/TicketStatus';
import FeedbackCard from './FeedbackCard';
import { FeedbackStatusUpdateDto } from '../types/feedback/FeedbackStatusUpdateDto';
import { updateStatusAsync } from '../services/FeedbackService';
import { useToast } from '../contexts/ToastContext';

type GroupSectionProps = {
  groupingType: 'Client' | 'Application' | 'ClientAndApplication';
  feedbacks: BoardFeedbackDto[];
  toggleRow: (key: string) => void;
  expandedRows: Set<string>;
};

const BoardGroupSection: React.FC<GroupSectionProps> = ({ groupingType, feedbacks, toggleRow, expandedRows }) => {
  const [allFeedbacks, setAllFeedbacks] = React.useState(feedbacks);
const {showToast} = useToast();
  const handleDragEnd =async (result: DropResult) => {
    const { draggableId,source, destination } = result;
    if (!destination) return;
    if(source.droppableId == destination.droppableId) return;

    const sourceGroup = allFeedbacks.map(group => ({
      ...group,
      Feedbacks: [...group.Feedbacks],
    }));

    for (const group of sourceGroup) {
      const groupedByStatus: { [key in TicketStatus]: BoardFeedbackDetailDto[] } = {
        [TicketStatus.Open]: [],
        [TicketStatus.Closed]: [],
        [TicketStatus.Declined]: [],
        [TicketStatus.Resolved]: [],
      };

      group.Feedbacks.forEach(fb => groupedByStatus[fb.Status].push(fb));

      const sourceList = groupedByStatus[+source.droppableId as TicketStatus];
      const destList = groupedByStatus[+destination.droppableId as TicketStatus];

      if (!sourceList || !destList) continue;

      const [moved] = sourceList.splice(source.index, 1);
      moved.Status = +destination.droppableId as TicketStatus;
      destList.splice(destination.index, 0, moved);

      group.Feedbacks = Object.values(groupedByStatus).flat();
    }
    setAllFeedbacks(sourceGroup);
    let feedbackStatusUpdateDto : FeedbackStatusUpdateDto = {
      FeedbackId : +draggableId,
      NewStatus : TicketStatus[destination.droppableId as keyof typeof TicketStatus] 
    }
        try {
            const response = await updateStatusAsync(feedbackStatusUpdateDto);
            if (response.Success) {   
                showToast('Status updated successfully.', 'success', {
                    autoClose: 3000,
                    draggable: true
                }); 
            }
            else{
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="d-flex justify-content-start mt-3">
          {Object.keys(feedbacksByStatus).map((status) => {
            const feedbackList = feedbacksByStatus[+status];

            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    className="col-3"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      borderRight: '2px solid #ddd',
                      paddingRight: '20px',
                      minHeight: '100px',
                    }}
                  >
                    <h6 className="text-center">{TicketStatusLabels[+status]}</h6>
                    {feedbackList.map((feedback, index) => (
                      <Draggable draggableId={String(feedback.Id)} index={index} key={feedback.Id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <FeedbackCard feedback={feedback} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    );
  };

  const groupFeedbacks = () => {
    if (groupingType === 'Client') {
      const clientMap: { [client: string]: BoardFeedbackDto[] } = {};
      allFeedbacks.forEach((fb) => {
        if (!clientMap[fb.Client]) clientMap[fb.Client] = [];
        clientMap[fb.Client].push(fb);
      });

      return Object.entries(clientMap).map(([Client, entries]) => ({ Client, entries }));
    }

    if (groupingType === 'Application') {
      const appMap: { [app: string]: BoardFeedbackDto[] } = {};
      allFeedbacks.forEach((fb) => {
        if (!appMap[fb.Application]) appMap[fb.Application] = [];
        appMap[fb.Application].push(fb);
      });

      return Object.entries(appMap).map(([Application, entries]) => ({ Application, entries }));
    }

    const clientMap = new Map<string, Map<string, BoardFeedbackDto[]>>();

    allFeedbacks.forEach((fb) => {
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

  const grouped = groupFeedbacks();
  const isEmpty =
    !allFeedbacks.length ||
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

  const dataAvailableContent = (
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
