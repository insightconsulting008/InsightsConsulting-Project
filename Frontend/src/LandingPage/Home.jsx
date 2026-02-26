import React, { useState, useMemo } from "react";
import { Typewriter } from "react-simple-typewriter";
import {
  FaRegClock,
  FaComments,
  FaUserCheck,
  FaLayerGroup,
  FaSyncAlt,
  FaTasks,
} from "react-icons/fa";
import { FaLightbulb, } from "react-icons/fa";
import { LuShieldCheck } from "react-icons/lu";
import { FaUserGroup } from "react-icons/fa6";
import { IoFlagSharp } from "react-icons/io5";
import { BiChalkboard } from "react-icons/bi";
import { HiArrowRight } from "react-icons/hi2";

import {
  FaUserTie,
  FaSlack,
  FaDropbox,
  FaHistory,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaBolt } from "react-icons/fa";
import { FaUsers, FaCheckCircle } from "react-icons/fa";
import { BiBadgeCheck } from "react-icons/bi";

import { motion, AnimatePresence } from "framer-motion";

import { IoPlay } from "react-icons/io5";
import Enquiryform from "./reusable/Enquiryform";


const steps = [
  {
    no: "01",
    icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/info-folder%201.png',
    title: "Choose a Service",
    desc: "Browse, enquire, or purchase services from our website",
  },
  {
    no: "02",
    icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/upload-cloud-folder%201.png',
    title: "Login & Submit Details",
    desc: "Access your dashboard and upload required documents",
  },
  {
    no: "03",
    icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/upload-cloud-folder%202.png',
    title: "Representative Assigned",
    desc: "A representative manages your service and updates everything.",
  },
  {
    no: "04",
    icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/info-folder%203.png',
    title: "Fast disbursement",
    desc: "Get certificates & ongoing follow-ups for recurring services.",
  },
];


