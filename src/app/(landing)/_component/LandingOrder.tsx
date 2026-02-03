"use client";
import { ShoppingCart, Banknote, Plus, Minus, X } from "lucide-react";

const LandingOrder = ({ product, backgroundColor, fontColor, btnColor, btnTextColor, order_title, checkout_button_text } ) => {
  return (
    <section
      className="py-10"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: fontColor }}
        >
          {order_title || "তাই আর দেরি না করে আজই অর্ডার করুন"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4" style={{ color: fontColor }}>Billing Details</h3>

              <input
                type="text"
                placeholder="আপনার নাম লিখুন *"
                className="w-full mb-3 px-4 py-3 border rounded-md focus:outline-none"
                style={{ borderColor: fontColor }}
              />

              <input
                type="text"
                placeholder="আপনার মোবাইল নাম্বার লিখুন *"
                className="w-full mb-3 px-4 py-3 border rounded-md focus:outline-none"
                style={{ borderColor: fontColor }}
              />

              <input
                type="text"
                placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন *"
                className="w-full mb-3 px-4 py-3 border rounded-md focus:outline-none"
                style={{ borderColor: fontColor }}
              />

              <input
                type="text"
                placeholder="নোট লিখুন"
                className="w-full mb-3 px-4 py-3 border rounded-md focus:outline-none"
                style={{ borderColor: fontColor }}
              />
            </div>

            {/* Payment */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4" style={{ color: fontColor }}>Payment Method</h3>

              <label className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 mb-3">
                <input type="radio" name="payment" className="hidden" />
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg">
                  <Banknote size={22} />
                </div>
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay after receiving your order</p>
                </div>
              </label>

              <h6 className="text-gray-500 font-semibold mt-6 mb-3 border-b pb-2">Online Payment</h6>

              <label className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 mb-3">
                <input type="radio" name="payment" className="hidden" />
                <div className="w-10 h-10 bg-pink-500 flex items-center justify-center rounded-lg text-white font-bold">bK</div>
                <div>
                  <p className="font-semibold">bKash Payment</p>
                  <p className="text-sm text-gray-500">Secure online payment</p>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4" style={{ color: fontColor }}>Your Order</h3>

              {/* Product List */}
              <ul className="space-y-4">
                {product?.variations?.map((item, idx) => (
                  <li key={idx} className="relative flex justify-between items-center border rounded p-3">
                    <button className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-full">
                      <X size={16} />
                    </button>
                    <div className="flex items-center gap-4">
                      <img src={item.media || product.main_image} alt="" className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="font-semibold" style={{ color: fontColor }}>{item.variant}</p>
                        <p className="font-bold" style={{ color: fontColor }}>৳ {item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 border rounded" type="button"><Minus size={16} /></button>
                      <span>1</span>
                      <button className="p-2 border rounded" type="button"><Plus size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Subtotal */}
              <div className="flex justify-between font-semibold mt-4">
                <p style={{ color: fontColor }}>Subtotal</p>
                <p style={{ color: fontColor }}>৳ 0</p>
              </div>

              {/* Shipping */}
              <div className="flex justify-between font-semibold mt-2">
                <p style={{ color: fontColor }}>Shipping Charge</p>
                <p style={{ color: fontColor }}>৳ {product?.outside_dhaka || 0}</p>
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold mt-4 text-lg">
                <p style={{ color: fontColor }}>Total</p>
                <p style={{ color: fontColor }}>৳ {product?.outside_dhaka || 0}</p>
              </div>

              {/* Place Order */}
              <button
                className="w-full mt-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                style={{ background: btnColor, color: btnTextColor }}
              >
                <ShoppingCart size={20} />
                {checkout_button_text || "Place Order"} ৳ {product?.outside_dhaka || 0}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingOrder;
