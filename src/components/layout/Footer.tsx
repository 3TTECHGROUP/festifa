import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between px-8">
        {/* Left Logo */}
        <div className="mb-8 md:mb-0 flex-1 flex items-center">
          <div className="bg-gray-300 w-16 h-16 mr-4" />
          <span className="text-white text-base">LOGO</span>
        </div>
        {/* Right Columns */}
        <div className="flex flex-col md:flex-row gap-12 w-full md:w-auto justify-end">
          {/* Features */}
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/events" className="hover:underline">Events</Link></li>
              <li><Link to="/templates" className="hover:underline">Templates</Link></li>
              <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
            </ul>
          </div>
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-2">Social</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
