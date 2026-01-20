import AboutUs from "@/app/theme_3/components/about"
const sampleDomainInfo = {
  about_us: `
    <h2 class="text-3xl font-bold text-gray-900 mb-6">Welcome to ShopHub</h2>
    <p class="text-lg text-gray-600 mb-6">
      Since our founding in 2010, ShopHub has been on a mission to revolutionize online shopping. 
      What started as a small startup with just three passionate individuals has now grown into 
      Bangladesh's leading e-commerce platform, serving over 1 million happy customers nationwide.
    </p>
    <p class="text-lg text-gray-600 mb-6">
      Our journey began with a simple idea: to make quality products accessible to everyone while 
      providing an exceptional shopping experience. Today, we're proud to partner with 500+ local 
      and international brands, offering a curated selection of products that meet the highest 
      standards of quality and value.
    </p>
    <h3 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Commitment</h3>
    <p class="text-lg text-gray-600 mb-6">
      We believe in transparency, quality, and customer satisfaction. Every product in our catalog 
      undergoes rigorous quality checks, and our customer support team is available 24/7 to ensure 
      your shopping experience is seamless and enjoyable.
    </p>
  `,
}
const About = () => {
  return (
    <>
      <AboutUs domainInfo={sampleDomainInfo} />
    </>
  )
}

export default About
