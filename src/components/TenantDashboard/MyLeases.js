import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaFileContract, FaDownload, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBill } from 'react-icons/fa';
import './TenantDashboard.css';

function MyLeases() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [fullLeaseData, setFullLeaseData] = useState([]); // Store the raw response data
  const [resolvedLeases, setResolvedLeases] = useState({}); // Cache for resolved lease objects
  const [editingLeaseId, setEditingLeaseId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deletingLeaseId, setDeletingLeaseId] = useState(null);

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
        console.log('Raw Response Data:', response.data);
        setFullLeaseData(response.data?.$values || []); // Store the full array
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

  const findReferencedObject = (data, refId) => {
    if (data?.$id === refId) {
      return data;
    }
    if (Array.isArray(data)) {
      for (const item of data) {
        const found = findReferencedObject(item, refId);
        if (found) {
          return found;
        }
      }
    } else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        const found = findReferencedObject(data[key], refId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  const getFullLeaseObject = (lease) => {
    if (lease?.$ref) {
      if (resolvedLeases[lease.$ref]) {
        return resolvedLeases[lease.$ref];
      }
      const resolved = findReferencedObject(fullLeaseData, lease.$ref);
      if (resolved) {
        setResolvedLeases(prev => ({ ...prev, [lease.$ref]: resolved }));
        return resolved;
      }
      return undefined;
    }
    return lease;
  };

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

  const handleEditLease = (lease) => {
    const fullLease = getFullLeaseObject(lease);
    if (fullLease && fullLease.status.toLowerCase() !== 'accepted') {
      setEditingLeaseId(fullLease.leaseID);
      setEditFormData({
        propertyID: fullLease.propertyID,
        startDate: fullLease.startDate ? new Date(fullLease.startDate).toISOString().split('T')[0] : '',
        endDate: fullLease.endDate ? new Date(fullLease.endDate).toISOString().split('T')[0] : '',
        tenantSignaturePath: fullLease.tenantSignaturePath || '',
        tenantDocumentPath: fullLease.tenantDocumentPath || '',
      });
    } else if (fullLease?.status.toLowerCase() === 'accepted') {
      alert('Cannot edit an accepted lease agreement.');
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateLease = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const tenantToken = localStorage.getItem('tenantToken');

    if (!tenantToken) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `http://localhost:5162/api/LeaseAgreement/${editingLeaseId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${tenantToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setEditingLeaseId(null); // Exit edit mode
      setEditFormData({});
      fetchMyLeases(); // Refresh the lease list
    } catch (err) {
      console.error('Error updating lease:', err);
      setError(err.response?.data || 'Failed to update lease agreement.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLease = async (lease) => {
    const fullLease = getFullLeaseObject(lease);
    if (fullLease && fullLease.status.toLowerCase() !== 'accepted') {
      if (window.confirm(`Are you sure you want to delete lease agreement ${fullLease.leaseID}?`)) {
        setLoading(true);
        setDeletingLeaseId(fullLease.leaseID);
        setError('');
        const tenantToken = localStorage.getItem('tenantToken');

        if (!tenantToken) {
          setError('Authentication token not found.');
          setLoading(false);
          setDeletingLeaseId(null);
          return;
        }

        try {
          await axios.delete(
            `http://localhost:5162/api/LeaseAgreement/${fullLease.leaseID}`,
            {
              headers: {
                Authorization: `Bearer ${tenantToken}`,
              },
            }
          );
          setLeases(leases.filter(l => getFullLeaseObject(l)?.leaseID !== fullLease.leaseID));
        } catch (err) {
          console.error('Error deleting lease:', err);
          setError(err.response?.data || 'Failed to delete lease agreement.');
        } finally {
          setLoading(false);
          setDeletingLeaseId(null);
        }
      }
    } else if (fullLease?.status.toLowerCase() === 'accepted') {
      alert('Cannot delete an accepted lease agreement.');
    }
  };

  const handleDoPayment = (lease) => {
    const fullLease = getFullLeaseObject(lease);
    navigate(`/tenant/payment/form/${fullLease?.leaseID}`, { state: { lease: fullLease } });
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
      {leases.length === 0 && !loading && <div className="no-leases"><p>You don't have any active leases yet.</p></div>}
      <div className="leases-list">
        {leases.map(lease => {
          const fullLease = getFullLeaseObject(lease);
          return (
            <div key={lease?.$id} className={`lease-card ${editingLeaseId === fullLease?.leaseID ? 'editing' : ''}`}>
              <div className="lease-header">
                <FaFileContract className="lease-icon" />
                <h3>{fullLease?.property?.propertyName || 'Property Details Unavailable'}</h3>
              </div>

              {editingLeaseId === fullLease?.leaseID ? (
                <form onSubmit={handleUpdateLease} className="edit-form">
                  <div className="form-group">
                    <label htmlFor="propertyID">Property ID</label>
                    <input type="text" id="propertyID" name="propertyID" value={editFormData.propertyID} onChange={handleEditFormChange} readOnly />
                  </div>
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input type="date" id="startDate" name="startDate" value={editFormData.startDate} onChange={handleEditFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input type="date" id="endDate" name="endDate" value={editFormData.endDate} onChange={handleEditFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tenantSignaturePath">Tenant Signature Path</label>
                    <input type="text" id="tenantSignaturePath" name="tenantSignaturePath" value={editFormData.tenantSignaturePath} onChange={handleEditFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tenantDocumentPath">Tenant Document Path</label>
                    <input type="text" id="tenantDocumentPath" name="tenantDocumentPath" value={editFormData.tenantDocumentPath} onChange={handleEditFormChange} />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" className="btn-secondary" onClick={() => setEditingLeaseId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="lease-details">
                  <p><FaCalendarAlt /> <strong>Term:</strong> {fullLease?.startDate ? new Date(fullLease.startDate).toLocaleDateString() : 'Invalid Date'} to {fullLease?.endDate ? new Date(fullLease.endDate).toLocaleDateString() : 'Invalid Date'}</p>
                  {fullLease?.property?.rentAmount && <p><strong>Rent:</strong> ${fullLease.property.rentAmount}/month</p>}
                  <p><strong>Status:</strong> {getStatusDisplay(fullLease?.status)}</p>
                  <div className="expanded-details">
                    {fullLease?.property?.address && <p><strong>Address:</strong> {fullLease.property.address}, {fullLease.property.state}, {fullLease.property.country}</p>}
                    {fullLease?.property?.amenities && <p><strong>Amenities:</strong> {fullLease.property.amenities}</p>}
                    <p><strong>Lease ID:</strong> {fullLease?.leaseID}</p>
                    <p><strong>Property ID:</strong> {fullLease?.propertyID}</p>
                    <p><strong>Tenant ID:</strong> {fullLease?.tenantID}</p>
                    {fullLease?.tenantSignaturePath && <p><strong>Tenant Signature Path:</strong> {fullLease.tenantSignaturePath}</p>}
                    {fullLease?.tenantDocumentPath && <p><strong>Tenant Document Path:</strong> {fullLease.tenantDocumentPath}</p>}
                  </div>
                </div>
              )}

              <div className="lease-actions">
                {fullLease?.status?.toLowerCase() !== 'accepted' && editingLeaseId !== fullLease?.leaseID && (
                  <>
                    <button className="btn-secondary" onClick={() => handleEditLease(lease)}>
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteLease(lease)}
                      disabled={deletingLeaseId === fullLease?.leaseID}
                    >
                      {deletingLeaseId === fullLease?.leaseID ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
                {fullLease?.tenantDocumentPath && (
                  <a href={`/LeaseAgreements/LeaseAgreement.pdf`} target="_blank" rel="noopener noreferrer" className="btn-download">
                    <FaDownload /> View Lease Document
                  </a>
                )}
                {fullLease?.status === 'Accepted' && (
                  <button className="btn-primary" onClick={() => handleDoPayment(fullLease)}>
                    <FaMoneyBill /> Do Payment
                  </button>
                )}
                {loading && editingLeaseId === fullLease?.leaseID && <div className="loading-inline">Updating...</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyLeases;