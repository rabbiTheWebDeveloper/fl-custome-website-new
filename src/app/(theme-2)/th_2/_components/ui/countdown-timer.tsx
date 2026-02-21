"use client"

import React, { useState, useEffect, useSyncExternalStore } from "react"

interface CountdownLabels {
  days: string
  hours: string
  minutes: string
  seconds: string
  daysShort?: string
  hoursShort?: string
  minutesShort?: string
  secondsShort?: string
  minsShort?: string
  secsShort?: string
  offerEnded?: string
}

interface CountdownTimerProps {
  targetDate: Date | string
  title?: string
  subtitle?: string
  variant?: "default" | "minimal" | "compact" | "banner"
  onComplete?: () => void
  labels?: CountdownLabels
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

const defaultLabels: CountdownLabels = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
  daysShort: "D",
  hoursShort: "H",
  minutesShort: "M",
  secondsShort: "S",
  minsShort: "Mins",
  secsShort: "Secs",
  offerEnded: "This offer has ended",
}

const calculateTimeLeft = (targetDate: Date | string): TimeLeft => {
  const target = new Date(targetDate).getTime()
  const now = new Date().getTime()
  const difference = target - now

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isComplete: false,
  }
}

// Move TimeUnit components outside of the main component
const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-primary bg-card p-2 sm:h-20 sm:w-20">
      <span className="text-center text-2xl font-bold sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
      {label}
    </span>
  </div>
)

const TimeUnitCompact = ({
  value,
  label,
}: {
  value: number
  label: string
}) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex h-12 w-12 items-center justify-center rounded border border-primary/50 bg-secondary p-1">
      <span className="text-center text-lg font-bold">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-xs font-medium uppercase text-muted-foreground">
      {label}
    </span>
  </div>
)

const TimeUnitMinimal = ({
  value,
  label,
}: {
  value: number
  label: string
}) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold sm:text-3xl">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-xs uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  </div>
)

const TimeUnitBanner = ({ value, label }: { value: number; label: string }) => (
  <div className="flex items-center gap-1">
    <span className="text-xl font-bold sm:text-2xl">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  </div>
)

// Subscribe to check if we're on the client
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function CountdownTimer({
  targetDate,
  title,
  subtitle,
  variant = "default",
  onComplete,
  labels: customLabels,
}: CountdownTimerProps) {
  // Merge custom labels with defaults
  const labels = { ...defaultLabels, ...customLabels }

  // Use useSyncExternalStore for hydration-safe mounting check
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate)
      setTimeLeft(newTimeLeft)

      if (newTimeLeft.isComplete && onComplete) {
        onComplete()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (!isClient) {
    return null
  }

  if (timeLeft.isComplete) {
    return null
  }

  if (variant === "minimal") {
    return (
      <div className="flex flex-col items-center gap-4">
        {title && (
          <h3 className="text-center text-lg font-semibold sm:text-xl">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-center text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
        <div className="flex gap-4 sm:gap-6">
          <TimeUnitMinimal value={timeLeft.days} label={labels.days} />
          <div className="text-2xl font-light text-muted-foreground sm:text-3xl">
            :
          </div>
          <TimeUnitMinimal value={timeLeft.hours} label={labels.hours} />
          <div className="text-2xl font-light text-muted-foreground sm:text-3xl">
            :
          </div>
          <TimeUnitMinimal
            value={timeLeft.minutes}
            label={labels.minsShort || labels.minutes}
          />
          <div className="text-2xl font-light text-muted-foreground sm:text-3xl">
            :
          </div>
          <TimeUnitMinimal
            value={timeLeft.seconds}
            label={labels.secsShort || labels.seconds}
          />
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center gap-3">
        {title && (
          <h3 className="text-center text-base font-semibold">{title}</h3>
        )}
        <div className="flex gap-2 sm:gap-3">
          <TimeUnitCompact
            value={timeLeft.days}
            label={labels.daysShort || "D"}
          />
          <TimeUnitCompact
            value={timeLeft.hours}
            label={labels.hoursShort || "H"}
          />
          <TimeUnitCompact
            value={timeLeft.minutes}
            label={labels.minutesShort || "M"}
          />
          <TimeUnitCompact
            value={timeLeft.seconds}
            label={labels.secondsShort || "S"}
          />
        </div>
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <div className="flex flex-col gap-2 rounded-lg bg-linear-to-r from-primary/10 to-primary/5 px-4 py-3 sm:px-6 sm:py-4">
        {title && (
          <p className="text-center text-sm font-semibold text-primary sm:text-base">
            {title}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {subtitle && (
            <span className="text-xs text-muted-foreground sm:text-sm">
              {subtitle}
            </span>
          )}
          <div className="flex gap-2 sm:gap-3">
            <TimeUnitBanner
              value={timeLeft.days}
              label={labels.daysShort || "D"}
            />
            <span className="text-muted-foreground">•</span>
            <TimeUnitBanner
              value={timeLeft.hours}
              label={labels.hoursShort || "H"}
            />
            <span className="text-muted-foreground">•</span>
            <TimeUnitBanner
              value={timeLeft.minutes}
              label={labels.minutesShort || "M"}
            />
            <span className="text-muted-foreground">•</span>
            <TimeUnitBanner
              value={timeLeft.seconds}
              label={labels.secondsShort || "S"}
            />
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex flex-col items-center gap-6">
      {(title || subtitle) && (
        <div className="flex flex-col items-center gap-2">
          {title && (
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-center text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      <div className="flex gap-3 sm:gap-4">
        <TimeUnit value={timeLeft.days} label={labels.days} />
        <TimeUnit value={timeLeft.hours} label={labels.hours} />
        <TimeUnit value={timeLeft.minutes} label={labels.minutes} />
        <TimeUnit value={timeLeft.seconds} label={labels.seconds} />
      </div>
    </div>
  )
}
