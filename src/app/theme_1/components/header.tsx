import { Menu, X, Search, ShoppingBag } from "lucide-react"
import { useState } from "react"

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-[1000] w-full h-20 flex justify-between items-center px-4 md:px-12 bg-[rgba(250,250,250,0.85)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.03)]">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-lg transition-transform hover:scale-110"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex gap-8 list-none">
          <li>
            <a
              href="#"
              className="text-sm font-medium text-[#444] hover:text-black transition-colors"
            >
              Shop
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm font-medium text-[#444] hover:text-black transition-colors"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm font-medium text-[#444] hover:text-black transition-colors"
            >
              Journal
            </a>
          </li>
        </ul>
      </nav>

      {/* Logo - Centered on mobile, left on desktop */}
      <div className="font-['Space_Grotesk'] font-bold text-xl md:text-2xl tracking-[-0.03em] absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
        glow<span className="text-[#ff4d8c]">.</span>co
      </div>

      <div className="flex gap-3 md:gap-5 items-center">
        <button className="hidden md:block text-lg transition-transform hover:scale-110">
          <Search className="w-6 h-6" />
        </button>
        <button className="relative text-lg transition-transform hover:scale-110">
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-1 -right-2 bg-[#ff4d8c] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            2
          </span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[rgba(250,250,250,0.98)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.03)] md:hidden">
          <nav className="px-4 py-6">
            <ul className="flex flex-col gap-4 list-none">
              <li>
                <a
                  href="#"
                  className="text-base font-medium text-[#444] hover:text-black transition-colors block py-2"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base font-medium text-[#444] hover:text-black transition-colors block py-2"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base font-medium text-[#444] hover:text-black transition-colors block py-2"
                >
                  Journal
                </a>
              </li>
              <li className="pt-2 border-t border-[rgba(0,0,0,0.05)]">
                <a
                  href="#"
                  className="text-base font-medium text-[#444] hover:text-black transition-colors flex items-center gap-2 py-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
