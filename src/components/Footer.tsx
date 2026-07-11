export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-light py-16 px-10 text-xs">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-0">
          <div>
            <h4 className="eyebrow mb-5" style={{ letterSpacing: '1px' }}>
              Contact
            </h4>
            <p className="leading-[1.8] text-black">
              Business Email —{' '}
              <a href="mailto:booking@beedstu.com" className="text-black no-underline">
                booking@beedstu.com
              </a>
            </p>
          </div>
          <div>
            <h4 className="eyebrow mb-5" style={{ letterSpacing: '1px' }}>
              Information
            </h4>
            <p className="leading-[1.8] text-[#666]">
              BEEDS © {currentYear}
              <br />
              All Rights Reserved
              <br />
              Tokyo, Japan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
