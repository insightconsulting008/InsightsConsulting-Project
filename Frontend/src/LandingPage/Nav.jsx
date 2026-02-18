import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Phone } from "lucide-react";

export default function Nav() {
  const navLinkClass =
    "hover:text-red-500 transition-colors duration-200";

  const activeClass = "text-red-500 font-semibold";

  return (
    <header className="w-full shadow-sm sticky top-0 z-20 ">
      {/* Top Announcement */}
      <div className="bg-black text-white text-sm py-2 px-4 flex items-center justify-center gap-2 text-center">
        <span>
          Looking For The Right{" "}
          <span className="text-yellow font-medium">
            Compliance & Registration Services
          </span>{" "}
          | Get A Quick Guidance From Our Team →
        </span>

        <button className="ml-3 bg-red  text-white px-3 py-1 rounded-md text-sm">
          Enquire Now
        </button>
      </div>

      {/* Main Navbar */}
      <div className="bg-white px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
         <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png?updatedAt=1771313237021" className="h-14" alt="" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${navLinkClass} flex items-center gap-1 ${
                isActive ? activeClass : ""
              }`
            }
          >
            Service We Provide <ChevronDown size={16} />
          </NavLink>

          <NavLink
            to="/service-hub"
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            Service Hub
          </NavLink>

          <NavLink
            to="/resource"
            className={({ isActive }) =>
              `${navLinkClass} flex items-center gap-1 ${
                isActive ? activeClass : ""
              }`
            }
          >
            Resources <ChevronDown size={16} />
          </NavLink>

          <NavLink
            to="/company"
            className={({ isActive }) =>
              `${navLinkClass} flex items-center gap-1 ${
                isActive ? activeClass : ""
              }`
            }
          >
            Company <ChevronDown size={16} />
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Phone */}
          <div className="hidden md:flex items-center gap-2 border rounded-lg px-3 py-2 text-gray-700">
            <Phone size={18} />
            <span className="font-medium">+91 98578474975</span>
          </div>

          {/* Login */}
          <Link to="/login">
            <button className="bg-red  text-white px-5 py-2 rounded-lg font-medium">
              Login →
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
