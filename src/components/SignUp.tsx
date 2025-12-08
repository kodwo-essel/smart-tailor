import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TypewriterText from './TypewriterText';
import { useToast } from './ToastContainer';
import { authService } from '../services';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await authService.register({
        name: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password
      });
      showToast('Account created successfully! Redirecting...', 'success');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex">
      <div className="hidden lg:block lg:w-1/2 relative bg-[#1A2A3A]">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <TypewriterText 
              text="Start Your 14-Day Free Trial"
              className="text-5xl text-white mb-6"
              style={{ fontFamily: '"Russo One", sans-serif' }}
            />
            <p className="text-xl text-white/80">
              No credit card required. Get full access to all features and see how Smart Tailor transforms your business.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center bg-[#D9C7A8] rounded-full flex-shrink-0">
                  <i className="ri-check-line text-[#1A2A3A] text-sm"></i>
                </div>
                <span className="text-base">Unlimited client management</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center bg-[#D9C7A8] rounded-full flex-shrink-0">
                  <i className="ri-check-line text-[#1A2A3A] text-sm"></i>
                </div>
                <span className="text-base">Professional measurement templates</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center bg-[#D9C7A8] rounded-full flex-shrink-0">
                  <i className="ri-check-line text-[#1A2A3A] text-sm"></i>
                </div>
                <span className="text-base">Order tracking & analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center bg-[#D9C7A8] rounded-full flex-shrink-0">
                  <i className="ri-check-line text-[#1A2A3A] text-sm"></i>
                </div>
                <span className="text-base">Priority email support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-scissors-cut-line text-3xl text-[#1A2A3A]"></i>
            </div>
            <span className="text-2xl font-bold text-[#1A2A3A]" style={{ fontFamily: '"Russo One", sans-serif' }}>Smart Tailor</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl text-[#1A2A3A] mb-3" style={{ fontFamily: '"Russo One", sans-serif' }}>Create Account</h1>
            <p className="text-base text-[#2F2F2F]">Start managing your tailoring business today</p>
          </div>

          <button className="w-full px-6 py-4 bg-white text-[#2F2F2F] text-base font-medium rounded-lg border-2 border-[#E5E5E5] hover:border-[#1A2A3A] transition-all flex items-center justify-center space-x-3 mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-[#E5E5E5]"></div>
            <span className="px-4 text-sm text-[#2F2F2F]">or sign up with email</span>
            <div className="flex-1 h-px bg-[#E5E5E5]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#1A2A3A] mb-2">Full Name</label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-[#1A2A3A] mb-2">Business Name</label>
              <input
                id="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors"
                placeholder="Your Tailoring Studio"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1A2A3A] mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1A2A3A] mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors pr-12"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#2F2F2F] hover:text-[#1A2A3A] transition-colors"
                >
                  <i className={`ri-eye${showPassword ? '-off' : ''}-line text-lg`}></i>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A2A3A] mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#2F2F2F] hover:text-[#1A2A3A] transition-colors"
                >
                  <i className={`ri-eye${showConfirmPassword ? '-off' : ''}-line text-lg`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                id="terms"
                type="checkbox"
                required
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                className="w-4 h-4 mt-1 rounded border-2 border-[#E5E5E5] text-[#1A2A3A] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-[#2F2F2F] cursor-pointer">
                I agree to the <a href="#" className="text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors">Terms of Service</a> and <a href="#" className="text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-[#1A2A3A] text-white text-base font-bold rounded-lg hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ fontFamily: '"Russo One", sans-serif' }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-xl mr-2"></i>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#2F2F2F] mt-6">
            Already have an account? <Link to="/signin" className="text-[#1A2A3A] font-medium hover:text-[#2F2F2F] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}