import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="w-full bg-green-950 text-white mt-16">

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold">InstaWear</h2>
            <p className="text-sm text-gray-300 mt-3">
              Your one-stop fashion store for premium sneakers, clothing, and accessories.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-5 text-xl">
              <FaFacebook className="cursor-pointer hover:text-gray-300 transition" />
              <FaInstagram className="cursor-pointer hover:text-gray-300 transition" />
              <FaTwitter className="cursor-pointer hover:text-gray-300 transition" />
              <FaYoutube className="cursor-pointer hover:text-gray-300 transition" />
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">All Products</li>
              <li className="hover:text-white cursor-pointer">Shoes</li>
              <li className="hover:text-white cursor-pointer">Clothing</li>
              <li className="hover:text-white cursor-pointer">Accessories</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Shipping</li>
              <li className="hover:text-white cursor-pointer">Returns</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-green-900 mt-10 pt-6 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} InstaWear. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer