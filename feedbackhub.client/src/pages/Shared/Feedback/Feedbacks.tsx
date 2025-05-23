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
import DatePicker from 'react-datepicker';


const FeedbacksPage: React.FC = () => {
  const { ticketstatus } = useParams<{ ticketstatus: keyof typeof TicketStatus }>();

  const statusEnum = TicketStatus[ticketstatus as keyof typeof TicketStatus];

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedApp } = useAppSwitcher();

  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
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
    handleSearch();
  }, []);

  useEffect(() => {
    setFilter(prev => ({
      ...prev,
      Skip: (currentPage - 1) * pageSize,
      Status: statusEnum,
    }));
    handleSearch();
  }, [statusEnum, selectedApp]);


  const fetchFeedbackTypes = async () => {
    try {
      const response = await getAllFeedbackTypesAsync();
      if (response.Success) setFeedbackTypes(response.Data);
      else showToast(response.Message, response.ResponseType);
    } catch {
      showToast('Failed to load feedback types', 'error');
    }
  };

  const fetchData = async (filters: FeedbackFilterDto, page: number) => {
    try {
      setIsLoading(true);
      const request: FeedbackFilterDto = {
        ...filters,
        Skip: (page - 1) * filters.Take
      };

      const response = await getAsync(request);
      if (response.Success) {
        setData(response.Data.Data);
        setTotalCount(response.Data.TotalCount);
      } else {
        showToast(response.Message, response.ResponseType);
      }
    } catch {
      showToast('Failed to load feedbacks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [searchFilters, setSearchFilters] = useState<FeedbackFilterDto | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleFilterChange = (key: keyof FeedbackFilterDto, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    const newFilters: FeedbackFilterDto = {
      ...filterDto,
      Take: pageSize,
      Skip: 0,
      Status : statusEnum,
      FromDate: fromDate ? fromDate : undefined,
      ToDate: toDate ? toDate : undefined
    };

    setSearchFilters(newFilters);
    setCurrentPage(1);
    fetchData(newFilters, 1);
  };

  const handleReset = () => {
    setFilter({
      Take: pageSize,
      Skip: 0,
      Status : statusEnum
    });
    setSearchFilters(null);
    setFromDate(null);
    setToDate(null);
    setCurrentPage(1);
    fetchData({ Take: pageSize, Skip: 0,Status : statusEnum }, 1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (searchFilters) {
      fetchData(searchFilters, newPage);
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

  return (
    <PagePanel title={`${TicketStatus[statusEnum]} Feedbacks`}>
      <div className="card p-3 mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <label className="form-label">Feedback Type</label>
            <select
              className="form-select"
              value={filterDto.FeedbackTypeId ?? ''}
              onChange={(e) =>
                handleFilterChange(
                  'FeedbackTypeId',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <option value="">All</option>
              {feedbackTypes.map((f) => (
                <option key={f.Id} value={f.Id}>
                  {f.Type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={(date: Date) => setFromDate(date)}
              className="form-control"
              placeholderText="Start Date"
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">To Date</label>
            <DatePicker
              selected={toDate}
              onChange={(date: Date) => setToDate(date)}
              className="form-control"
              placeholderText="End Date"
            />
          </div>

          <div className="col-md-2 align-self-end">
            <input
              type="text"
              value={filterDto.Search ?? ''}
              onChange={(e) =>
                handleFilterChange(
                  'Search',
                  e.target.value ? e.target.value : undefined
                )
              }
              className="form-control"
              placeholder="Ticket Id/Title"
            />
          </div>

          <div className="col-md-2 align-self-end">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div className="col-md-2 align-self-end">
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>


      </div>

      <GenericTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        enablePagination
        paginationType="server"
        pageSize={pageSize}
        serverPaginationProps={{
          currentPage: currentPage,
          totalCount: totalCount,
          onPageChange: handlePageChange,
          onPageSizeChange: (newSize) => {
            setCurrentPage(1);
            if (searchFilters) {
              fetchData(searchFilters, 1);
            }
          }
        }}
      />
    </PagePanel>
  );
};

export default FeedbacksPage;
