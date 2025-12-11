import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <Navbar />
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8">
          
          <h1 className="text-3xl font-bold text-[#1A2A3A] mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Business information (business name, address)</li>
                <li>Client and order data you input into the system</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send notifications</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate with you about updates and support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as your account is active or as needed to provide services and comply with legal obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">6. Your Rights</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">7. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at privacy@tailor.com
              </p>
            </section>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;