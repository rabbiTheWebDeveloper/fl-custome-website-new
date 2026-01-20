import { PromoBanner } from "../_components/promo-banner/promo-banner"
import { ContactForm } from "./contact-form"

export default function ContactPage() {
  return (
    <main>
      {/* Contact Section */}
      <div className="container py-16 md:pt-24 md:pb-10">
        <div>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact us</h1>
            <p className="text-base max-w-3xl md:text-[22px] leading-[140%] mx-auto">
              Got a question or need help with your order? Our team&apos;s
              always on standby — hit us up anytime and we&apos;ll get you
              sorted, fast.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Contact Form */}
            <div className="bg-[#F9F9F9] p-6 rounded-2xl">
              <ContactForm />
            </div>

            {/* Right Column - Contact Information */}
            <div className="space-y-6">
              {/* Showroom */}
              <div className="bg-[#F9F9F9] p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Showroom</h3>
                <p className="text-muted-foreground">
                  Banani, Dhaka Bangladesh
                </p>
              </div>

              {/* Work days */}
              <div className="bg-[#F9F9F9] p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Work days</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9am-9pm
                </p>
                <p className="text-muted-foreground">
                  Saturday & Sunday: 10am-7pm
                </p>
              </div>

              {/* Email */}
              <div className="bg-[#F9F9F9] p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-muted-foreground mb-1">
                  We strive to answer emails within 48 hours{" "}
                  <a
                    href="mailto:info@mail.com"
                    className="text-primary hover:underline"
                  >
                    info@mail.com
                  </a>
                </p>
              </div>

              {/* Phone */}
              <div className="bg-[#F9F9F9] p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-muted-foreground">
                  Helpcenter:{" "}
                  <a
                    href="tel:+880123456789"
                    className="font-medium text-primary"
                  >
                    +880123456789
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <PromoBanner />
    </main>
  )
}
