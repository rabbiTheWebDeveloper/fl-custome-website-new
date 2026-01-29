import { ShoppingCart, CreditCard } from "lucide-react"

const sampleOrderDetails = {
  order_no: "ORD123456",
  created_at: "2026-01-20T12:34:56Z",
  online_payment_id: null,
  pricing: {
    grand_total: 1200,
    shipping_cost: 50,
  },
  order_details: [
    {
      id: 1,
      product: {
        product_name: "Product A",
        main_image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      },
      product_qty: 2,
      unit_price: 500,
    },
    {
      id: 2,
      product: {
        product_name: "Product B",
        main_image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      },
      product_qty: 1,
      unit_price: 200,
    },
  ],
}

const OrderSuccessfull = () => {
  const orderDetails = sampleOrderDetails

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <ShoppingCart className="mx-auto mb-2 text-green-500" size={48} />
          <h2 className="text-3xl font-bold text-gray-800">
            Thank You For Purchasing
          </h2>
          <p className="text-gray-600 mt-2">
            Your order has been received successfully.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <li>
              <p className="text-gray-500 font-medium">Order number</p>
              <p className="font-semibold">{orderDetails.order_no}</p>
            </li>

            <li>
              <p className="text-gray-500 font-medium">Date</p>
              <p className="font-semibold">{orderDetails.created_at}</p>
            </li>

            <li>
              <p className="text-gray-500 font-medium">Payment method</p>
              <p className="font-semibold">
                {orderDetails.online_payment_id ? (
                  <span className="flex items-center gap-1">
                    <CreditCard size={16} /> Online Payment
                  </span>
                ) : (
                  "Cash on delivery"
                )}
              </p>
            </li>

            <li>
              <p className="text-gray-500 font-medium">Total</p>
              <p className="font-semibold text-green-600">
                ৳{" "}
                {orderDetails.pricing.grand_total +
                  orderDetails.pricing.shipping_cost}
              </p>
            </li>
          </ul>
        </div>

        {/* Order Details Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Order Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-gray-600">Product</th>
                  <th className="text-right py-3 text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.order_details.map((item) => (
                  <tr key={item.id} className="border-b last:border-none">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.main_image}
                          alt={item.product.product_name}
                          className="w-16 h-16 object-contain border rounded"
                        />
                        <div>
                          <p className="font-medium">
                            {item.product.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.product_qty}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium">
                      ৳ {item.product_qty * item.unit_price}
                    </td>
                  </tr>
                ))}

                <tr className="border-t">
                  <td className="py-3 font-medium">Shipping Cost</td>
                  <td className="py-3 text-right">
                    {orderDetails.pricing.shipping_cost === 0
                      ? "Free delivery"
                      : `৳ ${orderDetails.pricing.shipping_cost}`}
                  </td>
                </tr>

                <tr className="border-t text-lg font-bold">
                  <td className="py-4">Total</td>
                  <td className="py-4 text-right text-green-600">
                    ৳{" "}
                    {orderDetails.pricing.grand_total +
                      orderDetails.pricing.shipping_cost}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderSuccessfull
