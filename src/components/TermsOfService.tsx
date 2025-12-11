import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <Navbar />
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8">
          
          <h1 className="text-3xl font-bold text-[#1A2A3A] mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Tailor's services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                Tailor provides a platform for managing tailoring business operations including client management, order tracking, and appointment scheduling.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not engage in any unauthorized or illegal activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Subscription fees are billed in advance. All payments are non-refundable except as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Tailor shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">6. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate this agreement at any time with or without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A2A3A] mb-4">7. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us at support@tailor.com
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

export default TermsOfService;