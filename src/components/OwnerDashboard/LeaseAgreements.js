import { FaFilePdf, FaCheck, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './OwnerDashboard.css';

function LeaseAgreements() {
    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchAgreements = async () => {
            try {
                const token = localStorage.getItem('ownerToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await axios.get(
                    'http://localhost:5162/api/Owner/lease-agreements',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log('Owner Lease Agreements Response:', response.data); // Keep this for debugging

                // Access the array of lease agreements correctly
                setAgreements(response.data?.leaseAgreements?.$values || []);

            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch lease agreements');
                setAgreements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAgreements();
    }, []);

    const handleAcceptClick = async (leaseId) => {
        const ownerToken = localStorage.getItem('ownerToken');
        if (!ownerToken) {
            alert('Authentication token not found.');
            return;
        }

        try {
            const statusResponse = await axios.put(
                `http://localhost:5162/api/LeaseAgreement/${leaseId}/owner/status`,
                { action: 'accept' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${ownerToken}`,
                    },
                }
            );

            console.log('Accept Status Response:', statusResponse.data);

            // Update the local state to reflect the accepted status
            setAgreements(prev =>
                prev.map(agreement =>
                    agreement.leaseID === leaseId ? { ...agreement, status: 'Accepted' } : agreement
                )
            );

            // **Remove the navigation here**
            // navigate(`/owner/seal-agreement/${leaseId}`);

        } catch (err) {
            alert(`Failed to accept agreement: ${err.response?.data?.message || err.message}`);
            console.error('Error accepting agreement:', err);
        }
    };

    const handleRejectClick = async (leaseId) => {
        try {
            const token = localStorage.getItem('ownerToken');
            await axios.put(
                `http://localhost:5162/api/Owner/lease-agreements/${leaseId}/status`,
                { action: 'reject' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setAgreements(prev =>
                prev.map(agreement =>
                    agreement.leaseID === leaseId ? { ...agreement, status: 'Rejected' } : agreement
                )
            );
        } catch (err) {
            alert(`Failed to reject agreement: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FaSpinner className="spinner-icon" />
                <p>Loading lease agreements...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <FaExclamationTriangle className="error-icon" />
                <h3>Error Loading Agreements</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    if (agreements.length === 0) {
        return (
            <div className="no-agreements">
                <h3>No Lease Agreements Found</h3>
                <p>You currently have no lease agreements.</p>
            </div>
        );
    }

    return (
        <div className="lease-agreements">
            <h2>Lease Agreements</h2>

            <div className="agreements-list">
                {agreements.map(agreement => (
                    <div key={agreement.leaseID} className="agreement-card">
                        <div className="agreement-info">
                            {agreement.tenant?.name && <h3>Tenant: {agreement.tenant.name}</h3>}
                            {agreement.property?.propertyName && <p>Property: {agreement.property.propertyName}</p>}
                            {agreement.status && <p><strong style={{ display: 'inline-block', width: '60px' }}>Status:</strong> <span className={`status-${agreement.status?.toLowerCase()}`}>{agreement.status}</span></p>}
                            {agreement.startDate && <p>Start Date: {new Date(agreement.startDate).toLocaleDateString()}</p>}
                            {agreement.endDate && <p>End Date: {new Date(agreement.endDate).toLocaleDateString()}</p>}
                            {agreement.tenantSignaturePath && <p>Tenant Signature Path: {agreement.tenantSignaturePath}</p>}
                            {agreement.tenantDocumentPath && <p>Tenant Document Path: {agreement.tenantDocumentPath}</p>}
                            {agreement.ownerDocument?.ownerDocumentPath && (
                                <a
                                    href={agreement.ownerDocument.ownerDocumentPath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="document-link"
                                >
                                    <FaFilePdf /> View Owner Document
                                </a>
                            )}
                            {/* Add other fields you want to display conditionally here */}
                        </div>

                        {agreement.status?.toLowerCase() === 'pending' && (
                            <div className="agreement-actions action-buttons">
                                <button
                                    className="button accept-btn"
                                    onClick={() => handleAcceptClick(agreement.leaseID)}
                                >
                                    <FaCheck className="icon" /> Accept
                                </button>
                                <button
                                    className="button reject-btn"
                                    onClick={() => handleRejectClick(agreement.leaseID)}
                                >
                                    <FaTimes className="icon" /> Reject
                                </button>
                            </div>
                        )}
                        {agreement.status?.toLowerCase() === 'accepted' && (
                            <div className="agreement-actions">
                                <span className={`status-accepted`}>Accepted</span>
                            </div>
                        )}
                        {agreement.status?.toLowerCase() === 'rejected' && (
                            <div className="agreement-actions">
                                <span className={`status-rejected`}>Rejected</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LeaseAgreements;