export default function Home() {

  const handleSubmit = (e) => {
    e.preventDefault();
    // 👉 handle submit logic here
  };
  const services = [
    "GST Registration",
    "GST Filing",
    "MSME",
    "FSSAI",
    "Trademark Registration",
    "ISO Certification",
    "NGO Registration",
  ];
  const loopServices = [...services, ...services, ...services];
  //   const loopServices = useMemo(
  //   () => [...services, ...services],
  //   [services]
  // );

  const challenges = [
    {
      icon: <FaTasks />,
      title: "Manual Follow-Ups Everywhere",
      desc: "Client reminders, document collection, and status updates were handled manually — leading to delays and missed actions.",
    },
    {
      icon: <FaRegClock />,
      title: "Missed Deadlines & Renewals",
      desc: "Without a structured system, recurring compliances were often forgotten or addressed at the last minute.",
    },
    {
      icon: <FaComments />,
      title: "Scattered Communication",
      desc: "Updates, certificates, and confirmations were shared over calls and chats — with no single source of truth.",
    },
    {
      icon: <FaUserCheck />,
      title: "No Clear Ownership",
      desc: "Clients didn’t know who was handling their service, and teams lacked visibility into task status.",
    },
    {
      icon: <FaLayerGroup />,
      title: "Scaling Became Difficult",
      desc: "As the number of clients grew, managing services consistently became increasingly complex.",
    },
    {
      icon: <FaSyncAlt />,
      title: "Recurring Compliance Was Reactive",
      desc: "Most follow-ups happened only after an issue arose, instead of being proactively managed.",
    },
  ];

  const features = [
    {
      icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container.png?updatedAt=1771417293358',
      title: "Buy Services Online",
      desc: "Browse, select, and purchase compliance services directly — with clear pricing, guided onboarding, and no manual follow-ups.",
    },
    {
      icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(1).png?updatedAt=1771417293237',
      title: "Dedicated Service Ownership",
      desc: "Each service is assigned to a responsible team member, so clients always know who’s handling their work.",
    },
    {
      icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(2).png?updatedAt=1771417293299',
      title: "Built-In Follow-Ups & Tracking",
      desc: "Automated reminders and status tracking replace manual follow-ups and last-minute rushes.",
    },
    {
      icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(3).png?updatedAt=1771417293273',
      title: "Client & Team Dashboards",
      desc: "Clients track progress transparently, while teams manage workloads with clear visibility.",
    },
    {
      icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(4).png?updatedAt=1771417293232',
      title: "Recurring Compliance Mgmt",
      desc: "Monthly and periodic compliances are proactively handled — renewals and filings stay on schedule.",
    },
  ];

  const features1 = [
    {
      title: "Client Dashboard",
      desc: "Track service status, uploads, certificates, and history in one place.",
      icon: <MdDashboard className="text-2xl" />,
      badge: "Popular",
    },
    {
      title: "Dedicated Representative",
      desc: "A single point of contact assigned to handle your service end-to-end.",
      icon: <FaUserTie className="text-2xl" />,
    },
    {
      title: "Centralised Communication",
      desc: "All updates, requests, and confirmations tracked within the system.",
      icon: <FaSlack className="text-2xl" />,
    },
    {
      title: "Secure Document Storage",
      desc: "Upload, access, and download documents securely anytime.",
      icon: <HiOutlineDocumentText className="text-2xl" />,
    },
    {
      title: "Automated Follow-Ups",
      desc: "Renewals and recurring compliances tracked and followed up proactively.",
      icon: <FaDropbox className="text-2xl" />,
    },
    {
      title: "Complete Service History",
      desc: "View past services, filings, and certificates whenever needed.",
      icon: <FaHistory className="text-2xl" />,
    },
  ];

  const stats = [
    { value: "10+", label: "Compliance Experience" },
    { value: "1,000+", label: "Businesses Served" },
    { value: "5,000+", label: "Services Delivered" },
    { value: "100%", label: "Compliance Track" },
  ];

  const logos = [
    "Layers",
    "Sisyphus",
    "Circooles",
    "Catalog",
    "Quotient",
  ];

  const testimonials = [
    {
      name: "Rohit",
      location: "Chennai, India",
      title: "Smooth GST Registration",
      desc: `I was completely confused about GST registration and worried about making mistakes.
Insight Consultancy handled everything effortlessly — clear guidance, minimal paperwork, and quick completion.`,
      img: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Shruthi",
      location: "Coimbatore, India",
      title: "Professional & Reliable",
      desc: `What impressed me most was their patience and clarity.
Every step of my company registration was explained in simple terms, making the entire process stress-free.`,
      img: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "Aakash",
      location: "Bangalore, India",
      title: "Fast & Hassle-Free Service",
      desc: `Quick responses, zero confusion, and excellent support.
From documentation to filing, Insight Consultancy made compliance feel surprisingly easy.`,
      img: "https://i.pravatar.cc/100?img=33",
    },
  ];

  const [activeTab, setActiveTab] = useState("Services");
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    if (openItems.includes(index)) {
      // ❌ close only this item
      setOpenItems(openItems.filter((i) => i !== index));
    } else {
      // ✅ keep previous open + add new
      setOpenItems([...openItems, index]);
    }
  };



  const tabs = ["Services", "Documents Required", "Expert Support"];

  const faqData = {
    Services: [
      {
        q: "What services does Insight Consultancy provide?",
        a: "We offer end-to-end compliance solutions including GST registration & filing, company incorporation, MSME registration, trademark registration, and ongoing regulatory support."
      },
      {
        q: "Do you assist with post-registration compliance?",
        a: "Yes. We handle GST filings, annual returns, ROC compliance, tax filings, and other mandatory regulatory requirements."
      },
      {
        q: "Can you help with both new and existing businesses?",
        a: "Absolutely. Whether you are starting a new venture or managing an existing entity, we provide tailored compliance and documentation support."
      },
      {
        q: "Are your services suitable for startups and small businesses?",
        a: "Yes. Our solutions are designed to be simple, affordable, and scalable for startups, entrepreneurs, and growing businesses."
      }
    ],

    "Documents Required": [
      {
        q: "What documents are required for GST registration?",
        a: "Generally PAN, Aadhaar, address proof, bank details, and business information. Exact requirements vary depending on your business structure."
      },
      {
        q: "Do document requirements differ by business type?",
        a: "Yes. Proprietorships, Partnership Firms, LLPs, Companies, Trusts, and Societies each have specific documentation needs."
      },
      {
        q: "Will your team help me prepare the documents?",
        a: "Yes. We provide a clear checklist and guide you step-by-step to ensure accurate and hassle-free document submission."
      },
      {
        q: "What if I don't have all documents ready?",
        a: "No problem. Our experts will help you understand alternatives and assist you in arranging the required documents."
      }
    ],

    "Expert Support": [
      {
        q: "Will I receive guidance from compliance experts?",
        a: "Yes. Our experienced professionals guide you throughout the registration, documentation, and compliance process."
      },
      {
        q: "Can I consult before choosing a service?",
        a: "Absolutely. We help you evaluate your business needs and recommend the most suitable compliance solution."
      },
      {
        q: "How do I get support during the process?",
        a: "You can reach our team via call, email, or enquiry form. We provide timely updates and dedicated assistance."
      },
      {
        q: "Do you provide ongoing support after service completion?",
        a: "Yes. We offer continued compliance monitoring, filing assistance, and regulatory guidance as your business grows."
      }
    ]
  };



  return (
    <>
      <section className="relative bg-cover  bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-white/90"></div>
        <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20157.png" alt="" className="absolute -bottom-10  md:right-16 lg:right-0   lg:w-[50%]  h-160 md:h-180 lg:h-140   " />

        <div className="relative lg:px-12 px-4 container  mx-auto  pt-20 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className=" ">
            <p className="text-sm text-gray-600 mb-4">
              Trusted by <span className="text-red font-semibold">1,000+</span> Business Owners ❤️
            </p>

            <h1 className="text-2xl md:text-5xl font-semibold text-gray-800 leading-tight">
              Compliance Made  Simple by Experts{" "}
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

            <p className="mt-4  text-gray-600 max-w-lg">
              From registrations to ongoing filings, we help businesses stay compliant
              across multiple regulatory requirements.
            </p>

            <button className="mt-6 bg-red  text-white px-6 py-3 rounded-lg font-medium shadow">
              Explore Service Hub
            </button>
          </div>

          {/* RIGHT FORM */}
          <div className="relative px-4 ">


            <Enquiryform />
          </div>

        </div>


      </section>

      <section className="bg-white mt-14 border-t  border-b border-gray-200 overflow-hidden w-full">

        <div className="w-full px-4 py-3 flex items-center gap-6">

          {/* Left Title */}
          <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
            <span>Top Services Offered in</span>
            <span className="text-blue-600 font-medium">
              Insight Consulting
            </span>
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-5 border-l border-gray-300"></div>

          {/* Marquee */}
          <div className="relative flex-1 overflow-hidden">

            <div className="flex w-max gap-2 animate-[marquee_30s_linear_infinite]">
              {loopServices.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md text-gray-700 whitespace-nowrap"
                >
                  {service}
                </span>
              ))}
            </div>

          </div>
        </div>

        {/* INTERNAL KEYFRAMES */}
        <style>
          {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
        </style>
      </section>

      <section className="bg-[#05070c] text-white  py-10 lg:py-20">
        <div className=" container mx-auto">
          <div className=" lg:px-12 px-4  mx-auto ">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div>
              <p className="text-yellow text-sm tracking-widest mb-3">
                WHY WE EXIST
              </p>
              <h2 className="text-2xl md:text-5xl font-semibold mb-4">
                Built From Real Compliance Challenges
              </h2>
              <p className="text-gray-400 max-w-2xl">
                Working closely with businesses, we noticed that compliance
                failures rarely happen due to lack of intent — but due to poor
                tracking, manual follow-ups, and fragmented processes.
              </p>
            </div>

            <button className="self-start lg:self-auto bg-white text-black px-5 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
              Enquire Now &gt;&gt;
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#0b0f17] to-[#0a0d14] border border-white/5 rounded-xl p-6 backdrop-blur-md hover:border-white/10 transition"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 text-white text-xl mb-4">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[#797C86]  leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
      <section className="bg-[#f5f6f7]  py-10 lg:py-20">
        <div className="container mx-auto">
          <div className="lg:px-12 px-4 mx-auto ">

          {/* Top Row */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">

            {/* Left Content */}
            <div>
              <p className="text-yellow-600 text-sm font-semibold mb-3">
                HOW WE SOLVE IT
              </p>

              <h2 className="text-2xl md:text-5xl font-semibold text-gray-800 mb-4">
                A Smarter Way To Manage Compliance
              </h2>

              <p className="text-gray-600 max-w-xl">
                We built a structured system that simplifies compliance management,
                improves visibility, and ensures nothing is missed — for both
                clients and our internal teams.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Image.png"
                alt="illustration"
                className="w-full max-w-md"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 relative pt-5  md:pt-10">
            <div className="border border-dashed hidden lg:block border-gray-300 absolute top-1/2 w-full "></div>
            {features.map((item, index) => (
              <div key={index} className="flex gap-4 border-r border-[#EDEDED]">

                <img src={item.icon} className="w-10 h-9 flex items-center justify-center " />



                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600  leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA block */}
            <div className="lg:col-span-1 flex flex-col items-end justify-center">
              <p className="text-gray- text-right italic mb-4">
                Compliance services, available when you need them without{" "}
                <span className="font-semibold">Manual Coordination</span>
              </p>

              <button className="bg-red  text-white px-6 py-3 rounded-lg font-medium w-max">
                Explore Service Hub &gt;&gt;
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="bg-[#FFFAF1]   py-10 lg:py-20">
       <div className="mx-auto container">
         <div className=" px-4 lg:px-12 mx-auto ">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-yellow text-sm font-semibold mb-2">
              WHY INSIGHT CONSULTING
            </p>

            <h2 className="text-2xl md:text-5xl font-semibold text-gray-800 mb-3">
              Where Compliance Feels Simple
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              We don’t just deliver compliance services — we change how businesses
              experience compliance, communication, and follow-ups.
            </p>

            <button className="bg-red  text-white px-5 py-2 rounded-lg font-medium">
              Enquire Now &gt;&gt;
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left Card */}
            <div className="relative bg-[#E6F3DA] rounded-2xl md:p-6 p-3 min-h-[340px] overflow-hidden">
              <h3 className="text-xl  font-semibold text-green-600 ">
                Hassle Free
              </h3>
              <h4 className="font-semibold text-xl text-gray-800 mb-4 ">Process</h4>
              <p className="text-gray-600 text-sm max-w-xs">
                Simple steps, clear communication, and minimal back-and-forth throughout the service.
              </p>

              {/* Dummy Image */}
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/handsome-man-making-no-gesture%201.png"
                alt="dummy"
                className="absolute bottom-0 left-1/2 md:h-72 h-46 -translate-x-1/2"
              />
            </div>

            {/* Middle Column */}
            <div className="flex flex-col gap-6">

              {/* Card 2 */}
              <div className="relative bg-[#E9EEF2] rounded-2xl md:p-6 p-3 min-h-[200px] overflow-hidden">
                <h3 className="text-xl font-semibold text-gray-800">
                  No <span className="text-blue-600">Chasing</span>
                </h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs">
                  We proactively manage follow-ups <br /> and renewals, so clients don’t have to <br /> remind us.
                </p>

                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Adobe%20Express%20-%20file%20(2)%201.png"
                  alt="dummy"
                  className="absolute bottom-0 md:h-40 h-28 right-4"
                />
              </div>

              {/* Card 3 */}
              <div className="relative bg-[#FFF6D7] rounded-2xl p-3 lg:p-6 min-h-[200px] overflow-hidden">
                <h3 className="text-xl font-semibold text-yellow-600">
                  Clear Ownership
                </h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs">
                  Every step and update is <br className="md:block hidden" /> communicated clearly no confusion, <br className="md:block hidden" />no surprises.
                </p>

                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Untitled%20(3)%201.png"
                  alt="dummy"
                  className="absolute bottom-0 md:h-40 h-28 right-4"
                />
              </div>
            </div>

            {/* Right Card */}
            <div className="relative bg-[#F3EBED] rounded-2xl p-3 lg:p-6 min-h-[340px] overflow-hidden">
              <h3 className="text-xl font-semibold text-gray-800">
                Human <span className="text-pink-600">Support</span>
              </h3>
              <p className="text-gray-600 text-sm mt-2 max-w-xs">
                Real people who understand your business handle your compliance.
              </p>

              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/portrait-man-working-as-telemarketer%201.png"
                alt="dummy"
                className="absolute bottom-0 h-46 md:h-72 right-4"
              />
            </div>

          </div>
        </div>
       </div>
      </section>

      <section className="bg-[#f5f6f7]  py-10 md:py-16">
        <div className="container  lg:px-12 px-4 mx-auto ">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <p className="text-yellow-600 text-sm font-semibold mb-2">
                HOW IT WORKS
              </p>

              <h2 className="text-2xl md:text-5xl font-semibold text-gray-800 mb-3">
                Simple Steps. Zero Stress.
              </h2>

              <p className="text-gray-600 max-w-xl">
                We built the process anyone can use it — no complexity, no
                confusion, just a clear path to getting the compliance you need.
              </p>
            </div>

            <button className="bg-red  text-white px-6 py-3 rounded-lg font-medium">
              Explore Service Hub &gt;&gt;
            </button>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white rounded-xl  shadow-sm"
              >
                {/* Number */}
                <div className="bg-yellow rounded-tl-lg  h-full text-white font-semibold px-3 py-2">
                  {step.no}
                </div>

                {/* Content */}
                <div className=" relative  px-2 py-3">
                  <img className="h-14 absolute -top-5 right-0 text-gray-700 mb-2 " src={step.icon} />



                  <h3 className="font-semibold text-gray-800 mb-1">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" lg:py-16 py-10 ">
        <div className="container lg:px-12 px-4 mx-auto ">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full border border-indigo-300 flex items-center justify-center text-indigo-500">
                  <FaLightbulb />
                </div>
                <h2 className="text-2xl md:text-5xl font-semibold text-gray-800">
                  COMPLIANCE & CONTINUITY
                </h2>
              </div>

              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20(1).png?updatedAt=1771488262931"
                alt="underline"
                className="w-40 ml-12"
              />
            </div>

            <div className="max-w-md">
              <h3 className="font-semibold  text-gray-800 mb-2">
                Compliance You Don’t Have to Chase
              </h3>
              <p className="text-gray-600 text-sm">
                We don’t stop at one-time services. Our system is built to manage
                recurring compliances, renewals, and follow-ups proactively.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#eef0f2] rounded-2xl p-3 lg:p-6 grid lg:grid-cols-3 gap-6 items-center">

            {/* Left Image */}
            <div className="relative h-[380px] rounded-xl overflow-hidden">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Sub%20Container.png"
                alt="team"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 lg:p-6 text-white">
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-3xl font-semibold">10+</p>
                    <p className="text-xs">YOE</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">1k+</p>
                    <p className="text-xs">Clients Served</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">100+</p>
                    <p className="text-xs">Filings</p>
                  </div>
                </div>

                <button className="bg-red px-4 py-2 flex gap-2 rounded-full w-max">
                  < HiArrowRight size={10} className="w-8 h-8 p-2 text-black bg-white rounded-full" /> Enquire Now
                </button>
              </div>
            </div>

            {/* RIGHT FEATURES (CENTERED) */}
            <div className="lg:col-span-2 h-full bg-white rounded-3xl flex items-center">
              <div className="grid lg:grid-cols-2 w-full">

                {/* Item 1 */}
                <div className="flex gap-4  p-3 lg:p-6 md:border-b lg:border-r border-gray-200">
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
                    <LuShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Proactive Follow-Ups
                    </h4>
                    <p className="text-gray-600">
                      We track deadlines and follow up before issues arise.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4 p-3 lg:p-6 lg:border-b border-gray-200">
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
                    <BiChalkboard size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Recurring Compliance Handling
                    </h4>
                    <p className="text-gray-600">
                      Monthly and periodic compliances managed automatically.
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-4 p-3 lg:p-6 border-r border-gray-200">
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
                    <FaUserGroup size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Centralised Records
                    </h4>
                    <p className="text-gray-600">
                      All filings, certificates, and updates stored securely.
                    </p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex gap-4 p-3 lg:p-6">
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
                    <IoFlagSharp size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Dedicated Support
                    </h4>
                    <p className="text-gray-600">
                      Same team, consistent support, no repeated explanations.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#FDFBFF] py-16 ">
        <div className="lg:px-12 px-4 container  mx-auto">
          {/* Top Label */}
          <p className="text-red font-semibold text-sm tracking-wider">
            ONE PLATFORM
          </p>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-6">
            <div>
              <h2 className="text-2xl md:text-5xl font-semibold text-gray-900">
                Everything You Need, Connected in One Place
              </h2>
              <p className="text-gray-500 mt-2 max-w-xl">
                From communication to documents and follow-ups all managed within a single system.
              </p>
            </div>

            <div className="flex items-center">
              <button className="bg-red  text-white px-6 py-3 rounded-md font-medium transition">
                Explore Service Hub →
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {features1.map((item, i) => (
              <div
                key={i}
                className="relative bg-white rounded-xl p-6 border border-dashed border-gray-200 hover:shadow-md transition"
              >
                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-4 right-4 text-xs bg-yellow-400 text-white px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 mb-4">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" y-10 lg:py-16 ">
        <div className="lg:px-12 px-4 container  mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F7F8F8] text-red">
              <FaBolt />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-5xl font-semibold text-gray-900">
            Compliance Backed by Experience
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Helping businesses manage compliance reliably through a structured
            system and dedicated support.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((item, i) => (
              <div
                key={i}
                className="border-r last:border-none border-gray-200 px-4"
              >
                <p className="text-3xl md:text-4xl font-semibold text-red">
                  {item.value}
                </p>
                <p className="text-gray-600 text-sm mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Sub text */}
          <p className="text-gray-500 text-sm mt-10">
            Join 4,000+ companies already growing
          </p>

          {/* Logos */}
          <div className="flex flex-wrap justify-center items-center gap-10 mt-8 text-gray-700 font-medium">
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4EBFF33] py-10 lg:py-16 ">
        <div className="lg:px-12 px-4 mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-[#3E72F9] text-blue-600">
              <FaUsers />
            </div>
            <h2 className="text-2xl md:text-5xl font-semibold text-gray-900">
              Real Stories
            </h2>
          </div>

          <h3 className="text-lg font-medium text-gray-800">
            People Who Trusted the Panther
          </h3>

          <p className="text-gray-500 max-w-3xl mt-2">
            Authentic experiences from people who trusted LoanWalle when life moved faster than money — and got the support they needed.
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-sm transition"
              >
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    < BiBadgeCheck className="absolute bottom-4 -right-3 w-8 h-8 p-1 bg-[#3E72F9] text-white rounded-full text-lg" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.location}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-semibold mt-5 text-gray-900">
                  “{item.title}”
                </h4>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-3 leading-relaxed whitespace-pre-line">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 mt-10 gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Avatars */}
              <div className="flex -space-x-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=3"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=4"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-900">1,000+</span> Businesses Trust Our Compliance Services
              </p>
            </div>

            <button className="bg-red  text-white px-6 py-3 rounded-lg font-medium transition">
              Enquire Now ››
            </button>
          </div>
        </div>
      </section>
      <section className="  py-10 lg:py-16">
        <div className=" lg:px-12 px-4 container mx-auto">
          <div className="flex flex-col  md:flex-row md:justify-between md:items-center mb-10 gap-4">
            <div>
              <h2 className=" text-2xl lg:text-5xl font-bold text-gray-800">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 mt-2">
                Still you have any questions? Contact our team at
                <span className="text-red-"> support@produce-ui.com</span>
              </p>
            </div>

            <div>
              <button className="bg-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition">
                Contact Us
              </button>
            </div>

          </div>

          <div className="flex gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition
              ${activeTab === tab
                    ? "bg-red text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="container px-4 md:px-12 mx-auto  grid md:grid-cols-2 items-center gap-6">



          {faqData[activeTab]?.map((item, i) => (
            <div key={i} className="bg-white border rounded-xl p-5">

              {/* Question */}
              <button
                onClick={() => toggleItem(i)}
                className="w-full flex justify-between items-center text-left font-medium"
              >
                {item.q}
                <span className="text-xl text-red">
                  {openItems.includes(i) ? "−" : "+"}
                </span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openItems.includes(i) && (
                  <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-500 mt-3 text-sm">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ))}

        </div>
      </section>
      <section className="bg-[#F5F8FA] py-10 lg:py-20">
        <div className="px-4 lg:px-12 container mx-auto py-5 ">

          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-yellow text-sm font-semibold mb-2">
              Founder Note
            </p>

            <h2 className="text-2xl md:text-5xl font-semibold text-gray-800">
              Meet Our Founder
            </h2>

            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              A message from our founder on simplifying compliance, empowering entrepreneurs,
              and helping businesses grow with confidence.
            </p>
          </div>


          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>

              {/* Founder Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="founder"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <BiBadgeCheck className="text-blue-500 absolute bottom-0 -right-2 bg-white w-6 h-6 rounded-full text-sm" />

                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Pravin Kumar
                  </h4>

                  <p className="text-gray-500 text-sm">
                    Founder, Insight Consultancy
                  </p>
                </div>
              </div>

              {/* Tag */}
             <p className="text-red text-xs font-semibold mb-4 tracking-wide">
          ● OUR VISION & MISSION
        </p>

        {/* Title */}
        <h3 className="text-xl md:text-3xl font-semibold text-gray-800 leading-snug mb-4">
          Simplifying Compliance. Empowering Businesses.
        </h3>

        {/* Description */}
        <p className="text-gray-500 mb-6 max-w-lg">
          Insight Consultancy was built with a simple goal — to remove the complexity
          of registrations, filings, and regulatory requirements so entrepreneurs
          can focus on growing their businesses with clarity and confidence.
        </p>

              {/* Button */}
              <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                Meet the Panther
              </button>
            </div>

            {/* Right Video Card */}
            <div className="relative">

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">

                {/* Browser Bar */}
                <div className="bg-gray-600 px-4 py-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                </div>

                {/* Video */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
                    alt="video"
                    className="w-full h-[280px] object-cover"
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur rounded-full p-4 shadow-md">
                      <IoPlay className="text-2xl text-gray-800" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="py-15 bg-[#f5f6f7]">
        <div className="max-w-6xl mx-auto px-6">

          <div className="relative overflow-hidden rounded-2xl border border-[#E5EFFF] bg-white px-8 py-12 text-center">

            {/* LEFT BG ILLUSTRATION */}
            <div
              className="absolute left-0 top-0 w-96 h-96 opacity-90 bg-no-repeat bg-contain"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Lefft%20Illustration.png')"
              }}
            />

            {/* RIGHT BG ILLUSTRATION */}
            <div
              className="absolute -right-50 bottom-0  w-96 h-96 opacity-90 bg-no-repeat bg-contain"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Right%20Illustration.png')"
              }}
            />

            {/* CONTENT */}
          <div className="relative z-10 max-w-2xl mx-auto">

        {/* Subheading */}
        <p className="text-gray-400 text-xs tracking-widest mb-3">
          BUSINESS COMPLIANCE MADE SIMPLE
        </p>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-snug">
          Start Your Business Journey With <br />
          <span className="underline decoration-gray-300">
            Expert Compliance Support
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-4 text-sm">
          From registrations to filings, Insight Consultancy helps you navigate
          regulatory requirements with ease, accuracy, and complete peace of mind.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button className="bg-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition">
            Explore Our Services
          </button>

          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
            Speak With an Expert
          </button>
        </div>

        {/* Note */}
        <p className="text-gray-400 text-xs mt-3">
          *Quick, simple & hassle-free process
        </p>

      </div>
          </div>
        </div>
      </section>

    </>
  );
}
