import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <FaFacebook className="h-6 w-6" />
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-6 w-6" />
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; 2025 Dental Checkup System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 