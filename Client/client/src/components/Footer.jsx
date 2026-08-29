
import { NavLink } from "react-router-dom";
import {
  
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#0f1115] text-white">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-[7%] py-14 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold tracking-wide text-[#d8a19b]">
            STYLEHIVE
          </h2>

          <p className="mt-4 max-w-[260px] text-sm leading-6 text-gray-400">
            Discover fashion that matches your style. Shop the latest
            trends and timeless essentials at StyleHive.
          </p>

        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-sm font-semibold tracking-wider">
            QUICK LINKS
          </h3>

          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <NavLink to="/" className="transition hover:text-white">
              MEN
            </NavLink>

            <NavLink to="/shop" className="transition hover:text-white">
              WOMEN
            </NavLink>

            <NavLink to="/categories" className="transition hover:text-white">
              KIDS
            </NavLink>

            <NavLink to="/about" className="transition hover:text-white">
              SHOP
            </NavLink>

            
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="mb-5 text-sm font-semibold tracking-wider">
            CUSTOMER SERVICE
          </h3>

          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <NavLink to="/shipping" className="transition hover:text-white">
              Shipping & Delivery
            </NavLink>

            <NavLink to="/returns" className="transition hover:text-white">
              Returns & Exchanges
            </NavLink>

            <NavLink to="/privacy" className="transition hover:text-white">
              Privacy Policy
            </NavLink>

            <NavLink to="/terms" className="transition hover:text-white">
              Terms & Conditions
            </NavLink>

            <NavLink to="/faq" className="transition hover:text-white">
              FAQs
            </NavLink>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-sm font-semibold tracking-wider">
            CONTACT US
          </h3>

          <div className="flex flex-col gap-4 text-sm text-gray-400">

            <div className="flex items-center gap-3">
              <FiMapPin size={17} />
              <span>ABC,123</span>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone size={17} />
              <span>+92 300 1234567</span>
            </div>

            <div className="flex items-center gap-3">
              <FiMail size={17} />
              <span>support@stylehive.com</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-[7%] py-5 text-xs text-gray-500 md:flex-row">

          <p>
            © 2026 StyleHive. All rights reserved.
          </p>

          <p>
            Designed & Developed with ❤️
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;