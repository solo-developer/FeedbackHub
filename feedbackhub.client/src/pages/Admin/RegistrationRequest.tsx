import React, { useEffect, useState } from 'react';
import PagePanel from '../../components/PagePanel';
import GenericTable from '../../components/GenericTable';
import { useToast } from '../../contexts/ToastContext';
import { RegistrationRequestDto } from '../../types/account/RegistrationRequestDto';
import { getAllAsync } from '../../services/RegistrationService';
import { RegistrationRequestFilterDto } from '../../types/account/RegistrationRequestFilterDto';

const RegistrationRequestPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
        const [data, setData] = useState<RegistrationRequestDto[]>([]);
        const [filterDto, setFilter] = useState<RegistrationRequestFilterDto>({
            Take : 10,
            Skip : 0
        });
        const { showToast } = useToast();
        useEffect(() => {
            fetchData();
        }, [currentPage,filterDto]);

        const convertToUser= async () => {

        };
    
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getAllAsync(filterDto);
    
                if (response.Success) {
                    setData(response.Data.Data);
                    setTotalPages(response.Data.TotalCount)
                }
                else {
                    showToast(response.Message, response.ResponseType, {
                        autoClose: 3000,
                        draggable: true
                    });
                }
    
            } catch (err) {
                showToast('Failed to load registration requests', 'error');
            } finally {
                setIsLoading(false);
            }
        };

         const columns = React.useMemo(
                () => [
                    {
                        id: 'Name',
                        header: 'Requested By',
                        accessorKey: 'Name',
                    },
                    {
                        id: 'Email',
                        header: 'Email',
                       accessorFn: (row) => row.Email?.Value || ''
                    },
                    {
                        id: 'Client',
                        header: 'Client',
                       accessorFn: (row) => row.Client.Name || ''
                    },
                    {
                        id: 'Client_Code',
                        header: 'Client Code',
                       accessorFn: (row) => row.Client.Code || ''
                    },
                    {
                        id: 'Is_User_Converted',
                        header: 'Status',
                        accessorFn: (row) => row.IsUser, // returns true/false
                        cell: ({ getValue }) => {
                          const isUser = getValue<boolean>();
                          return (
                            <span
                              className={`badge ${isUser ? 'bg-success' : 'bg-danger'}`}
                            >
                              {isUser ? 'User' : 'Not A User'}
                            </span>
                          );
                        },
                    },
                    {
                        id: 'Action',
                        header: 'Action',
                        cell: ({ row }) =>{
                             if(!row.original.IsUser){
                               return (
                                    <div>
                                        <button
                                            className="btn btn-primary ml-2"
                                            onClick={() => convertToUser(row.original.Id)}
                                        >
                                            Convert to User
                                        </button>
                                    </div>
                                );
                             }  
                             return (<></>);                           
                        } 
                    }
                ],
                []
            );


return (
<>
            <PagePanel title='Registration Requests'>
                <GenericTable columns={columns} data={data} isLoading={isLoading} enablePagination
                    paginationType="server"
                    pageSize={10}
                    serverPaginationProps={{
                       currentPage: currentPage -1,
                        totalPages,
                        onPageChange: (newPage) => {
                            setCurrentPage(newPage);
                        },
                    }} 
                />
            </PagePanel>  
        </>

);
}

export default RegistrationRequestPage;