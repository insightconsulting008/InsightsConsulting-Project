import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

export default function GstHero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-white/90"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Trusted by <span className="text-red-500 font-semibold">1,000+</span> Business Owners ❤️
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight">
            Compliance Made Simple by Experts{" "}
            <span className="text-green-600 font-bold">
              <Typewriter
                words={[
                  "GST Registration",
                  "GST Filing",
                  "Company Incorporation",
                  "Trademark Registration",
                  "Compliance Support",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>

          <p className="mt-4 text-gray-600 max-w-lg">
            From registrations to ongoing filings, we help businesses stay compliant
            across multiple regulatory requirements.
          </p>

          <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow">
            Explore Service Hub
          </button>
        </div>

        {/* RIGHT FORM */}
      <div className="relative">
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-tl-[120px]"></div>

          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md ml-auto">
            
            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg mb-4">
              <FaCheckCircle className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Get Expert Compliance Support
                </p>
                <p className="text-xs text-gray-500">
                  Response Time ⚡ &lt; 15 Mins
                </p>
              </div>
            </div>

            <form className="space-y-3">
              <input type="text" placeholder="Enter Your Full Name" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none" />
              <input type="email" placeholder="Enter Your Email Address" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none" />
              <input type="tel" placeholder="Enter Your Phone Number" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none" />

              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none">
                <option>Select the service required</option>
                <option>GST Registration</option>
                <option>GST Filing</option>
                <option>Company Incorporation</option>
                <option>Trademark Registration</option>
              </select>

              <textarea rows="3" placeholder="Enter Your Comments Here" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none" />

              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow">
                Enquire Now
              </button>
            </form>
          </div>
        </div>

      </div>

 
    </section>
  );
}
