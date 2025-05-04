// import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="flex flex-col md:flex-row items-center text-sm text-gray-500 dark:text-gray-400 space-y-2 md:space-y-0 md:space-x-4">
          <span>© {new Date().getFullYear()} Relume. All rights reserved.</span>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
          <a href="/cookies" className="hover:underline">Cookie Settings</a>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://twitter.com"
            aria-label="Twitter"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://linkedin.com"
            aria-label="LinkedIn"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://youtube.com"
            aria-label="YouTube"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaYoutube size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
