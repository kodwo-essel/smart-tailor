import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How does the 14-day free trial work?',
    answer: 'Sign up for any paid plan and get full access to all features for 14 days. No credit card required. Cancel anytime during the trial period with no charges.'
  },
  {
    question: 'Can I switch plans later?',
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits."
  },
  {
    question: 'Is my client data secure?',
    answer: 'Absolutely. We use bank-level encryption to protect your data. All information is stored securely and backed up regularly. We never share your data with third parties.'
  },
  {
    question: 'Can I import my existing client data?',
    answer: 'Yes, we provide easy import tools for CSV and Excel files. Our support team can also help you migrate data from other systems.'
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes! Free plan users get email support. Pro and Premium users get priority support with faster response times. Premium users also get 24/7 support access.'
  },
  {
    question: 'Can multiple people use the same account?',
    answer: 'Multi-user access is available on the Premium plan, allowing your team to collaborate seamlessly with role-based permissions.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#F7F6F3]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl text-[#1A2A3A] mb-6" style={{ fontFamily: '"Russo One", sans-serif' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-[#2F2F2F]">Everything you need to know about Smart Tailor</p>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-bold text-[#1A2A3A] pr-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
                  {faq.question}
                </h3>
                <div className={`w-8 h-8 flex items-center justify-center bg-[#F7F6F3] rounded-full flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5 text-[#1A2A3A]" />
                </div>
              </button>
              {openIndex === index && (
                <p className="text-base text-[#2F2F2F] mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
