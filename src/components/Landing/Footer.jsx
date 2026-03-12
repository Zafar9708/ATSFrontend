import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Section */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white">HireOnBoard</h2>

          <p className="mt-4 text-sm leading-6 max-w-sm mx-auto sm:mx-0">
            Simplifying recruitment with smart automation.
            Hire faster, collaborate better, and build stronger teams.
          </p>

          <div className="flex justify-center sm:justify-start gap-4 mt-6">
            <Facebook className="cursor-pointer hover:text-white transition" />
            <Instagram className="cursor-pointer hover:text-white transition" />
            <Twitter className="cursor-pointer hover:text-white transition" />
            <Linkedin className="cursor-pointer hover:text-white transition" />
          </div>
        </div>

        {/* Product */}
        <div className="text-center sm:text-left">
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white cursor-pointer">Features</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
            <li className="hover:text-white cursor-pointer">Integrations</li>
            <li className="hover:text-white cursor-pointer">API</li>
          </ul>
        </div>

        {/* Company */}
        <div className="text-center sm:text-left">
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div className="text-center sm:text-left">
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Documentation</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400 px-6">
        © {new Date().getFullYear()} HireOnBoard. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;