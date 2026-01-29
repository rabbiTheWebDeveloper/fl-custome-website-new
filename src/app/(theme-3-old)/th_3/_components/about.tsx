import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
interface AboutUsProps {
  domainInfo: string
  pageheader?: string
}
const AboutUs: React.FC<AboutUsProps> = ({ domainInfo, pageheader }) => {
  return (
    <div className="w-full">
      {/* Banner */}
      <div className="relative w-full">
        <Image
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
          alt="About Banner"
          width={1248}
          height={300}
          className="w-full h-[220px] md:h-[300px] object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                {pageheader || "About Us"}
              </h2>

              <div className="flex items-center gap-1 text-sm md:text-base">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <ChevronRight size={16} />
                <Link
                  href={`/${pageheader || "about_us"}`}
                  className="hover:underline"
                >
                  {pageheader || "About Us"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-12" />

      {/* About Content */}
      <section>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-10">
            <div
              className="prose max-w-none text-center"
              dangerouslySetInnerHTML={{
                __html: domainInfo || "<p>No content available.</p>",
              }}
            />
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-12" />
    </div>
  )
}

export default AboutUs
