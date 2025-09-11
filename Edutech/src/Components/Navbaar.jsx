import React from 'react';
import {
  FaSearch,
  FaShoppingCart,
  FaHome,
  FaFileAlt,
  FaGraduationCap,
  FaStore,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaSignInAlt
} from 'react-icons/fa';
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button } from "@heroui/react";
const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-28">

          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src="/Images/logo2.png"
              alt="EduLerns Logo"
              className="w-30 h-28 object-fill"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center lg:space-x-8">

            <a
              href="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
            >
              <FaHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Home</span>
            </a>

     {/* Pages Dropdown */}
<div className="flex items-center space-x-2 text-gray-700 group relative">

  <FaFileAlt className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-transform duration-200 group-hover:scale-110" />

  <Dropdown backdrop="blur">
    <DropdownTrigger>
      <Button variant="bordered" className="text-gray-700 hover:text-blue-600 font-medium transition-transform duration-200 group-hover:scale-105">
        Pages
      </Button>
    </DropdownTrigger>

    <DropdownMenu aria-label="Pages Navigation" variant="faded" className="bg-white rounded-lg shadow-lg p-4 min-w-[200px] font-sans text-gray-800">
      <DropdownItem key="courses" href="/Courses" className="hover:bg-blue-50 rounded-md px-3 py-2 transition-colors">
        Courses
      </DropdownItem>
      <DropdownItem key="policy" href="#" className="hover:bg-blue-50 rounded-md px-3 py-2 transition-colors">
        Policy
      </DropdownItem>
      <DropdownItem key="educator-offers" href="#" className="hover:bg-blue-50 rounded-md px-3 py-2 transition-colors">
        Educator Offers
      </DropdownItem>
      <DropdownItem key="coupon-codes" href="#" className="hover:bg-blue-50 rounded-md px-3 py-2 transition-colors">
        Coupon Codes
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>

</div>

            <a
              href="/courses"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
            >
              <FaGraduationCap className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Courses</span>
            </a>

            <a
              href="/shop"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
            >
              <FaStore className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Shop</span>
            </a>

            <a
              href="/about"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
            >
              <FaInfoCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>About</span>
            </a>

            <a
              href="/contact"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
            >
              <FaEnvelope className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Contact</span>
            </a>

          </div>

          {/* Right Section - Search, Cart, Auth */}
          <div className="flex items-center gap-4 space-x-4 sm:space-x-0">

            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group">
              <FaSearch className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group relative">
              <FaShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <button className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium group">
              <FaUser className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 group">
              <FaSignInAlt  className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Try for Free</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
