"use client"

import { useState } from "react"
import { Button } from "../_components/ui/button"
import { Input } from "../_components/ui/input"
import { Textarea } from "../_components/ui/textarea"

const DEFAULT_FORM_DATA = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
}

export function ContactForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block font-medium mb-2">
          Full Name
        </label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-6 text-base"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-medium mb-2">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="johndoe@email.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-6 text-base"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block font-medium mb-2">
          Phone number
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+880123456789"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-6 text-base"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-medium mb-2">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write here"
          value={formData.message}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <Button type="submit" className="w-full h-12 text-base rounded-2xl">
        Send Message
      </Button>
    </form>
  )
}
