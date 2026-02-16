"use client"

import React, { useState, useRef, useEffect } from "react"
import { ArrowLeft, ShieldCheck, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDomain } from "../../store/domain"
import { useCart } from "@/lib/cart"

interface CheckoutOtpProps {
  show: boolean
  onClose: () => void
  customerPhone: string
  timeLeft: number
  resendLoading: boolean
  onResendOtp: () => void
}

const CheckoutOtp: React.FC<CheckoutOtpProps> = ({
  show,
  onClose,
  customerPhone,
  timeLeft,
  resendLoading,
  onResendOtp,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { clearCart } = useCart()
  const domain = useDomain((state) => state.domain)

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }, 0)
    }
  }, [show])

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)

    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    const lastFilledIndex = Math.min(pastedData.length - 1, 5)
    inputRefs.current[lastFilledIndex]?.focus()
  }

  const otpString = otp.join("")

  const handleVerifyOtp = async () => {
    if (otpString.length < 6) {
      toast.error("6 digit OTP required")
      return
    }

    try {
      setLoading(true)
      const shopId = domain?.shop_id
      const res = await api.post<{
        data: {
          otp_verified: boolean
          id: string | number
        }
      }>(
        "/customer/order/verify",
        { otp: otpString, phone: customerPhone },
        undefined,
        {
          headers: {
            ...(shopId && { "shop-id": String(shopId) }),
          },
        }
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = res?.data as any
      if (responseData?.data?.otp_verified) {
        await clearCart()
        window.location.href = "/order-success"
      } else {
        toast.error("Invalid OTP")
        setLoading(false)
      }
    } catch {
      setLoading(false)
      toast.error("Server error")
    }
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute left-0 top-0 h-8 w-8 text-gray-600 hover:text-black"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck size={28} className="text-primary" />
              <DialogTitle className="text-xl font-semibold">
                OTP Verification
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter the 6-digit OTP sent to your phone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4" onPaste={handlePaste}>
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-12 text-center text-lg font-semibold"
                maxLength={1}
                inputMode="numeric"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            {timeLeft > 0 ? (
              <span className="text-gray-600">
                Time remaining: <b className="text-primary">{timeLeft}s</b>
              </span>
            ) : (
              <span className="text-red-500">OTP expired</span>
            )}

            <Button
              variant="ghost"
              size="sm"
              disabled={resendLoading || timeLeft > 0}
              onClick={onResendOtp}
              className="h-auto p-0 text-primary hover:text-primary/80 hover:bg-transparent"
            >
              <RefreshCcw size={14} className="mr-1" />
              {resendLoading ? "Sending..." : "Resend"}
            </Button>
          </div>

          <Button
            onClick={handleVerifyOtp}
            disabled={loading || otpString.length < 6 || timeLeft === 0}
            className="h-12 w-full font-semibold"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCcw className="h-4 w-4 animate-spin" />
                Please wait...
              </div>
            ) : (
              "Confirm Order"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutOtp
