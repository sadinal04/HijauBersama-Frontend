"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Bell } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#006A71] text-white shadow-lg fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-semibold tracking-wide text-[#9ACBD0] hover:text-[#F2EFE7] transition-all duration-300 ease-in-out"
          >
            🌿 HijauBersama
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
            {["Forum", "Edukasi", "Tantangan", "Galeri"].map((item, index) => (
              <Link
                key={index}
                href={`/${item.toLowerCase()}`}
                className="text-[#F2EFE7] hover:text-[#9ACBD0] transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {item}
              </Link>
            ))}

            {/* Notification Icon */}
            <Link href="/notifikasi" className="relative text-[#F2EFE7] hover:text-[#9ACBD0] transition-all">
              <Bell size={22} />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Profile Icon */}
            <Link href="/profil">
              <div className="w-8 h-8 rounded-full bg-[#F2EFE7] hover:scale-105 transition-all duration-300 cursor-pointer" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none text-[#F2EFE7]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden flex flex-col space-y-4 py-4 transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {["Forum", "Edukasi", "Tantangan", "Galeri"].map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase()}`}
              className="text-[#F2EFE7] hover:text-[#9ACBD0] transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {item}
            </Link>
          ))}

          {/* Notification and Profile on Mobile */}
          <div className="flex items-center space-x-6 pt-2">
            {/* Notification */}
            <Link href="/notifikasi" className="relative text-[#F2EFE7] hover:text-[#9ACBD0] transition-all">
              <Bell size={22} />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Profile */}
            <Link href="/profil">
              <div className="w-8 h-8 rounded-full bg-[#F2EFE7] hover:scale-105 transition-all duration-300 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
