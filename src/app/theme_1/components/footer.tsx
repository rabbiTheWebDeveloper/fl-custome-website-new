const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-[#111] to-[#1a1a1a] text-white pt-20 pb-8 px-4 md:px-12 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute top-0 right-[20%] w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] bg-[radial-gradient(circle,rgb(255,77,140)_0%,rgba(255,255,255,0)_70%)]" />

      <div className="relative max-w-[1400px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <div className="font-['Space_Grotesk'] font-bold text-3xl tracking-[-0.03em] mb-4">
              glow<span className="text-[#ff4d8c]">.</span>co
            </div>
            <p className="text-sm text-[#999] leading-relaxed mb-6">
              Radically transparent skincare for the main character. Made with
              botanical ingredients and lots of love.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all hover:bg-[rgba(255,77,140,0.2)] hover:scale-110"
              >
                <span className="text-sm">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all hover:bg-[rgba(255,77,140,0.2)] hover:scale-110"
              >
                <span className="text-sm">IG</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all hover:bg-[rgba(255,77,140,0.2)] hover:scale-110"
              >
                <span className="text-sm">TT</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-['Space_Grotesk'] font-semibold text-base mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Best Sellers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Gift Sets
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Travel Size
                </a>
              </li>
            </ul>
          </div>

          {/* Learn Column */}
          <div>
            <h4 className="font-['Space_Grotesk'] font-semibold text-base mb-6">
              Learn
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Ingredient Glossary
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Skin Quiz
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Journal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Our Story
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-['Space_Grotesk'] font-semibold text-base mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[#999] hover:text-white transition-colors"
                >
                  Track Order
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs text-[#666] text-center md:text-left">
              © 2025 glow.co. All rights reserved. Made with 💖 for your skin.
            </p>
            <p className="text-xs text-[#555]">
              UI generated by{" "}
              <a
                href="https://1ui.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff4d8c] hover:text-[#ff8f70] transition-colors"
              >
                1ui.dev
              </a>{" "}
              and made into real life using{" "}
              <a
                href="https://v0.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff4d8c] hover:text-[#ff8f70] transition-colors"
              >
                v0.app
              </a>
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-[#666] hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-[#666] hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-[#666] hover:text-white transition-colors"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
