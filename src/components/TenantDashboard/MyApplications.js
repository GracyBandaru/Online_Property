import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Changed import to Link
import axios from 'axios';
import './TenantDashboard.css';

import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const navigate = useNavigate(); // No longer directly used for this button

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('tenantToken');
      if (!token) {
        setError('Unauthorized. Please log in again.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:5162/api/RentalApplication/tenant', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data?.$values || [];
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
      case 'accepted':
        return 'status-approved';
      case 'rejected':
      case 'declined':
        return 'status-rejected';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="tenant-applications">
      <h2>My Rental Applications</h2>

      {loading ? (
        <div className="loading">
          <FaSpinner className="spinner" /> Loading applications...
        </div>
      ) : error ? (
        <div className="error-message">
          <FaExclamationCircle /> {error}
        </div>
      ) : applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        applications.map(app => (
          <div key={app.rentalApplicationID} className="application-card">
            <div className="application-info">
              <h3>{app.property?.propertyName || 'Property'}</h3>
              <p><strong>Address:</strong> {app.property?.address || app.permanentAddress}</p>
              <p><strong>Start Date:</strong> {app.tentativeStartDate?.split('T')[0]}</p>
            </div>

            <div className={`application-status ${getStatusClass(app.status)}`}>
              {app.status}
            </div>

            {['accepted', 'approved'].includes(app.status?.toLowerCase()) && (
              <div className="lease-button-container">
                <Link
                  to={`/tenant/lease-agreement/${app.rentalApplicationID}`}
                  className="lease-btn"
                >
                  Proceed to Lease Agreement
                </Link>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;