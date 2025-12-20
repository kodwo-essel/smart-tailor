import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { authService } from '../services';
import { useToast } from './ToastContainer';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.login({
        email: formData.email,
        password: formData.password
      });
      showToast('Login successful! Redirecting...', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      if ((err.response?.status === 403 || err.status === 403) && err.message.includes('not verified')) {
        showToast('Account not verified. Verification code sent to your email.', 'success');
        navigate('/verify-otp', { state: { email: formData.email, purpose: 'verification' } });
      } else if (err.response?.status === 422 || err.status === 422) {
        showToast('Account not activated. Verification code sent to your email.', 'success');
        navigate('/verify-otp', { state: { email: formData.email, purpose: 'verification' } });
      } else {
        showToast(err.message || 'Login failed. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center mb-12">
            <div className="w-16 h-16 flex items-center justify-center">
              <i className="ri-scissors-cut-line text-4xl text-[#1A2A3A]"></i>
            </div>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1A2A3A] mb-2" style={{ fontFamily: '"Russo One", sans-serif' }}>Welcome Back</h1>
            <p className="text-sm text-[#2F2F2F]">Sign in to continue managing your tailoring business</p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#1A2A3A] mb-1">Email</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white text-[#1A2A3A] text-sm border border-[#E5E5E5] rounded-full focus:border-[#1A2A3A] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-xs font-medium text-[#1A2A3A]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors">Forgot your password?</Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-[#1A2A3A] text-sm border border-[#E5E5E5] rounded-full focus:border-[#1A2A3A] focus:outline-none transition-colors pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#2F2F2F] hover:text-[#1A2A3A] transition-colors"
                >
                  <i className={`ri-eye${showPassword ? '-off' : ''}-line text-sm`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#1A2A3A] text-white text-sm font-bold rounded-full hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
              style={{ fontFamily: '"Russo One", sans-serif' }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg mr-2"></i>
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#2F2F2F] mt-6">
            Don't have an account? <Link to="/signup" className="text-[#1A2A3A] font-medium hover:text-[#2F2F2F] transition-colors">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="/images/signin.jpg" 
          alt="Tailor workspace" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}