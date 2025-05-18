import React, { useEffect, useMemo, useState } from 'react';
import PagePanel from '../../components/PagePanel';
import GenericTable from '../../components/GenericTable';
import { useToast } from '../../contexts/ToastContext';
import { RegistrationRequestDto } from '../../types/account/RegistrationRequestDto';
import { convertToUser, getAllAsync } from '../../services/RegistrationService';
import { RegistrationRequestFilterDto } from '../../types/account/RegistrationRequestFilterDto';
import Modal from '../../components/Modal';
import { ApplicationDto } from '../../types/application/ApplicationDto';
import { fetchApplications, getApplicationsByClientIdAsync } from '../../services/ApplicationService';
import Select from 'react-select';
import { UserConversionDto } from '../../types/account/UserConversionDto';

const RegistrationRequestPage: React.FC = () => {
    const pageSize = 10;
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [applications, setApplications] = useState<ApplicationDto[]>([]);
    const [selectedRegistrationRequest, setSelectedRegistrationRequest] = useState<RegistrationRequestDto | null>(null);
    const generateRandomPassword = useMemo((length = 10): string => {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const specialChars = "!@#$%^&*()_+";

        const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        let password = "";

        // Ensure that password meets the constraints
        password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)); // At least one uppercase
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)); // At least one lowercase
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length)); // At least one number
        password += specialChars.charAt(Math.floor(Math.random() * specialChars.length)); // At least one special character

        // Fill the remaining length with random characters from all categories
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Shuffle the password to ensure the order is random
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        return password;
    }, [selectedRegistrationRequest]);

    const [userConversionDto, setUserConversionData] = useState<UserConversionDto>({
        RegistrationRequestId: selectedRegistrationRequest?.Id ?? 0,
        Password: '',
        ApplicationIds: [],
    });

    const openModal = () => {
        if (selectedRegistrationRequest) {
            setUserConversionData({
                RegistrationRequestId: selectedRegistrationRequest.Id,
                Password: generateRandomPassword,
                ApplicationIds: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const [data, setData] = useState<RegistrationRequestDto[]>([]);
    const [filterDto, setFilter] = useState<RegistrationRequestFilterDto>({
        Take: pageSize,
        Skip: 0
    });
    const { showToast } = useToast();

    useEffect(() => {
        if (selectedRegistrationRequest) {
            openModal();
        }
    }, [selectedRegistrationRequest]);

    useEffect(() => {
        getClientSubscribedApplications();
    }, [selectedRegistrationRequest])

    useEffect(() => {
        fetchData();
    }, [filterDto, selectedRegistrationRequest]);

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            Skip: (currentPage - 1) * prev.Take,
        }));
    }, [currentPage]);

    const convertToUserClicked = async (registrationRequest: RegistrationRequestDto) => {
        setSelectedRegistrationRequest(registrationRequest);
        // openModal();
    };

    const convertToUserConfirmed = async () => {
        try {

            var response = await convertToUser(userConversionDto);
            if (response.Success) {
                closeModal();
                showToast('Registration request converted to user successfully.', 'success');
                await fetchData();
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }
        }
        catch (ex) {
            showToast('Failed to conver to user', 'error');
        }
    };

    const getClientSubscribedApplications = async () => {
        try {
            if (!selectedRegistrationRequest || selectedRegistrationRequest.Client.Id == 0) {
                return;
            }
            const response = await getApplicationsByClientIdAsync(selectedRegistrationRequest.Client.Id);

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

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await getAllAsync(filterDto);

            if (response.Success) {
                setData(response.Data.Data);
                setTotalCount(response.Data.TotalCount );
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

    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleChange = (selectedOptions: any[]) => {
        const selectedIds = selectedOptions.map(opt => opt.Id);
        setSelectedOptions(selectedOptions);
        setUserConversionData(prev => ({
            ...prev!,
            ApplicationIds: selectedIds
        }));

    };

    const handleInputChange = (newInputValue: string) => {
        setInputValue(newInputValue);
    };
    const modalFooter = (
        <div>
            <button onClick={closeModal} style={{ marginRight: '10px' }} className='pull-left'>
                Cancel
            </button>
            <button onClick={convertToUserConfirmed} className='btn btn-primary'>Convert to User</button>
        </div>
    );

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
                cell: ({ row }) => {
                    if (!row.original.IsUser) {
                        return (
                            <div>
                                <span
                                    role="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Convert to User"
                                    onClick={() => convertToUserClicked(row.original)}
                                >
                                    <i className="fas fa-exchange text-primary"></i>
                                </span>
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
                    pageSize={pageSize}
                    serverPaginationProps={{
                        currentPage: currentPage,
                        totalCount: totalCount,
                        onPageChange: (newPage) => {
                            setCurrentPage(newPage);
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
                />
            </PagePanel>
            {selectedRegistrationRequest != null &&
                <Modal show={showModal} onClose={closeModal} title="Convert to User" footer={modalFooter}>
                    <form onSubmit={convertToUserConfirmed}>
                        {/* show registration detail, name, email, client */}
                        <div className="form-group">
                            <label className="text-start w-100"> Requested By</label>
                            <input
                                type="text"
                                placeholder="Name"
                                value={selectedRegistrationRequest!.Name}
                                readOnly
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-start w-100"> Email</label>
                            <input
                                type="text"
                                placeholder="Name"
                                value={selectedRegistrationRequest!.Email.Value}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-start w-100"> Client</label>
                            <input
                                type="text"
                                value={selectedRegistrationRequest!.Client.Name}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        {/* place to enter password, default to some */}
                        <div className="form-group">
                            <label className="text-start w-100">Login Password</label>
                            <input
                                type="text"
                                placeholder="Password"
                                value={generateRandomPassword}
                                className="form-control"
                                onChange={(e) =>
                                    setUserConversionData(prev => ({
                                        ...prev,
                                        Password: e.target.value
                                    }))
                                }
                            />
                        </div>

                        {/* dropdown for applications */}
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

export default RegistrationRequestPage;