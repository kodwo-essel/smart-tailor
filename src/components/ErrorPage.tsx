import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  code?: string;
  title?: string;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  code = '404', 
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been moved.'
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <i className="ri-scissors-cut-line text-6xl text-[#1A2A3A]"></i>
          </div>
          <h1 className="text-9xl font-bold text-[#1A2A3A] mb-6">{code}</h1>
          <h2 className="text-2xl font-semibold text-[#1A2A3A] mb-3">{title}</h2>
          <p className="text-gray-600 mb-8">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#1A2A3A] text-white font-medium rounded-xl hover:bg-[#2F2F2F] transition-colors"
          >
            <i className="ri-home-line mr-2"></i>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
