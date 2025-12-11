import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    subtitle: 'Perfect for getting started',
    price: '$0',
    period: '/ forever',
    buttonText: 'Get Started',
    buttonStyle: 'bg-white text-[#1A2A3A] hover:bg-[#D9C7A8]',
    popular: false,
    features: [
      'Up to 10 clients',
      'Basic measurement templates',
      '5 orders per month',
      'Email support'
    ]
  },
  {
    name: 'Pro',
    subtitle: 'For growing tailoring businesses',
    price: '$9.99',
    period: '/ per month',
    buttonText: 'Start Free Trial',
    buttonStyle: 'bg-[#1A2A3A] text-white hover:bg-[#2F2F2F]',
    popular: true,
    features: [
      'Up to 100 clients',
      'All measurement templates',
      'Unlimited orders',
      'Priority email support',
      'Upload cloth photos (50 photos)',
      'Advanced custom templates',
      'Basic analytics'
    ]
  },
  {
    name: 'Premium',
    subtitle: 'For established tailoring studios',
    price: '$19.99',
    period: '/ per month',
    buttonText: 'Start Free Trial',
    buttonStyle: 'bg-white text-[#1A2A3A] hover:bg-[#D9C7A8]',
    popular: false,
    features: [
      'Unlimited clients',
      'All measurement templates',
      'Unlimited orders',
      '24/7 priority support',
      'Unlimited cloth photos',
      'Advanced custom templates',
      'Advanced business analytics',
      'Multi-user access'
    ]
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl text-[#1A2A3A] mb-6" style={{ fontFamily: '"Russo One", sans-serif' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-[#2F2F2F] max-w-3xl mx-auto">
            Choose the perfect plan for your tailoring business. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#F7F6F3] rounded-2xl p-8 ${
                plan.popular ? 'shadow-xl border-4 border-[#1A2A3A] transform md:-translate-y-4' : 'shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="inline-block px-4 py-1 bg-[#1A2A3A] text-white text-xs font-bold rounded-full mb-4 whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-lg font-bold text-[#1A2A3A] mb-2" style={{ fontFamily: '"Russo One", sans-serif' }}>
                {plan.name}
              </h3>
              <p className="text-sm text-[#2F2F2F] mb-6">{plan.subtitle}</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#1A2A3A]" style={{ fontFamily: '"Russo One", sans-serif' }}>
                  {plan.price}
                </span>
                <span className="text-base text-[#2F2F2F] ml-2">{plan.period}</span>
              </div>
              <button
                className={`block w-full px-6 py-4 text-base font-bold rounded-lg transition-colors whitespace-nowrap mb-4 text-center ${plan.buttonStyle}`}
                style={{ fontFamily: '"Russo One", sans-serif' }}
              >
                {plan.buttonText}
              </button>
              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full mt-0.5 bg-[#D9C7A8]">
                      <Check className="w-3 h-3 text-[#1A2A3A]" />
                    </div>
                    <span className="text-sm text-[#1A2A3A]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
