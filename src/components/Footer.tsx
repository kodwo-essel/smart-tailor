export default function Footer() {
  return (
    <footer id="contact" className="py-16 px-6 lg:px-12 bg-[#2F2F2F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: '"Russo One", sans-serif' }}>
                Smart Tailor
              </span>
            </div>
            <p className="text-base text-white/70">Modern tools for modern dressmakers.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-base text-white/70 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-base text-white/70 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base text-white/70 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-base text-white/70 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base text-white/70 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-white/70 hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">© 2025 Smart Tailor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
