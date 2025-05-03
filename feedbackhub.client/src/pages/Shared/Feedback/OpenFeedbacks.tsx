import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackTypeDto } from '../../../types/feedbacktype/FeedbackTypeDto';
import { useToast } from '../../../contexts/ToastContext';
import { getAllFeedbackTypesAsync } from '../../../services/FeedbackTypeService';
import PagePanel from '../../../components/PagePanel';
import { useNavigate } from 'react-router-dom';
import GenericTable from '../../../components/GenericTable';
import { FeedbackFilterDto } from '../../../types/feedback/FeedbackFilterDto';
import { TicketStatus } from '../../../types/feedback/TicketStatus';
import { FeedbackBasicDetailDto } from '../../../types/feedback/FeedbackBasicDetailDto';
import { getAsync } from '../../../services/FeedbackService';
import { useAppSwitcher } from '../../../contexts/AppSwitcherContext';


const OpenFeedbacksPage: React.FC = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const { selectedApp } = useAppSwitcher();

    const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
    const pageSize = 10;
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<FeedbackBasicDetailDto[]>([]);
    const [filterDto, setFilter] = useState<FeedbackFilterDto>({
        Take: 10,
        Skip: 0,
        Status: TicketStatus.Open
    });

    useEffect(() => {
        fetchFeedbackTypes();
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [currentPage, filterDto,selectedApp]);

    const fetchFeedbackTypes = async () => {
        try {
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
        }
    }
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await getAsync(filterDto);

            if (response.Success) {
                setData(response.Data.Data);
                setTotalPages(Math.ceil(response.Data.TotalCount / pageSize));
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load feedbacks', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    const columns = React.useMemo(
        () => [
            {
                id: 'TicketId',
                header: 'Ticket Id',
                accessorFn: (row) => `#${row.TicketId}`
            },
            {
                id: 'CreatedBy',
                header: 'Raised By',
                accessorFn: (row) => row.CreatedBy
            },
            {
                id: 'FeedbackType',
                header: 'Type',
                accessorFn: (row) => row.FeedbackType
            },
            {
                id: 'Application',
                header: 'Application',
                accessorFn: (row) => row.Application
            },
                      
            {
                id: 'Title',
                header: 'Title',
                accessorFn: (row) => row.Title
            }, 
        ],
        []
    );

    return (
        <>
            <PagePanel title={`${filterDto.Status && TicketStatus[filterDto.Status]} Feedbacks`}>
                <GenericTable columns={columns} data={data} isLoading={isLoading} enablePagination
                    paginationType="server"
                    pageSize={pageSize}
                    serverPaginationProps={{
                        currentPage: currentPage - 1,
                        totalPages,
                        onPageChange: (newPage) => {
                            setCurrentPage(newPage);
                        },
                    }}
                />
            </PagePanel>          

        </>

    );
};

export default OpenFeedbacksPage;
