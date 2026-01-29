"use client"
import {
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  // Whatsapp,
} from "lucide-react"

import Link from "next/link"
import { useDomain } from "../store/domain"

export default function FooterUI() {
  const domain = useDomain((state) => state.domain)
  return (
    <footer className="relative bg-gradient-to-br from-gray-100 to-gray-200 border-t border-[#3bb77e] mt-6">
      {/* top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3bb77e] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* logo section */}
          <div className="bg-white rounded-2xl shadow-lg border p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3bb77e] to-[#3bb77e]" />

            <img
              src={domain?.shop_logo || "/shop-logo.png"}
              alt={domain?.name || "Shop Logo"}
              className="w-36 h-36 object-contain mx-auto rounded-xl transition-transform duration-300 hover:scale-110"
            />

            <h4 className="mt-4 text-xl font-bold text-gray-900">
              {domain?.name || "Your Shop Name"}
            </h4>
            <p className="text-sm text-gray-500 italic">
              Your trusted online shopping destination
            </p>
          </div>

          {/* info cards */}
          <div className="md:col-span-2 space-y-6">
            {/* address */}
            <div className="bg-white p-6 rounded-2xl shadow border flex items-start gap-4 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3bb77e] to-[#3bb77e] flex items-center justify-center text-white">
                <MapPin size={20} />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  Store Address
                </h5>
                <p className="text-sm text-gray-600">
                  {domain?.shop_address || "123 Main St, City, Country"}
                </p>
              </div>
            </div>

            {/* contact */}
            <div className="bg-white p-6 rounded-2xl shadow border flex items-start gap-4 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3bb77e] to-[#3bb77e] flex items-center justify-center text-white">
                <Phone size={20} />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  Contact Number
                </h5>
                <p className="text-sm text-gray-600">
                  {domain?.phone || "+880 17xxxxxxx"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-10" />

        {/* Social Media Section */}
        <div className="bg-[#f8f9fa] py-8 text-center">
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-[#3bb77e]"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-[#3bb77e]">
              Terms & Conditions
            </Link>
          </div>
          <h2 className="text-lg font-bold mb-4">Join Us On Social Media</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="#"
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-[#3bb77e] transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-[#3bb77e] transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-[#3bb77e] transition-colors"
            >
              <Youtube size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-[#3bb77e] transition-colors"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* tiny footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          © 2026 Shop Name. All Rights Reserved. <br />
          System developed by{" "}
          <Link
            href="https://funnelliner.com/"
            className="text-[#3bb77e] hover:underline"
          >
            Funnel Liner
          </Link>
        </div>
      </div>
    </footer>
  )
}
