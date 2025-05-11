import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
    NotificationTriggerStateLevel,
    UserFeedbackEmailSubscription,
} from '../../types/notification/UserEmailSubscription';
import { FeedbackTypeDto } from '../../types/feedbacktype/FeedbackTypeDto';
import { getAllFeedbackTypesAsync } from '../../services/FeedbackTypeService';
import { useToast } from '../../contexts/ToastContext';
import { getUserEmailSubscriptions, saveNotificationSettings } from '../../services/Consumer/SubscriptionService';
import { useAppSwitcher } from '../../contexts/AppSwitcherContext';
import PagePanel from '../../components/PagePanel';
import { EnumToDropdownOptions } from '../../utils/EnumHelper';

const NotificationSetting: React.FC = () => {
    const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeDto[]>([]);
    const [subscription, setSubscription] = useState<UserFeedbackEmailSubscription | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const { selectedApp } = useAppSwitcher();
    const statusOptions = EnumToDropdownOptions(NotificationTriggerStateLevel);

    useEffect(() => {
        fetchFeedbackTypes();
    }, []);

    useEffect(() => {
        fetchEmailSubscriptions();
    }, [selectedApp]);

    const fetchFeedbackTypes = async () => {
        try {
            const response = await getAllFeedbackTypesAsync();
            if (response.Success) {
                setFeedbackTypes(response.Data);
            } else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true,
                });
            }
        } catch {
            showToast('Failed to load feedback types', 'error');
        }
    };

    const fetchEmailSubscriptions = async () => {
        try {
            const response = await getUserEmailSubscriptions();
            if (response.Success) {
                setSubscription(response.Data);
            } else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true,
                });
            }
        } catch {
            showToast('Failed to load notification setting', 'error');
        }
    };

    const saveSettings = async () => {
        if (!subscription) return;

        setIsSubmitting(true);
        try {

            const response = await saveNotificationSettings(subscription);
            if (response.Success) {
                showToast('Preferences saved successfully', response.ResponseType, {
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
            showToast('Failed to save notification preferences', 'error');
        }
        finally{
            setIsSubmitting(false);
        }
    }

    const handleCheckboxChange = (id: number) => {
        if (!subscription) return;
        const currentIds = subscription.FeedbackTypeIds;
        const exists = currentIds.includes(id);

        setSubscription({
            ...subscription,
            FeedbackTypeIds: exists
                ? currentIds.filter(fId => fId !== id)
                : [...currentIds, id],
        });
    };

    // Create the selected options from enum values
    const selectedOptions = statusOptions.filter(opt =>
        subscription?.TriggerStates.includes(opt.value)
    );
    const handleSubmit = async () => {
       saveSettings();
    };

    if (!subscription || !selectedApp) return <div className="text-center mt-5">Loading...</div>;

    return (
        <PagePanel title='Notification Preferences'>
            <div className="container mt-4">

                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title">General Preferences</h5>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={subscription.NotifyOnCommentMade}
                                onChange={e => setSubscription({ ...subscription, NotifyOnCommentMade: e.target.checked })}
                                id="notifyComments"
                            />
                            <label className="form-check-label" htmlFor="notifyComments">
                                Notify on comments
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={subscription.NotifyOnStatusChange}
                                onChange={e => setSubscription({ ...subscription, NotifyOnStatusChange: e.target.checked })}
                                id="notifyStatus"
                            />
                            <label className="form-check-label" htmlFor="notifyStatus">
                                Notify on status change
                            </label>
                        </div>

                        {subscription.NotifyOnStatusChange && (
                            <div className="mt-2">
                                <label htmlFor="triggerStates" className="form-label">
                                    Trigger notifications for these statuses:
                                </label>

                                <Select
                                    isMulti
                                    options={statusOptions}
                                    value={selectedOptions}
                                    onChange={(selected) => {
                                        const values = (selected as typeof statusOptions).map(opt => opt.value);
                                        setSubscription({
                                            ...subscription,
                                            TriggerStates: values,
                                        });
                                    }}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Subscribed Feedback Types</h5>

                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="selectAll"
                                checked={feedbackTypes.length > 0 && feedbackTypes.every(type => subscription.FeedbackTypeIds.includes(type.Id))}
                                onChange={e => {
                                    const newIds = e.target.checked ? feedbackTypes.map(ft => ft.Id) : [];
                                    setSubscription({ ...subscription, FeedbackTypeIds: newIds });
                                }}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="selectAll">
                                Select / Deselect All Feedback Types
                            </label>
                        </div>

                        <div className="row">
                            {feedbackTypes.map(type => (
                                <div className="col-md-12" key={type.Id}>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={subscription.FeedbackTypeIds.includes(type.Id)}
                                            onChange={() => handleCheckboxChange(type.Id)}
                                            id={`feedback-${type.Id}`}
                                        />
                                        <label className="form-check-label" htmlFor={`feedback-${type.Id}`}>
                                            {type.Type}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-end">
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>

            </div>
        </PagePanel >

    );
};

export default NotificationSetting;
