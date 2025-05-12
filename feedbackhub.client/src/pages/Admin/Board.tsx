import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBoardBacklogsAsync, getBoardFeedbacksAsync } from '../../services/FeedbackService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BoardFeedbackDto } from '../../types/feedback/BoardFeedbackDto';
import BoardGroupSection from '../../components/BoardGroupSection';
import { faL } from '@fortawesome/free-solid-svg-icons';
import FullScreenLoader from '../../components/FullScreenLoader';

type FeedbackType = 'board' | 'backlog';

interface BoardProps {
  type: FeedbackType; 
}

const Board: React.FC<BoardProps> = ({ type }) => {
  const [groupingType, setGroupingType] = useState<'Client' | 'Application' | 'ClientAndApplication'>('Client');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [feedbacks, setFeedbacks] = useState<BoardFeedbackDto[]>([]);
  const [isLoading, setIsLoading] =useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (type == 'board')
      fetchActiveFeedbacks();
    else
    fetchBacklogs();

  }, [type]);

  const fetchActiveFeedbacks = async () => {
    try {
      setIsLoading(true);
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
    finally{
      setIsLoading(false);
    }
  };

  const fetchBacklogs = async () => {
    setIsLoading(true);
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
    finally{
      setIsLoading(false);
    }
  };

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  return isLoading? (<FullScreenLoader></FullScreenLoader>) :(
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
