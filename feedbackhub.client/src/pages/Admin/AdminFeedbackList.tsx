import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { AdminFeedbackFilterDto } from '../../types/feedback/FeedbackFilterDto';
import { FeedbackTypeDto } from '../../types/feedbacktype/FeedbackTypeDto';
import { FeedbackBasicDetailDto } from '../../types/feedback/FeedbackBasicDetailDto';
import PagePanel from '../../components/PagePanel';
import GenericTable from '../../components/GenericTable';
import { getForAdminAsync } from '../../services/FeedbackService';
import { useToast } from '../../contexts/ToastContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchApplications } from '../../services/ApplicationService';
import { ApplicationDto } from '../../types/application/ApplicationDto';
import { getAllFeedbackTypesAsync } from '../../services/FeedbackTypeService';
import { fetchClients } from '../../services/ClientService';
import { ClientDto } from '../../types/client/ClientDto';
import { GenericDropdownDto } from '../../types/GenericDropdownDto';
import { getUserOptions } from '../../services/UserService';


const AdminFeedbackListPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [pageSize,setPageSize] = useState(10);

  const [filterDto, setFilterDto] = useState<AdminFeedbackFilterDto>({
    Take: pageSize,
    Skip: 0
  });

  useEffect(() => {
    fetchApplicationOptions();
    fetchFeedbackTypeOptions();
    fetchClientOptions();
    fetchUserOptions();
    handleSearch();
  }, []);

  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const fetchApplicationOptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetchApplications();

      if (response.Success) {
        setApplications(response.Data);
      }
      else {
        showToast(response.Message, response.ResponseType, {
          autoClose: 3000,
          draggable: true
        });
      }

    } catch (err) {
      showToast('Failed to load applications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
  const fetchFeedbackTypeOptions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllFeedbackTypesAsync();

      if (response.Success) {
        setFeedbackTypes(response.Data);
      }
      else {
        showToast(response.Message, response.ResponseType, {
          autoClose: 3000,
          draggable: true
        });
      }

    } catch (err) {
      showToast('Failed to load feedback types', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [clients, setClients] = useState<ClientDto[]>([]);
  const fetchClientOptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetchClients();
      if (response.Success) {
        setClients(response.Data);
      } else {
        showToast(response.Message, response.ResponseType, {
          autoClose: 3000,
          draggable: true
        });
      }
    } catch {
      showToast('Failed to load client organizations', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [userOptions, setUserOptions] = useState<GenericDropdownDto<number, string>[]>([]);
  const fetchUserOptions = async () => {
    try {
      setIsLoading(true);
      const response = await getUserOptions(true);
      if (response.Success) {
        setUserOptions(response.Data);
      } else {
        showToast(response.Message, response.ResponseType, {
          autoClose: 3000,
          draggable: true
        });
      }
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [searchFilters, setSearchFilters] = useState<AdminFeedbackFilterDto | null>(null);
  const [data, setData] = useState<FeedbackBasicDetailDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (key: keyof AdminFeedbackFilterDto, value: any) => {
    setFilterDto(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    const newFilters: AdminFeedbackFilterDto = {
      ...filterDto,
      Take: pageSize,
      Skip: 0
    };

    setSearchFilters(newFilters);
    setCurrentPage(1);
    fetchData(newFilters);
  };

  const handleReset = () => {
    setFilterDto({
      Take: pageSize,
      Skip: 0,
      FromDate: undefined,
      ToDate: undefined
    });
    setSearchFilters(null);
    setCurrentPage(1);
    fetchData({ Take: pageSize, Skip: 0 });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const updatedFilter = {
      ...filterDto,
      Skip: (newPage - 1) * pageSize,
      Take : pageSize
    }
    searchFilters && fetchData(updatedFilter);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    const updatedFilter = {
      ...filterDto,
      Skip:0,
      Take: pageSize
    }
    searchFilters && fetchData(updatedFilter);
  };

  const fetchData = async (request: AdminFeedbackFilterDto) => {
    try {
      setIsLoading(true);
      console.log('request',request);
      const response = await getForAdminAsync(request);
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
        <span
          role="button"
          title="View Feedback"
          onClick={() => navigate(`/feedback/${row.original.Id}`)}
        >
          <i className="fas fa-edit text-primary"></i>
        </span>
      )
    }
  ], []);

  return (
    <PagePanel title="Feedbacks">
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
            <label className="form-label">Client</label>
            <select
              className="form-select"
              value={filterDto.ClientId ?? ''}
              onChange={(e) =>
                handleFilterChange(
                  'ClientId',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <option value="">All</option>
              {clients.map((client) => (
                <option key={client.Id} value={client.Id}>
                  {client.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Application</label>
            <select
              className="form-select"
              value={filterDto.ApplicationId ?? ''}
              onChange={(e) =>
                handleFilterChange(
                  'ApplicationId',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <option value="">All</option>
              {applications.map((app) => (
                <option key={app.Id} value={app.Id}>
                  {app.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Created By</label>
            <select
              className="form-select"
              value={filterDto.UserId ?? ''}
              onChange={(e) =>
                handleFilterChange(
                  'UserId',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <option value="">All</option>
              {userOptions.map((user) => (
                <option key={user.Value} value={user.Value}>
                  {user.Label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">From Date</label>
            <DatePicker
              selected={filterDto.FromDate}
              onChange={(date: Date) => handleFilterChange('FromDate', date)}
              className="form-control"
              placeholderText="Start Date"
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">To Date</label>
            <DatePicker
              selected={filterDto.ToDate}
              onChange={(date: Date) => handleFilterChange('ToDate', date)}
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
          onPageSizeChange: handlePageSizeChange
        }}
      />
    </PagePanel>
  );
};

export default AdminFeedbackListPage;
