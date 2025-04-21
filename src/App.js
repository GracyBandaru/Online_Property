import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout';
import Hero from './components/Hero/Hero';
import Contact from './components/Contact/Contact';
import About from './components/About/About';
import AboutLayout from './components/About/AboutLayout';
import Testimonials from './components/Testimonials/Testimonials';
import Team from './components/Team/Team';
import Press from './components/Press/Press';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import OwnerLatePayments from './components/OwnerDashboard/OwnerLatePayments';
import Payments from './components/TenantDashboard/Payments';
import PaymentForm from './components/TenantDashboard/PaymentForm'; // Import PaymentForm
import OwnerMaintenanceForm from './components/OwnerDashboard/OwnerMaintenanceForm'; // Adjust the path if necessary

// Authentication Components
import RentLogin from './components/Auth/RentLogin';
import RentRegister from './components/Auth/RentRegister';
import SellLogin from './components/Auth/SellLogin';
import SellRegister from './components/Auth/SellRegister';

// Owner Dashboard Components
import OwnerLayout from './components/OwnerDashboard/OwnerLayout';
import OwnerProfile from './components/OwnerDashboard/Profile';
import MyProperties from './components/OwnerDashboard/MyProperties';
import AddProperty from './components/OwnerDashboard/AddProperty';
import RentalApplications from './components/OwnerDashboard/RentalApplications';
import LeaseAgreements from './components/OwnerDashboard/LeaseAgreements';
import EditProfile from './components/OwnerDashboard/EditProfile';
import DeleteProfile from './components/OwnerDashboard/DeleteProfile';
import UploadDocument from './components/OwnerDashboard/OwnerDocuments';
import UpdateProperty from './components/OwnerDashboard/UpdateProperty';
import DeleteProperty from './components/OwnerDashboard/DeleteProperty';
import OwnerDocuments from './components/OwnerDashboard/OwnerDocuments'; // Import OwnerDocuments

// Tenant Dashboard Components
import TenantLayout from './components/TenantDashboard/TenantLayout';
 // Renamed to avoid conflict
import TenantProfile from './components/TenantDashboard/TenantProfile';
import PropertySearch from './components/TenantDashboard/PropertySearch';
import MyApplications from './components/TenantDashboard/MyApplications';
import MyLeases from './components/TenantDashboard/MyLeases';
import RentalApplicationForm from './components/TenantDashboard/RentalApplicationForm';
import LeaseAgreementForm from './components/TenantDashboard/LeaseAgreementForm';
import TenantMaintenanceService from './components/TenantDashboard/TenantMaintenanceService';
// import Payments from './components/TenantDashboard/Payments';
 // Import LeaseAgreementForm



import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          {/* Public routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Hero />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Testimonials />} />

            {/* Authentication Routes */}
            <Route path="/rent-login" element={<RentLogin />} />
            <Route path="/rent-register" element={<RentRegister />} />
            <Route path="/sell-login" element={<SellLogin />} />
            <Route path="/sell-register" element={<SellRegister />} />

            {/* About section nested routes */}
            <Route path="/about" element={<AboutLayout />}>
              <Route index element={<About />} />
              <Route path="team" element={<Team />} />
              <Route path="press" element={<Press />} />
            </Route>
          </Route>

          {/* Owner Dashboard Routes */}
          <Route path="/owner/*" element={<OwnerLayout />}>
            <Route index element={<OwnerProfile />} /> {/* OwnerProfile is now the index */}
            <Route path="profile" element={<OwnerProfile />} />
            <Route path="properties" element={<MyProperties />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="edit-property/:id" element={<UpdateProperty />} />
            <Route path="delete-property/:id" element={<DeleteProperty />} />
            <Route path="applications" element={<RentalApplications />} />
            <Route path="leases" element={<LeaseAgreements />} />
            <Route path="notifications" element={<OwnerLatePayments />}/>
            <Route path="documents/:id" element={<OwnerDocuments />} /> {/* ADDED THIS LINE */}
            <Route path="upload-document/:id" element={<UploadDocument />} /> {/* Keep this if you have a different upload component */}
            <Route path="editProfile" element={<EditProfile />} />
            <Route path="deleteProfile" element={<DeleteProfile />} />
<Route path="maintenance-service" element={<OwnerMaintenanceForm />} />

          </Route>

          {/* Tenant Dashboard Routes */}
          <Route path="/tenant/*" element={<TenantLayout />}>
            <Route index element={<PropertySearch />} /> {/* PropertySearch is now the index */}
            <Route path="profile" element={<TenantProfile />} />
            <Route path="search" element={<PropertySearch />} /> {/* Keep this for explicit /tenant/search route if needed */}
            <Route path="applications" element={<MyApplications />} />
            <Route path="leases" element={<MyLeases />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payment/form/:notificationID" element={<PaymentForm />} />
<Route path="maintenance" element={<TenantMaintenanceService />} />
                    {/* Application Routes */}
                    <Route path="apply/:propertyId" element={<RentalApplicationForm />} />
                    <Route path="apply" element={<RentalApplicationForm />} />
            {/* Lease Agreement Form Route - NOW WITH RELATIVE PATH */}
            <Route path="lease-agreement/:id" element={<LeaseAgreementForm />} />
          </Route>

          {/* 404 - Outside MainLayout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;