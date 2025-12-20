import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useToast } from './ToastContainer';
import { authService } from '../services';
import apiService from '../services/api.service';


interface OTPVerificationProps {
  purpose?: string;
  email?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  modal?: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ purpose: propPurpose, email: propEmail, onSuccess: propOnSuccess, onCancel, modal = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const state = location.state as { email?: string; purpose?: string } || {};
  
  const purpose = propPurpose || state.purpose || 'verification';
  const email = propEmail || state.email;
  const onSuccess = propOnSuccess || (() => {
    if (purpose === 'verification') {
      navigate('/signin');
    }
  });
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!modal && authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [modal, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showToast('Please enter all 6 digits', 'error');
      return;
    }

    setLoading(true);

    try {
      const isAuthenticated = authService.isAuthenticated();
      const payload = isAuthenticated ? { otp: otpString } : { otp: otpString, email };
      
      await apiService.post('/api/otp/verify', payload);
      showToast('Verification successful!', 'success');
      onSuccess();
    } catch (error: any) {
      showToast(error.message || 'Invalid or expired OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    
    try {
      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated) {
        await apiService.post('/api/otp/resend', {});
      } else {
        await apiService.post('/api/otp/resend', { email });
      }
      
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      showToast('New verification code sent to your email', 'success');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to resend OTP';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (modal) {
    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-[#1A2A3A]">Enter Verification Code</h2>
          <p className="mt-2 text-sm text-[#2F2F2F]">
            We sent a 6-digit code to {email || 'your email'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 text-center text-sm font-semibold bg-white text-[#1A2A3A] border-2 border-[#E5E5E5] rounded-full focus:border-[#1A2A3A] focus:outline-none transition-colors"
              />
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full px-6 py-3 bg-[#1A2A3A] text-white text-sm font-bold rounded-full hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ fontFamily: '"Russo One", sans-serif' }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg mr-2"></i>
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>

            <button
              onClick={resendOTP}
              disabled={loading}
              className="w-full text-sm text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors"
            >
              Didn't receive the code? Resend
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full px-6 py-3 bg-white text-[#1A2A3A] text-sm font-medium rounded-full border-2 border-[#E5E5E5] hover:border-[#1A2A3A] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center mb-12">
            <div className="w-16 h-16 flex items-center justify-center">
              <i className="ri-scissors-cut-line text-4xl text-[#1A2A3A]"></i>
            </div>
          </Link>

          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-[#1A2A3A] mb-3" style={{ fontFamily: '"Russo One", sans-serif' }}>
              Verify Your Email
            </h1>
            <p className="text-base text-[#2F2F2F]">
              We sent a 6-digit verification code to {email || 'your email'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-bold bg-white text-[#1A2A3A] border-2 border-[#E5E5E5] rounded-full focus:border-[#1A2A3A] focus:outline-none transition-colors"
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full px-6 py-4 bg-[#1A2A3A] text-white text-base font-bold rounded-full hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ fontFamily: '"Russo One", sans-serif' }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-xl mr-2"></i>
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>

            <button
              onClick={resendOTP}
              disabled={loading}
              className="w-full text-sm text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors"
            >
              Didn't receive the code? Resend
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full px-6 py-3 bg-white text-[#1A2A3A] text-sm font-medium rounded-full border-2 border-[#E5E5E5] hover:border-[#1A2A3A] transition-colors mt-4"
              >
                Cancel
              </button>
            )}
          </div>

          <p className="text-center text-sm text-[#2F2F2F] mt-8">
            Need help? <Link to="/signin" className="text-[#1A2A3A] font-medium hover:text-[#2F2F2F] transition-colors">Back to Sign In</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsb3RoZXN8ZW58MHx8MHx8fDA%3D" 
          alt="Tailoring workspace" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default OTPVerification;