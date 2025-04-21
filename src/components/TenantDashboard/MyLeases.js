import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaFileContract, FaDownload, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBill } from 'react-icons/fa';
import './TenantDashboard.css';

function MyLeases() {
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedLeaseId, setExpandedLeaseId] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchMyLeases = async () => {
            setLoading(true);
            setError('');
            const tenantToken = localStorage.getItem('tenantToken');

            if (!tenantToken) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    'http://localhost:5162/api/LeaseAgreement/tenant/leases',
                    {
                        headers: {
                            Authorization: `Bearer ${tenantToken}`,
                        },
                    }
                );
                console.log('Response Data:', response.data);
                setLeases(response.data?.$values || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching leases:', err);
                setError('Failed to fetch lease agreements.');
                setLoading(false);
            }
        };

        fetchMyLeases();
    }, []);

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'Pending':
                return <span className="status pending"><FaClock /> Pending</span>;
            case 'Accepted':
                return <span className="status accepted"><FaCheckCircle /> Accepted</span>;
            case 'Rejected':
                return <span className="status rejected"><FaTimesCircle /> Rejected</span>;
            default:
                return <span className="status">{status}</span>;
        }
    };

    const handleViewDetails = (leaseId) => {
        setExpandedLeaseId(expandedLeaseId === leaseId ? null : leaseId);
    };

    const handleDoPayment = (lease) => {
        // Navigate to the PaymentForm, passing relevant lease information as state
        navigate(`/tenant/payment/form/${lease?.leaseID}`, { state: { lease } });
    };

    if (loading) {
        return <div className="loading">Loading lease agreements...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="leases-container">
            <h2>My Lease Agreements</h2>
            {leases.length === 0 ? (
                <div className="no-leases">
                    <p>You don't have any active leases yet.</p>
                </div>
            ) : (
                <div className="leases-list">
                    {leases.map(lease => (
                        <div key={lease?.leaseID} className={`lease-card ${expandedLeaseId === lease?.leaseID ? 'expanded' : ''}`}>
                            <div className="lease-header">
                                <FaFileContract className="lease-icon" />
                                <h3>{lease?.property?.propertyName || 'Property Details Unavailable'}</h3>
                            </div>

                            <div className="lease-details">
                                <p><FaCalendarAlt /> <strong>Term:</strong> {lease?.startDate ? new Date(lease.startDate).toLocaleDateString() : 'Invalid Date'} to {lease?.endDate ? new Date(lease.endDate).toLocaleDateString() : 'Invalid Date'}</p>
                                {lease?.property?.rentAmount && <p><strong>Rent:</strong> ${lease.property.rentAmount}/month</p>}
                                <p><strong>Status:</strong> {getStatusDisplay(lease?.status)}</p>
                                {expandedLeaseId === lease?.leaseID && (
                                    <div className="expanded-details">
                                        {lease?.property?.address && <p><strong>Address:</strong> {lease.property.address}, {lease.property.state}, {lease.property.country}</p>}
                                        {lease?.property?.amenities && <p><strong>Amenities:</strong> {lease.property.amenities}</p>}
                                        <p><strong>Lease ID:</strong> {lease?.leaseID}</p>
                                        <p><strong>Property ID:</strong> {lease?.propertyID}</p>
                                        <p><strong>Tenant ID:</strong> {lease?.tenantID}</p>
                                        {lease?.tenantSignaturePath && <p><strong>Tenant Signature Path:</strong> {lease.tenantSignaturePath}</p>}
                                        {lease?.tenantDocumentPath && <p><strong>Tenant Document Path:</strong> {lease.tenantDocumentPath}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="lease-actions">
                                {lease?.tenantDocumentPath && (
                                    <a href={lease.tenantDocumentPath} target="_blank" rel="noopener noreferrer" className="btn-download">
                                        <FaDownload /> View Lease Document
                                    </a>
                                )}
                                <button className="btn-view" onClick={() => handleViewDetails(lease?.leaseID)}>
                                    {expandedLeaseId === lease?.leaseID ? 'Hide Details' : 'View Details'}
                                </button>
                                {lease?.status === 'Accepted' && (
                                    <button className="btn-primary" onClick={() => handleDoPayment(lease)}>
                                        <FaMoneyBill /> Do Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyLeases;