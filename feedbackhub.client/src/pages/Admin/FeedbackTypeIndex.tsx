import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import PagePanel from './PagePanel';
import { get } from '../../utils/HttpMiddleware';
import { useToast } from '../../contexts/ToastContext';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../../utils/HttpResponseParser';
import { FeedbackTypeDto } from '../../types/feedbacktype/FeedbackTypeDto';

const FeedbackTypeIndexPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<FeedbackTypeDto[]>([]);
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await get('/feedback-type');

            if (isSuccess(response)) {
                setData(parseData<FeedbackTypeDto[]>(response));
            }
            else {
                showToast(parseMessage(response), parseResponseType(response), {
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

    const columns = React.useMemo(
        () => [
            {
                id: 'name', // Explicitly set the id for each column
                header: 'Name',
                accessorKey: 'name', // accessorKey is the key in the data
            },
            {
                id: 'age', // Explicitly set the id for each column
                header: 'Age',
                accessorKey: 'age',
            },
            {
                id: 'country', // Explicitly set the id for each column
                header: 'Country',
                accessorKey: 'country',
            },
        ],
        []
    );


    //   const data = React.useMemo(
    //     () => [
    //       { name: 'John Doe', age: 28, country: 'USA' },
    //       { name: 'Jane Smith', age: 34, country: 'UK' },
    //       { name: 'Sam Johnson', age: 22, country: 'Canada' },
    //       { name: 'Anna Lee', age: 26, country: 'Australia' },
    //     ],
    //     []
    //   );

    return (
        <PagePanel title='Feedback Type Setup'>
            <GenericTable columns={columns} data={data} isLoading={isLoading} />
        </PagePanel>
    );
};

export default FeedbackTypeIndexPage;
