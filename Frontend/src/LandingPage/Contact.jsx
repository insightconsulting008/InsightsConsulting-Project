import React from 'react';
import { ArrowUpRight, Linkedin, Mail } from 'lucide-react';
import axios from "axios";
import { useState } from "react";







const Contact = () => {
 const cards = [
  {
    title: "Book a Consultation",
    description:
      "Have questions about GST registration, filings, or compliance? Speak directly with our experts and get clear, practical guidance tailored to your business.",
    buttonText: "Schedule a Call",
    link: "/contact"
  },
  {
    title: "Explore Our Services",
    description:
      "Discover our complete range of GST and business compliance solutions, designed to simplify regulations, reduce risk, and keep your business running smoothly.",
    buttonText: "View Services",
    link: "/services"
  }
];


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://insightsconsult-backend.onrender.com/contact",
        formData
      );

      console.log("Response:", res.data);
      alert("Message sent successfully ✅");

      // reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden bg-white">

      {/* SECTION ONE: Contact Header */}
      <section className="mt-[60px] relative bg-[#FCFCFD]  border-[4px] md:border-[6px] flex flex-col lg:flex-row justify-around border-black/5  px-4 md:px-12   rounded-[16px] p-8 md:p-18  gap-10">
        <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design.png" className=' absolute top-0 left-0 w-16' alt="" />
        {/* Red Badge Section */}
        <div className='flex flex-col items-center lg:items-start relative shrink-0'>
          <div className='bg-[#D11C16] px-6 py-3 rounded-[14px] text-white font-semibold text-[18px] md:text-4xl whitespace-nowrap shadow-sm'>
           we would love to hear

          </div>
          <div className='bg-[#D11C16] px-6 py-2 rounded-[10px] text-white font-semibold text-[18px] md:text-4xl mt-[-10px]  shadow-sm self-center lg:self-start'>
           from you
          </div>
        </div>

        <div className='flex flex-col gap-6 md:gap-[30px] flex-1 max-w-[639px]'>
          <p className='text-[15px] md:text-[16px] text-[#4C4C4D] text-center lg:text-left leading-relaxed'>
           Whether you’re starting a new venture, managing GST filings, or handling 
      ongoing tax and financial compliance, our team is here to support you. 
      Reach out to us for reliable guidance, timely assistance, and solutions 
      tailored to your business needs.
          </p>

          {/* SOCIAL ICONS */}
          <div className='flex gap-[12px] w-fit p-4 h-[60px] md:h-[70px] rounded-full border items-center justify-between border-black/5 border-[2px] self-center lg:self-start bg-white'>
            <img className='rounded-full bg-[#FFF6D7] p-[10px] md:p-[12px] w-[40px] h-[40px] md:w-[52px] md:h-[52px] object-contain hover:scale-110 transition-transform cursor-pointer' src="https://img.icons8.com/?size=100&id=118466&format=png&color=000000" alt="fb" />
            <img className='rounded-full bg-[#FFF6D7] p-[10px] md:p-[12px] w-[40px] h-[40px] md:w-[52px] md:h-[52px] object-contain hover:scale-110 transition-transform cursor-pointer' src="https://img.icons8.com/?size=100&id=60014&format=png&color=000000" alt="tw" />
            <img className='rounded-full bg-[#FFF6D7] p-[10px] md:p-[12px] w-[40px] h-[40px] md:w-[52px] md:h-[52px] object-contain hover:scale-110 transition-transform cursor-pointer' src="https://img.icons8.com/?size=100&id=98960&format=png&color=000000" alt="li" />
          </div>
        </div>
      </section>

      {/* SECTION TWO: Info Cards */}
      <section className='mt-[60px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-[20px] md:px-12 px-4 w-full'>
        {[
          { label: "Address", value: "Somewhere in the World" },
          { label: "Email Here", value: "support@forhelp.com" },
          { label: "Call us on", value: "+00 000 00 000" },
          { label: "Working Hours", value: "10:00 am - 6:00 pm" }
        ].map((item, index) => (
          <div key={index} className='bg-[#FCFCFD] py-6 px-4 rounded-[10px] border border-black/5 border-[2px] flex flex-col justify-center items-center hover:border-black/10 transition-all'>
            <p className='text-[14px] md:text-[16px] text-[#4C4C4D]'>{item.label}</p>
            <p className='text-[#1A1A1A] text-[14px] md:text-[16px] font-medium text-center truncate w-full'>{item.value}</p>
          </div>
        ))}
      </section>

      {/* SECTION THREE: Form Section */}
      <section className="w-full bg-gray-50 flex px-4 md:px-12 items-center justify-center md:py-20 mt-[60px]">
        <div className="bg-white rounded-3xl p-6 md:p-12  w-full flex flex-col md:flex-row justify-center   gap-8 shadow-sm border border-gray-100">

          {/* Left Side */}
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            <div className="bg-[#eab308] relative rounded-2xl h-100  w-full flex items-center justify-center overflow-hidden">
              <img src='https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Image%20(3).png' className="w-full h-full object-cover" alt="logo background" />

            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex justify-between items-center group cursor-pointer hover:shadow-md transition-shadow">
              <div className="overflow-hidden">
                <p className="text-gray-600 text-sm font-medium">Partnerships</p>
                <p className="text-black font-semibold mt-1 truncate">collabs@forhelp.com</p>
              </div>
              <div className="bg-[#2a2a2a] p-3 rounded-full text-white shrink-0">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-3/5 flex flec-col justify-center ">
            <form className="flex flex-col justify-between" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                  
                </div>
                                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                  
                </div>
               
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 justify-between gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Tell us about your requirement</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-yellow-500 outline-none resize-none"
                />
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="terms" className="w-5 h-5 accent-gray-800" />
                  <label htmlFor="terms" className="text-xs md:text-sm text-gray-600">
                    I agree with <span className="underline">Terms</span> and <span className="underline">Privacy</span>
                  </label>
                </div>
                <button className="w-full lg:w-auto bg-[#1a1a1a] text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">
          Request Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION FOUR: Volunteer & Donation Cards */}
      <section className="w-full px-4 md:px-12 p-5 mt-5 lg:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {cards.map((card, index) => (
            <div key={index} className="bg-[#FCFCFD] w-full rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-12 border border-black/5 border-[2px] flex flex-col items-start justify-between min-h-fit">
              <div>
                <h3 className="text-[1.1rem] md:text-[1.25rem] font-semibold text-[#1A1A1A] mb-4">{card.title}</h3>
                <p className="text-[#555555] text-[0.85rem] md:text-[0.9rem] leading-relaxed mb-8">{card.description}</p>
              </div>
              <button className="flex items-center gap-4 bg-[#1A1A1A] hover:bg-black text-white pl-6 pr-2 py-2 rounded-full transition-all group">
                <span className="text-[0.8rem] md:text-[0.85rem] font-medium">{card.buttonText}</span>
                <div className="bg-[#333333] p-2 rounded-full flex items-center justify-center group-hover:bg-[#444444]">
                  <ArrowUpRight size={18} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION FIVE: Final CTA */}
      <section className="w-full px-4 md:px-12 mt-12  mb-[60px]">
        <div className="relative w-full min-h-[400px] rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 text-center border border-gray-100 bg-gradient-to-br from-[#E2E8F0] via-[#F8FAFC] to-[#F1F5F9]">

          {/* Decorative Patterns (Hidden on very small screens for cleaner UI) */}
          <div className="absolute -bottom-33 right-0 w-32 h-32 md:w-96 md:h-96 opacity-80 pointer-events-none hidden sm:block">
            <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design%20(2).png" alt="" />
          </div>
          <div className="absolute -bottom-36 left-0 w-32 h-32 md:w-96 md:h-96 opacity-80 pointer-events-none hidden sm:block">
            <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design%20(3).png" alt="" />
          </div>

          <div className="relative z-10 max-w-5xl flex flex-col gap-6 justify-center items-center">
            <h2 className="text-[24px] md:text-[32px] font-semibold text-[#1A1A1A] leading-tight">
               Get Your Registrations & Compliance Handled by Professionals
            </h2>
            <p className="text-[#4C4C4D] text-[15px] md:text-[16px] max-w-2xl">
               Avoid delays, errors, and regulatory stress. Our experts ensure a smooth, accurate, and hassle-free process for your business.



            </p>

            <div className="lg:bg-white rounded-full lg:p-2 lg:pl-6  flex items-center justify-center lg:justify-between shadow-xl border border-white w-auto  lg:max-w-xl">
              <span className="text-[13px] md:text-[15px] px-4 font-medium text-[#1A1A1A] hidden md:block">
                   Get started with professional assistance
              </span>
              <button className="flex items-center gap-3 bg-[#D11C16] hover:bg-red-700 text-white px-5 md:px-8 py-3 rounded-full transition-all  ">
                <span className="text-[14px]">Get Expert Assistance</span>
                <ArrowUpRight className='bg-white text-black rounded-full p-1' size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Contact;