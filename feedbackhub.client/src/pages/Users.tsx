import React, { useEffect, useRef, useState } from 'react';
import PagePanel from '../components/PagePanel';
import GenericTable from '../components/GenericTable';
import { useToast } from '../contexts/ToastContext';
import { getUsersAsync, deleteUserAsync, undoDeleteUserAsync, resetPasswordAsync, updateApplicationAccessAsync } from '../services/UserService';
import { ClientUserDetailDto } from '../types/account/UserDetailDto';
import { UserFilterDto } from '../types/account/UserFilterDto';
import ConfirmDialog from "../components/ConfirmDialog";
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { ApplicationDto } from '../types/application/ApplicationDto';
import { getApplicationsByClientIdAsync } from '../services/ApplicationService';
import Select from 'react-select';

interface UsersPageProps {
    userType: 'All' | 'Client' | 'Admin';
}



const UsersPage: React.FC<UsersPageProps> = ({ userType }) => {
    const pageSize = 10;
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const tableRef = useRef<{ getSelectedIds: () => (string | number)[] }>(null);
    const [data, setData] = useState<ClientUserDetailDto[]>([]);
    const [filterDto, setFilter] = useState<UserFilterDto>({
        Take: 10,
        Skip: 0,
        UserType: userType
    });
    const { showToast } = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            UserType: userType
        }));
    }, [userType]);

    useEffect(() => {
        fetchData();
    }, [filterDto]);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUndoDeleteDialog, setShowUndoDeleteDialog] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState(0);
    // const getSelectedUserIds = () => {
    //     const selectedIds = tableRef.current?.getSelectedIds() || [];
    //     console.log('Selected row IDs:', selectedIds);
    //   };
    const ResetPasswordClicked = async (userId: number) => {
        try {
            const response = await resetPasswordAsync(userId);
            if (response.Success) {
                showToast("Password reset successfully. Password is sent in email", response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to reset password', 'error');
        }
    }

    const UndoDeleteClicked = async (userId: number) => {
        setSelectedUserId(userId);
        setShowUndoDeleteDialog(true);
    }

    const DeleteClicked = async (userId: number) => {
        setSelectedUserId(userId);
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = async () => {
        setShowDeleteDialog(false);
        try {
            const response = await deleteUserAsync(selectedUserId);

            if (response.Success) {
                await fetchData();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to delete user', 'error');
        }
    }

    const handleUndoDeleteConfirm = async () => {
        setShowUndoDeleteDialog(false);
        try {
            const response = await undoDeleteUserAsync(selectedUserId);

            if (response.Success) {
                await fetchData();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to restore user', 'error');
        }
    }

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await getUsersAsync(filterDto);

            if (response.Success) {
                setData(response.Data.Data);
                setTotalCount(response.Data.TotalCount);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load users', 'error');
        } finally {
            setIsLoading(false);
        }
    };



    const [selectedUserForApplicationAccess, setSelectedUserForApplicationAccess] = useState<ClientUserDetailDto | undefined>();
    const EditApplicationAccessClicked = (userId: number) => {
        let selectedUser = data.find(a => a.Id == userId);
        if (!selectedUser) return;
        setSelectedUserForApplicationAccess(selectedUser);
        setSelectedOptions(selectedUser.Applications.map(a => a.Id))
        openApplicationAccessModal();
    }
    const [applications, setApplications] = useState<ApplicationDto[]>([]);
    useEffect(() => {
        getClientSubscribedApplications();
    }, [selectedUserForApplicationAccess])

    const getClientSubscribedApplications = async () => {
        try {
            if (!selectedUserForApplicationAccess || !selectedUserForApplicationAccess.ClientId) {
                return;
            }
            const response = await getApplicationsByClientIdAsync(selectedUserForApplicationAccess.ClientId);

            if (response.Success) {
                setApplications(response.Data);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }
        }
        catch (ex) {
            showToast('Failed to load applications', 'error');
        }
    };

    const [showApplicationAccessModal, setShowApplicationAccessModal] = useState(false);
    const openApplicationAccessModal = () => {
        setShowApplicationAccessModal(true);
    };

    const closeApplicationAccessModal = () => setShowApplicationAccessModal(false);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleChange = (selectedOptions: any[]) => {
        setSelectedOptions(selectedOptions);
    };

    const handleInputChange = (newInputValue: string) => {
        setInputValue(newInputValue);
    };

    const saveApplicationAccess = async () => {
        console.log('selected user', selectedUserForApplicationAccess);
        console.log('selected applications', selectedOptions);
        if (!selectedUserForApplicationAccess) return;
        if (selectedOptions.length == 0) {
            showToast('Please select application/s', 'info');
        }
        try {
            const response = await updateApplicationAccessAsync({
                UserId: selectedUserForApplicationAccess.Id,
                ApplicationIds: selectedOptions.map(a => parseInt(a.Id))
            });

            if (response.Success) {
                setShowApplicationAccessModal(false);
                setSelectedOptions([]);
                setSelectedUserForApplicationAccess(undefined);
                showToast('Application access updated successfully', 'success', {
                    autoClose: 3000,
                    draggable: true
                });
                await fetchData();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to update application access', 'error');
        }
    }

    const columns = React.useMemo(
        () => [
            {
                id: 'Fullname',
                header: 'Name',
                accessorKey: 'Fullname',
                enableSorting: true,
            },
            {
                id: 'Email',
                header: 'Email',
                accessorFn: (row) => row.Email || ''
            },
            userType != 'Admin' && {
                id: 'Client',
                header: 'Client',
                accessorFn: (row) => row.Client || ''
            },
            userType != 'Admin' && {
                id: 'Applications',
                header: 'Applications',
                cell: ({ row }) => {
                    let applicationsJoinedByComma = row.original.Applications.join(',');
                    return (<label>{applicationsJoinedByComma}</label>);
                }
            },
            {
                id: 'Status',
                header: 'Status',
                cell: ({ row }) => {
                    if (row.original.IsDeleted)
                        return (<label className='text text-danger'>Deleted</label>);
                    return (<label className='text text-primary'>Active</label>);
                }
            },
            {
                id: 'Action',
                header: 'Action',
                cell: ({ row }) => {
                    return (
                        <div className="d-flex gap-2">
                            {userType == 'Client' &&
                                <span
                                    role="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Edit Application Access"
                                    onClick={() => EditApplicationAccessClicked(row.original.Id)}
                                >
                                    <i className="fas fa-lock text-primary"></i>
                                </span>}


                            {row.original.IsDeleted ? (
                                <span
                                    role="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Undo Delete"
                                    onClick={() => UndoDeleteClicked(row.original.Id)}
                                >
                                    <i className="fas fa-undo text-primary"></i>
                                </span>
                            ) : (
                                <span
                                    role="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Delete"
                                    onClick={() => DeleteClicked(row.original.Id)}
                                >
                                    <i className="fas fa-trash-alt text-danger"></i>
                                </span>
                            )}


                            <span
                                role="button"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Reset Password"
                                onClick={() => ResetPasswordClicked(row.original.Id)}
                            >
                                <i className="fas fa-key text-warning"></i>
                            </span>
                        </div>
                    );
                }
            }


        ].filter(Boolean),
        [userType, data]
    );


    const headerContent = (
        <div>
            <button onClick={() => { navigate('/admin/users/new') }} className="btn btn-primary btn-sm"><i className='fas fa-plus'></i>&nbsp; Add</button>
        </div>
    );

    const editApplicationAccessFooter = (
        <div>
            <button onClick={closeApplicationAccessModal} style={{ marginRight: '10px' }} className='pull-left'>
                Cancel
            </button>
            <button onClick={saveApplicationAccess} className='btn btn-primary'>Save</button>
        </div>
    );

    return (
        <>
            <PagePanel title={`${userType} Users`} headerContent={userType == 'Admin' && headerContent}>

                <GenericTable columns={columns} data={data} isLoading={isLoading} enablePagination
                    paginationType="server"
                    pageSize={pageSize}
                    getRowId={(row) => row.Id.toString()}
                    ref={tableRef}
                    serverPaginationProps={{
                        currentPage: currentPage,
                        totalCount: totalCount,
                        onPageChange: (newPage) => {
                            setCurrentPage(newPage);
                            setFilter(prev => ({
                                ...prev,
                                Take: prev.Take,
                                Skip: ((newPage - 1) * prev.Take)
                            }));
                        },
                        onPageSizeChange: (newSize) => {
                            setFilter(prev => ({
                                ...prev,
                                Take: newSize,
                                Skip: 0,

                            }));
                            setCurrentPage(1);
                        },
                    }}
                    onSortChange={(sortedColumns) => {
                        console.log('Sorted columns:', sortedColumns);
                    }}
                />
            </PagePanel>
            <ConfirmDialog
                show={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                onConfirm={() => handleDeleteConfirm()}
                title="Confirm Delete"
                message="Are you sure you want to delete this user? "
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
            <ConfirmDialog
                show={showUndoDeleteDialog}
                onHide={() => setShowUndoDeleteDialog(false)}
                onConfirm={() => handleUndoDeleteConfirm()}
                title="Confirm Restore"
                message="Are you sure you want to restore user deletion? "
                confirmText="Restore"
                cancelText="Cancel"
                variant="danger"
            />

            {selectedUserForApplicationAccess &&
                <Modal show={showApplicationAccessModal} onClose={closeApplicationAccessModal} title={`Application Access for  ${selectedUserForApplicationAccess?.Fullname}`} footer={editApplicationAccessFooter}>
                    <form onSubmit={saveApplicationAccess}>

                        <div className="form-group">
                            <label>Select Applications</label>
                            {
                                applications.length > 0 && <Select
                                    isMulti
                                    options={applications}
                                    getOptionLabel={(e) => e.Name}
                                    getOptionValue={(e) => e.Id.toString()}
                                    value={selectedOptions}
                                    onChange={handleChange}
                                    inputValue={inputValue}
                                    onInputChange={handleInputChange}
                                    onMenuOpen={() => console.log('Menu opened')}
                                    onMenuClose={() => console.log('Menu closed')}
                                />
                            }


                        </div>
                    </form>
                </Modal>
            }
        </>

    );
}

export default UsersPage;