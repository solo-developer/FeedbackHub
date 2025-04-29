import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ConsumerSidebar = () => {

    return (
        <nav
            id="offcanvasSidebar"
            className={`col-lg-2 bg-light sidebar  'd-block'`}
            style={{ minHeight: '100vh', paddingTop: '1rem', borderRight: '1px solid #dee2e6' }}
        >
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link fw-semibold text-dark active" href="#">Dashboard</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-dark" href="#">Feedbacks</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-dark" href="#">Users</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-dark" href="#">Settings</a>
                </li>
            </ul>
        </nav>
    );
}

export default ConsumerSidebar;

