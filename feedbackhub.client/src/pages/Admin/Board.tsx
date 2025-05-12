import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBoardBacklogsAsync, getBoardFeedbacksAsync } from '../../services/FeedbackService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BoardFeedbackDto } from '../../types/feedback/BoardFeedbackDto';
import BoardGroupSection from '../../components/BoardGroupSection';

type FeedbackType = 'board' | 'backlog';

interface BoardProps {
  type: FeedbackType; 
}

const Board: React.FC<BoardProps> = ({ type }) => {
  const [groupingType, setGroupingType] = useState<'Client' | 'Application' | 'ClientAndApplication'>('Client');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [feedbacks, setFeedbacks] = useState<BoardFeedbackDto[]>([]);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (type == 'board')
      fetchActiveFeedbacks();
    else
    fetchBacklogs();

     return () => {
    console.log("Unmounted");
  };
  }, [type]);

  const fetchActiveFeedbacks = async () => {
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

  const fetchBacklogs = async () => {
    try {
      const response = await getBoardBacklogsAsync();
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

  return (
    <div className="container-fluid">
      {/* Controls */}
      <div className="d-flex justify-content-between mb-4">
        <div className="w-25">
          <select
            className="form-select"
            value={groupingType}
            onChange={(e) => setGroupingType(e.target.value as 'Client' | 'Application' | 'ClientAndApplication')}
          >
            <option value="Client">Group by Client</option>
            <option value="Application">Group by Application</option>
            <option value="ClientAndApplication">Group by Client & Application</option>
          </select>
        </div>
      </div>

      {/* Grouped feedbacks */}
      <BoardGroupSection
        groupingType={groupingType}
        feedbacks={feedbacks}
        toggleRow={toggleRow}
        expandedRows={expandedRows}
      />
    </div>
  );
};

export default Board;
