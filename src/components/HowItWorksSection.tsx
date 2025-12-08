const steps = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Sign up in seconds and set up your tailoring studio profile with your business details.'
  },
  {
    number: '02',
    title: 'Add Clients',
    description: 'Import or manually add client information, measurements, and preferences to build your database.'
  },
  {
    number: '03',
    title: 'Manage Orders',
    description: 'Create orders, track progress, and deliver exceptional service with organized workflows.'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#F7F6F3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl text-[#1A2A3A] mb-6" style={{ fontFamily: '"Russo One", sans-serif' }}>
            How It Works
          </h2>
          <p className="text-xl text-[#2F2F2F] max-w-3xl mx-auto">
            Get started in minutes and transform how you manage your tailoring business.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D9C7A8] rounded-full mb-6">
                <span className="text-lg font-bold text-[#1A2A3A]" style={{ fontFamily: '"Russo One", sans-serif' }}>
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1A2A3A] mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
                {step.title}
              </h3>
              <p className="text-base text-[#2F2F2F] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
