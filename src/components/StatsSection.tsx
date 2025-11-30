const stats = [
  { value: '2,500+', label: 'Active Tailors' },
  { value: '50,000+', label: 'Clients Managed' },
  { value: '100,000+', label: 'Orders Completed' },
  { value: '98%', label: 'Satisfaction Rate' }
];

export default function StatsSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-5xl font-bold text-[#1A2A3A] mb-3" style={{ fontFamily: '"Russo One", sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-base text-[#2F2F2F]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
