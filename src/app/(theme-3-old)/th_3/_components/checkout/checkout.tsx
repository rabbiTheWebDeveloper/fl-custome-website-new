<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Progress Bar - Mobile Optimized */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl">
              {["Cart", "Information", "Payment"].map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-base
          ${index < 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {index < 2 ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <span
                      className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline
          ${index < 2 ? "text-green-600" : "text-gray-600"}`}
                    >
                      {step}
                    </span>
                  </div>

                  {index < 2 && (
                    <div
                      className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4
          ${index < 1 ? "bg-green-600" : "bg-gray-200"}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="John"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="+880 1XXX-XXXXXX"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Address *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <textarea
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base resize-none"
                        placeholder="House #123, Road #456, Mirpur"
                        {...register("deliveryAddress")}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.deliveryAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special instructions, delivery notes, etc."
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base resize-none"
                      {...register("orderNote")}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-6 bg-white rounded-2xl pb-5">
                <h3 className="text-lg md:text-xl font-bold mb-4 p-5 border-b">
                  Payment Method
                </h3>

                <div className="px-5">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setValue(
                        "paymentMethod",
                        value as CheckoutFormData["paymentMethod"]
                      )
                    }
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        htmlFor={method.id}
                        className={cn(
                          "cursor-pointer border-2 rounded-xl p-4 transition-all",
                          paymentMethod === method.id
                            ? "border-[#3bb77e] bg-[#3bb77e] text-white"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            className="hidden"
                          />

                          {/* Custom radio */}
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              paymentMethod === method.id
                                ? "border-white"
                                : "border-gray-400"
                            )}
                          >
                            {paymentMethod === method.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>

                          <method.icon className="w-5 h-5" />

                          <div className="flex-1">
                            <h3 className="font-semibold text-sm sm:text-base">
                              {method.name}
                            </h3>
                            <p className="text-xs sm:text-sm opacity-80">
                              {method.description}
                            </p>
                          </div>

                          {method.image && (
                            <Image
                              src={method.image}
                              alt={method.name}
                              width={80}
                              height={24}
                            />
                          )}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>

                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            {/* Right Column - Order Summary */}
            <div className="space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-64 sm:max-h-80 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <Image
                          src={item.metadata?.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Header with Name and Remove Button */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="min-w-0 pr-2">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {formatVariants(item)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveProduct(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-1 p-0.5 rounded-full hover:bg-red-50"
                            aria-label="Remove item"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-2.5 py-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                            <span className="px-3 py-1.5 font-medium text-sm text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-2.5 py-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              disabled={
                                item.quantity >=
                                (item.metadata?.maxQuantity ?? 10)
                              }
                            >
                              <Plus className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                          </div>

                          {/* Price Display */}
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">
                              ৳
                              {(
                                (item.discountedPrice ?? item.price) *
                                item.quantity
                              ).toLocaleString()}
                            </div>
                            {item.discountedPrice &&
                              item.price > item.discountedPrice && (
                                <div className="text-xs text-gray-400 line-through">
                                  ৳
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Breakdown */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ৳{finalTotals.subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-6 bg-white rounded-2xl pb-5">
                    <h3 className="text-lg md:text-xl font-bold mb-4 p-5 border-b">
                      Shipping Method
                    </h3>

                    <div className="px-5">
                      <RadioGroup
                        value={shippingMethod}
                        onValueChange={(value) =>
                          setValue(
                            "shippingMethod",
                            value as CheckoutFormData["shippingMethod"]
                          )
                        }
                        className="space-y-3"
                      >
                        {shippingMethods.map((method) => (
                          <label
                            key={method.id}
                            htmlFor={method.id}
                            className={cn(
                              "flex items-center justify-between p-3 md:p-4 border rounded-xl cursor-pointer transition-all",
                              shippingMethod === method.id
                                ? "border-[#3bb77e] bg-green-50"
                                : "border-gray-200 hover:border-[#3bb77e]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value={method.id}
                                id={method.id}
                                className="hidden"
                              />

                              {/* Custom radio */}
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border flex items-center justify-center",
                                  shippingMethod === method.id
                                    ? "border-[#3bb77e] bg-[#3bb77e]"
                                    : "border-gray-300"
                                )}
                              >
                                {shippingMethod === method.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>

                              <span className="text-sm md:text-base text-gray-700">
                                {method.label}
                              </span>
                            </div>

                            <span className="text-sm md:text-base font-semibold text-gray-900">
                              ৳{method.price.toFixed(2)}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>

                      {errors.shippingMethod && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.shippingMethod.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Discount */}

                  <div className="flex justify-between text-[#3bb77e] text-sm sm:text-base">
                    <span>Discount</span>
                    <span className="font-medium">-৳100</span>
                  </div>

                  {/* Divider and Total */}
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between font-bold text-gray-900 text-base sm:text-lg">
                      <span>Total</span>
                      <span>৳{finalTotals.total.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes and fees
                    </p>
                  </div>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4 sm:mb-6">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#3bb77e]" />
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Secure checkout</span> • Your
                    information is encrypted and protected
                  </span>
                </div>
                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || items.length === 0}
                  className={`
    w-full rounded-xl px-4 py-3.5 sm:py-4
    font-semibold text-base
    transition-all duration-200 ease-out
    flex items-center justify-center
    ${isValid && items.length > 0 && !isSubmitting
                      ? "bg-gradient-to-r from-[#3bb77e] to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-[#3bb77e] active:scale-[0.98]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing order…</span>
                    </div>
                  ) : (
                    <div className="flex w-full items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 opacity-90" />
                        <span>
                          {items.length === 0 ? "Your cart is empty" : "Place Order"}
                        </span>
                      </div>

                      {items.length > 0 && (
                        <span className="ml-auto text-lg font-bold tracking-tight">
                          ৳{finalTotals.total.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </button>


                {/* Return Policy */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Link
                    href="/return-policy"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#3bb77e] transition-colors group"
                  >
                    <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                    <span className="font-medium">30-Day Return Policy</span>
                    <span className="text-gray-400 group-hover:text-[#3bb77e]">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* Continue Shopping */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* OTP Modal */}
      <CheckoutOtp
        timeLeft={timeLeft}
        show={show}
        onClose={handleClose}
        customerPhone={customerPhone}
        resendLoading={resendLoading}
        onResendOtp={handleResendOtp}
      />
    </div>