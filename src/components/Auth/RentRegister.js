import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome } from 'react-icons/fa';
import axios from 'axios';
import './Auth.css';
 
function RentRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactDetails: '',
        currentAddress: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const formRef = useRef();
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear confirm password error when either password field changes
        if (name === 'password' || name === 'confirmPassword') {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
        }
    };
 
    const handleBlur = (e) => {
        const { name, validity, value } = e.target;
        let customMessage = '';
 
        if (validity.patternMismatch) {
            switch (name) {
                case 'name':
                    customMessage = 'Name should only contain letters and spaces.';
                    break;
                case 'contactDetails':
                    customMessage = 'Phone number must be exactly 10 digits.';
                    break;
                case 'password':
                    customMessage =
                        'Password must include uppercase, lowercase, number, special character, and be at least 10 characters.';
                    break;
                case 'currentAddress':
                    customMessage = 'Address should only contain letters and spaces.';
                    break;
                default:
                    customMessage = 'Invalid input.';
            }
        }
 
        if (customMessage) {
            e.target.setCustomValidity(customMessage);
            e.target.reportValidity();
            setFieldErrors((prev) => ({ ...prev, [name]: customMessage }));
        } else {
            e.target.setCustomValidity('');
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
 
        // Custom validation for confirm password on blur
        if (name === 'confirmPassword' && value !== formData.password) {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
        } else if (name === 'confirmPassword') {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
        }
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
 
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }
 
        // Additional check for confirm password on submit
        if (formData.password !== formData.confirmPassword) {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
            return;
        }
 
        const registrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            contactDetails: formData.contactDetails,
            currentAddress: formData.currentAddress
        };
 
        try {
            const response = await axios.post('http://localhost:5162/api/Tenant/register', registrationData);
 
            if (response.data) {
                alert('Registration successful! You can now login.');
                navigate('/rent-login');
            }
        } catch (err) {
            setApiError(err.response?.data || 'Registration failed. Please try again.');
        }
    };
 
    return (
        <div className="auth-page" style={{ backgroundImage: "url('/assets/auth-bg.jpg')" }}>
            <div className="auth-container">
                <div className="auth-header">
                    <FaHome className="auth-icon" />
                    <h2>Tenant Registration</h2>
                    <p>Find your perfect home</p>
                </div>
 
                {apiError && <div className="auth-error">{apiError}</div>}
                {success && <div className="auth-success">Registration successful! Redirecting to login...</div>}
 
                <form onSubmit={handleSubmit} ref={formRef} noValidate>
                    {/* Name */}
                    <div className="input-group">
                        <FaUser />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            required
                            pattern="^[A-Za-z\s]+$"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
 
                    <div className="input-group">
                        <FaEnvelope />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                    {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
 
                    <div className="input-group">
                        <FaLock />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{10,}$"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                    {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
 
                    <div className="input-group">
                        <FaLock />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.confirmPassword && (
                            <span className="field-error">{errors.confirmPassword}</span>
                        )}
                    </div>
 
                    <div className="input-group">
                        <FaPhone />
                        <input
                            type="tel"
                            name="contactDetails"
                            placeholder="Phone Number"
                            required
                            pattern="^\d{10}$"
                            value={formData.contactDetails}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                    {fieldErrors.contactDetails && <span className="field-error">{fieldErrors.contactDetails}</span>}
 
                    <div className="input-group">
                        <FaHome />
                        <input
                            type="text"
                            name="currentAddress"
                            placeholder="Current Address"
                            required
                            pattern="^[A-Za-z\s]+$"
                            value={formData.currentAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                    {fieldErrors.currentAddress && <span className="field-error">{fieldErrors.currentAddress}</span>}
 
                    <button type="submit" className="auth-btn">
                        Register
                    </button>
                </form>
 
                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/rent-login">Login here</Link>
                    </p>
                    <p className="demo-link">
                        <Link to="/tenant">Go to Tenant Dashboard (Demo)</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
 
export default RentRegister;