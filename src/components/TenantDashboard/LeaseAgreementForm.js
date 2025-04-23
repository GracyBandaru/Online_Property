import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LeaseAgreementForm.css'; // Keep your CSS
 
function LeaseAgreementForm() {
  const navigate = useNavigate();
  const [propertyID, setPropertyID] = useState('');
  const [tenantID, setTenantID] = useState(''); // You might get this from user context
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tenantSignaturePath, setTenantSignaturePath] = useState('');
  const [tenantDocumentPath, setTenantDocumentPath] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
 
    const tenantToken = localStorage.getItem('tenantToken'); // Assuming you have a tenant token
 
    if (!tenantToken) {
      setError('Tenant token not found. Please log in.');
      setSubmitting(false);
      return;
    }
 
    const leaseAgreementData = {
      PropertyID: parseInt(propertyID, 10),
      TenantID: parseInt(tenantID, 10),
      StartDate: startDate,
      EndDate: endDate,
      TenantSignaturePath: tenantSignaturePath,
      TenantDocumentPath: tenantDocumentPath,
    };
 
    try {
      const response = await axios.post(
        'http://localhost:5162/api/LeaseAgreement',
        leaseAgreementData,
        {
          headers: {
            'Content-Type': 'application/json', // Send as JSON now
            Authorization: `Bearer ${tenantToken}`,
          },
        }
      );
 
      console.log('✅ Lease agreement submitted:', response.data);
      setSuccessMessage('Lease agreement submitted successfully!');
      setSubmitting(false);
      // Optionally navigate the user after successful submission
      // navigate('/tenant/leases');
    } catch (error) {
      console.error('❌ Failed to submit lease agreement:', error);
      setError('Failed to submit lease agreement. Please try again.');
      if (error.response && error.response.data) {
        console.error('Server Error:', error.response.data);
        setError(error.response.data); // Display server-side error if available
      }
      setSubmitting(false);
    }
  };
 
  return (
    <div className="lease-agreement-form">
      <h1>Fill Lease Agreement</h1>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="propertyID">Property ID:</label>
          <input
            type="number"
            id="propertyID"
            value={propertyID}
            onChange={(e) => setPropertyID(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tenantID">Tenant ID:</label>
          <input
            type="number"
            id="tenantID"
            value={tenantID}
            onChange={(e) => setTenantID(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tenantSignaturePath">Link to Tenant Signature:</label>
          <input
            type="text"
            id="tenantSignaturePath"
            value={tenantSignaturePath}
            onChange={(e) => setTenantSignaturePath(e.target.value)}
            placeholder="e.g., /uploads/signatures/signature.jpg"
            required
          />
        </div>
        <div>
          <label htmlFor="tenantDocumentPath">Link to Tenant Document:</label>
          <input
            type="text"
            id="tenantDocumentPath"
            value={tenantDocumentPath}
            onChange={(e) => setTenantDocumentPath(e.target.value)}
            placeholder="e.g., /uploads/documents/document.pdf"
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Lease Agreement'}
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </form>
    </div>
  );
}
 
export default LeaseAgreementForm;
 