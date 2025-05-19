import React from 'react';
import { Link } from 'react-router-dom';

const ConsumerSidebar = () => {
    return (
        <nav
            id="offcanvasSidebar"
            className="col-lg-2 bg-light sidebar d-block"
            style={{ minHeight: '100vh', paddingTop: '1rem', borderRight: '1px solid #dee2e6' }}
        >
            <ul className="nav flex-column mb-4">
                <li className="nav-item">
                    <Link to='/consumer/dashboard' className="nav-link fw-semibold text-dark active">Dashboard</Link>
                </li>
                <li className="nav-item">
                    <Link to='/consumer/feedback/new' className="nav-link text-dark">New Feedback</Link>
                </li>
                <li className="nav-item">
                    <Link to='/consumer/feedbacks/Open' className="nav-link text-dark">Open Feedbacks</Link>
                </li>
                <li className="nav-item">
                    <Link to='/consumer/feedbacks/Resolved' className="nav-link text-dark">Resolved Feedbacks</Link>
                </li>
                <li className="nav-item">
                    <Link to='/consumer/feedbacks/OnHold' className="nav-link text-dark">Backlogged Feedbacks</Link>
                </li>
                <li className="nav-item">
                    <Link to='/consumer/feedbacks/Declined' className="nav-link text-danger">Declined Feedbacks</Link>
                </li>
            </ul>

            <hr />

            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to='/consumer/notification-settings' className="nav-link text-dark">
                        Notification Settings
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default ConsumerSidebar;
