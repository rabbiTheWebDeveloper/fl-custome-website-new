"use client"
import { useState, useEffect } from "react"
import {
  ShoppingCart,
  Menu,
  Search,
  Home,
  Store,
  User,
  Facebook,
  Instagram,
  Youtube,
  ChevronDown,
  X,
  Phone,
  Globe,
  Shield,
  Truck,
  Award,
  Menu as MenuIcon,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample data
const categories = [
  { id: 1, name: "Electronics", icon: "📱", count: 42 },
  { id: 2, name: "Fashion", icon: "👕", count: 128 },
  { id: 3, name: "Home & Garden", icon: "🏠", count: 76 },
  { id: 4, name: "Beauty", icon: "💄", count: 54 },
  { id: 5, name: "Sports", icon: "⚽", count: 31 },
  { id: 6, name: "Books", icon: "📚", count: 89 },
  { id: 7, name: "Toys", icon: "🧸", count: 63 },
  { id: 8, name: "Health", icon: "💊", count: 47 },
]

const cartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1999,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 5499,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Laptop Bag",
    price: 2499,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop",
  },
]

const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
const cartTotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
)

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".dropdown")) {
        setIsCategoriesOpen(false)
        setIsCartOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Search suggestions
  const searchSuggestions = [
    "Wireless Headphones",
    "Smart Watch",
    "Laptop",
    "Smartphone",
    "Running Shoes",
    "Winter Jacket",
    "Gaming Keyboard",
    "Coffee Maker",
  ]

  return (
    <>
      {/* ================= PROMO BAR ================= */}
      <div className="bg-[#3bb77e]  text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Truck className="w-4 h-4" />
              <span>Free Shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Shield className="w-4 h-4" />
              <span>30-Day Return Policy</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Award className="w-4 h-4" />
              <span>100% Authentic Products</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <Globe className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-white shadow-sm"}`}
      >
        {/* ================= DESKTOP HEADER ================= */}
        <div className="hidden lg:block">
          {/* Top Row */}
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=200&h=200&fit=crop"
                  alt="ShopHub Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ShopHub</h1>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative dropdown">
                <div className="flex border-2 border-[#3bb77e] rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <input
                    type="text"
                    placeholder="Search for products, brands, and categories..."
                    className="flex-1 px-6 py-3 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                  />
                  <button className="bg-[#3bb77e] px-6 text-white transition-colors">
                    <Search size={20} />
                  </button>
                </div>

                {/* Search Suggestions */}
                {isSearchOpen && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border p-4 z-50">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(suggestion)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              {/* Cart */}
              <div className="relative dropdown">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                  <div className="text-left">
                    <div className="text-sm text-gray-500">Shopping Cart</div>
                    <div className="font-semibold text-gray-900">
                      ${cartTotal.toLocaleString()}
                    </div>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-[#3bb77e] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                </button>

                {/* Cart Dropdown */}
                {isCartOpen && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border z-50">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">
                          Shopping Cart ({totalCartItems})
                        </h3>
                        <button onClick={() => setIsCartOpen(false)}>
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border-b hover:bg-gray-50"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <div className="flex items-center justify-between mt-2">
                                <div className="text-lg font-bold text-green-600">
                                  ${item.price.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="w-6 h-6 rounded-full border flex items-center justify-center">
                                    -
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button className="w-6 h-6 rounded-full border flex items-center justify-center">
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Footer */}
                    <div className="p-4">
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ${cartTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href="/cart"
                          className="flex-1 border-2 border-[#3bb77e] text-[#3bb77e] hover:bg-green-50 py-3 rounded-lg text-center font-semibold transition-colors"
                        >
                          View Cart
                        </Link>
                        <Link
                          href="/checkout"
                          className="flex-1 bg-[#3bb77e] text-white py-3 rounded-lg text-center font-semibold transition-colors"
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Row */}
          <div className="border-t">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              {/* Categories Dropdown */}
              <div className="relative dropdown">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-3 bg-[#3bb77e] text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <MenuIcon className="w-5 h-5" />
                  <span className="font-semibold">All Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Categories Mega Menu */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-xl shadow-2xl border z-50 p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.id}`}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-green-600">
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {category.count} products
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t">
                      <Link
                        href="/all-categories"
                        className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
                      >
                        View All Categories <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Navigation */}
              <nav className="flex items-center gap-8">
                <Link
                  href="/"
                  className="font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Shop
                </Link>

                <Link
                  href="/about"
                  className="font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  About Us
                </Link>
              </nav>

              {/* Support Info */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    24/7 Support
                  </div>
                  <div className="text-sm text-gray-500">+1 (555) 123-4567</div>
                </div>
                <div className="flex items-center gap-4">
                  <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                  <Instagram className="w-5 h-5 text-gray-600 hover:text-pink-600 cursor-pointer transition-colors" />
                  <Youtube className="w-5 h-5 text-gray-600 hover:text-red-600 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE HEADER ================= */}
        <div className="lg:hidden">
          {/* Top Bar */}
          <div className="px-4 py-3 flex items-center justify-between bg-white border-b">
            {/* Logo and Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src="https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=100&h=100&fit=crop"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">ShopHub</span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="w-6 h-6 text-gray-600" />
              </button>
              <button
                className="relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="px-4 py-3 border-b bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 border rounded-lg px-4 py-2 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-green-600 text-white px-4 rounded-lg">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
              {/* Menu Items */}
              <div className="p-4">
                <nav className="space-y-1">
                  <Link
                    href="/"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </Link>
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MenuIcon className="w-5 h-5" />
                      <span>Categories</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Categories Submenu */}
                  {isCategoriesOpen && (
                    <div className="ml-8 space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                          <span className="ml-auto text-sm text-gray-500">
                            ({category.count})
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/shop"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <Store className="w-5 h-5" />
                    <span>Shop</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    <span>About Us</span>
                  </Link>
                </nav>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-center gap-6">
                    <Facebook className="w-6 h-6 text-gray-600" />
                    <Instagram className="w-6 h-6 text-gray-600" />
                    <Youtube className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
            <div className="flex justify-around py-3">
              <Link
                href="/"
                className="flex flex-col items-center text-green-600"
              >
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex flex-col items-center text-gray-600"
              >
                <MenuIcon className="w-6 h-6" />
                <span className="text-xs mt-1">Categories</span>
              </button>
              <Link
                href="/cart"
                className="flex flex-col items-center text-gray-600 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs mt-1">Cart</span>
                <span className="absolute -top-1 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar for Mobile */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Shopping Cart ({totalCartItems})
              </h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border-b">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-bold text-green-600">
                        ${item.price}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 rounded-full border">
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button className="w-6 h-6 rounded-full border">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${cartTotal}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1 border-2 border-green-600 text-green-600 py-3 rounded-lg text-center font-semibold"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg text-center font-semibold"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
