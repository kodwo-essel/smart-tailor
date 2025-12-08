import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from './Loader';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (!reference) {
      setStatus('error');
      return;
    }

    // Simulate verification (you can add API call here if needed)
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        navigate('/settings');
      }, 2000);
    }, 1500);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader size="lg" />
            <h2 className="text-lg font-bold text-[#1A2A3A] mt-6 mb-3">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-6">
              <i className="ri-checkbox-circle-fill text-5xl text-green-600"></i>
            </div>
            <h2 className="text-lg font-bold text-[#1A2A3A] mb-3">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your subscription has been activated successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to settings...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-6">
              <i className="ri-close-circle-fill text-5xl text-red-600"></i>
            </div>
            <h2 className="text-lg font-bold text-[#1A2A3A] mb-3">Payment Failed</h2>
            <p className="text-gray-600 mb-6">There was an issue processing your payment.</p>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 bg-[#1A2A3A] text-white font-medium rounded-xl hover:bg-[#2F2F2F] transition-colors"
            >
              Back to Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
