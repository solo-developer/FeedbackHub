import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminFeedbackFilterDto } from '../../types/feedback/FeedbackFilterDto';
import { FeedbackTypeDto } from '../../types/feedbacktype/FeedbackTypeDto';
import { FeedbackBasicDetailDto } from '../../types/feedback/FeedbackBasicDetailDto';
import { getAllFeedbackTypesAsync } from '../../services/FeedbackTypeService';
import PagePanel from '../../components/PagePanel';
import GenericTable from '../../components/GenericTable';
import { getAsync, getForAdminAsync } from '../../services/FeedbackService';
import { useToast } from '../../contexts/ToastContext';
import FullScreenLoader from '../../components/FullScreenLoader';


const AdminFeedbackListPage: React.FC = () => {
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<FeedbackBasicDetailDto[]>([]);
  const pageSize = 10;


  const [filterDto, setFilter] = useState<AdminFeedbackFilterDto>({
    Take: pageSize,
    Skip: 0,
  });


  useEffect(() => {
    fetchFeedbackTypes();
  }, []);

  useEffect(() => {
    setFilter(prev => ({
      ...prev,
      Skip: (currentPage - 1) * pageSize,
    }));
  }, [ currentPage]);

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
      const response = await getForAdminAsync(filterDto);
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
      id: 'Client',
      header: 'Client',
      accessorFn: (row: FeedbackBasicDetailDto) => row.Client
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
    {
      id: 'Action',
      header: 'Action',
      cell: ({ row }) => (
          <div>
               <span
                      role="button"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="View Feedback"
                      onClick={() => navigate(`/feedback/${row.original.Id}`)}
                  >
                     <i className="fas fa-edit text-primary"></i>
                  </span>
          </div>
      ),
  }
  ], []);

  return  (
    <PagePanel title='Feedbacks'>
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

export default AdminFeedbackListPage;
