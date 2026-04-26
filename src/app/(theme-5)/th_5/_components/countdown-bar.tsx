"use client"
import React, { useEffect, useState } from "react"

function getTimeLeft(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownBar() {
  const [target] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d
  })
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(target))
    }, 1000)
    return () => clearInterval(timer)
  }, [target])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="w-full bg-black text-white text-center py-1.5 px-3 flex items-center justify-center gap-3 flex-wrap">
      <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase leading-tight">
        CLOCK&apos;S TICKING&hellip; THE OFFER ENDS IN !
      </span>
      <div className="flex items-center gap-2">
        {(
          [
            { label: "Days", val: timeLeft.days },
            { label: "Hours", val: timeLeft.hours },
            { label: "Minutes", val: timeLeft.minutes },
            { label: "Seconds", val: timeLeft.seconds },
          ] as const
        ).map(({ label, val }, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <span className="text-white/60 font-bold text-xs">:</span>
            )}
            <div className="flex flex-col items-center leading-none">
              <span className="text-sm sm:text-base font-bold tabular-nums">
                {pad(val)}
              </span>
              <span className="text-[8px] sm:text-[9px] text-white/60 uppercase tracking-widest mt-0.5">
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
