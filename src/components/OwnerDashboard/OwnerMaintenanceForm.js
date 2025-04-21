import React, { useState } from 'react';
import './OwnerMaintenanceForm.css';
import axios from 'axios';
 
const OwnerMaintenanceForm = () => {
  const [form, setForm] = useState({
    RequestID:'',
    agentName: '',
    agentContactNo: '',
    status: 'Pending',
    serviceBill: ''
  });
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const token = localStorage.getItem('ownerToken');
      await axios.post('http://localhost:5162/api/maintenance/submit', form, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
 
      alert('Service submitted successfully');
      setForm({ agentName: '', agentContactNo: '', status: 'Pending', serviceBill: '' });
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };
 
  return (
    <div className="owner-maintenance-form">
      <h2>Maintenance Service Form</h2>
      <form onSubmit={handleSubmit}>
        <label> Request ID </label>
        <input name="RequestID" value = {form.RequestID} onChange={handleChange} required />
        <label>Agent Name</label>
        <input name="agentName" value={form.agentName} onChange={handleChange} required />
 
        <label>Agent Contact No</label>
        <input name="agentContactNo" value={form.agentContactNo} onChange={handleChange} required />
 
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
 
        <label>Service Bill</label>
        <input name="serviceBill" value={form.serviceBill} onChange={handleChange} required />
 
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
 
export default OwnerMaintenanceForm;
 