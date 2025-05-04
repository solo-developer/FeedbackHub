import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackTypeDto } from '../../../types/feedbacktype/FeedbackTypeDto';
import { useToast } from '../../../contexts/ToastContext';
import { getAllFeedbackTypesAsync } from '../../../services/FeedbackTypeService';
import PagePanel from '../../../components/PagePanel';
import { useNavigate, useParams } from 'react-router-dom';
import GenericTable from '../../../components/GenericTable';
import { FeedbackFilterDto } from '../../../types/feedback/FeedbackFilterDto';
import { TicketStatus } from '../../../types/feedback/TicketStatus';
import { FeedbackBasicDetailDto } from '../../../types/feedback/FeedbackBasicDetailDto';
import { getAsync } from '../../../services/FeedbackService';
import { useAppSwitcher } from '../../../contexts/AppSwitcherContext';


const FeedbacksPage: React.FC = () => {
  const { ticketstatus } = useParams<{ ticketstatus: keyof typeof TicketStatus }>();


  const statusEnum = TicketStatus[ticketstatus as keyof typeof TicketStatus];
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedApp } = useAppSwitcher();

  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<FeedbackBasicDetailDto[]>([]);
  const pageSize = 10;


  const [filterDto, setFilter] = useState<FeedbackFilterDto>({
    Take: pageSize,
    Skip: 0,
    Status: statusEnum,
  });

  useEffect(() => {
    const statusEnum = TicketStatus[ticketstatus as keyof typeof TicketStatus];
  
    setCurrentPage(1); 
    setFilter(prev => ({
      ...prev,
      Skip: 0,
      Status: statusEnum
    }));
  }, [ticketstatus]);
  

  useEffect(() => {
    fetchFeedbackTypes();
  }, []);

  useEffect(() => {
    setFilter(prev => ({
      ...prev,
      Skip: (currentPage - 1) * pageSize,
      Status: statusEnum,
    }));
  }, [statusEnum, currentPage, selectedApp]);

  useEffect(() => {
    fetchData();
  }, [filterDto]);

  const fetchFeedbackTypes = async () => {
    try {
      const response = await getAllFeedbackTypesAsync();
      if (response.Success) setFeedbackTypes(response.Data);
      else showToast(response.Message, response.ResponseType);
    } catch {
      showToast('Failed to load feedback types', 'error');
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getAsync(filterDto);
      if (response.Success) {
        setData(response.Data.Data);
        setTotalPages(Math.ceil(response.Data.TotalCount / pageSize));
      } else {
        showToast(response.Message, response.ResponseType);
      }
    } catch {
      showToast('Failed to load feedbacks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = React.useMemo(() => [
    {
      id: 'TicketId',
      header: 'Ticket Id',
      accessorFn: (row: FeedbackBasicDetailDto) => `#${row.TicketId}`
    },
    {
      id: 'CreatedBy',
      header: 'Raised By',
      accessorFn: (row: FeedbackBasicDetailDto) => row.CreatedBy
    },
    {
      id: 'FeedbackType',
      header: 'Type',
      accessorFn: (row: FeedbackBasicDetailDto) => row.FeedbackType
    },
    {
      id: 'Application',
      header: 'Application',
      accessorFn: (row: FeedbackBasicDetailDto) => row.Application
    },
    {
      id: 'Title',
      header: 'Title',
      accessorFn: (row: FeedbackBasicDetailDto) => row.Title
    },
  ], []);

  return (
    <PagePanel title={`${TicketStatus[statusEnum]} Feedbacks`}>
      <GenericTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        enablePagination
        paginationType="server"
        pageSize={pageSize}
        serverPaginationProps={{
          currentPage: currentPage - 1,
          totalPages,
          onPageChange: (newPage) => setCurrentPage(newPage),
        }}
      />
    </PagePanel>
  );
};

export default FeedbacksPage;
