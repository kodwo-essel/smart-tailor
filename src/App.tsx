import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Orders from './components/Orders';
import Templates from './components/Templates';
import Settings from './components/Settings';
import Appointments from './components/Calendar';
import ClientDetails from './components/ClientDetails';
import OrderDetails from './components/OrderDetails';
import AppointmentDetails from './components/AppointmentDetails';
import Notifications from './components/Notifications';
import ErrorPage from './components/ErrorPage';
import PaymentCallback from './components/PaymentCallback';
import ForgotPassword from './components/ForgotPassword';
import OTPVerification from './components/OTPVerification';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import { ToastProvider } from './components/ToastContainer';
import { TourProvider } from './components/TourProvider';

function App() {
  return (
    <ToastProvider>
      <Router>
        <TourProvider>
          <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/appointments/:id" element={<AppointmentDetails />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<ErrorPage />} />
        </Routes>
        </TourProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
