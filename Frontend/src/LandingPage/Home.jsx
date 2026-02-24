import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import {
  FaRegClock,
  FaComments,
  FaUserCheck,
  FaLayerGroup,
  FaSyncAlt,
  FaTasks,
} from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
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
import { IoPlay } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import Enquiryform from "./reusable/Enquiryform";

/* ─── Static Data ─────────────────────────────────────────────────── */

const steps = [
  {
    no: "01",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/info-folder%201.png",
    title: "Choose a Service",
    desc: "Browse, enquire, or purchase services directly from our platform.",
  },
  {
    no: "02",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/upload-cloud-folder%201.png",
    title: "Login & Submit Details",
    desc: "Access your dashboard and upload the required documents securely.",
  },
  {
    no: "03",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/upload-cloud-folder%202.png",
    title: "Representative Assigned",
    desc: "A dedicated representative manages your service end-to-end.",
  },
  {
    no: "04",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/info-folder%203.png",
    title: "Receive Your Certificate",
    desc: "Get certificates, filings, and proactive follow-ups for recurring services.",
  },
];

const challenges = [
  {
    icon: <FaTasks />,
    title: "Manual Follow-Ups Everywhere",
    desc: "Client reminders, document collection, and status updates handled manually — causing delays and missed actions.",
  },
  {
    icon: <FaRegClock />,
    title: "Missed Deadlines & Renewals",
    desc: "Without a structured system, recurring compliances were often forgotten or addressed at the last minute.",
  },
  {
    icon: <FaComments />,
    title: "Scattered Communication",
    desc: "Updates, certificates, and confirmations shared over calls and chats — with no single source of truth.",
  },
  {
    icon: <FaUserCheck />,
    title: "No Clear Ownership",
    desc: "Clients didn't know who was handling their service, and teams lacked visibility into task status.",
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
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container.png?updatedAt=1771417293358",
    title: "Buy Services Online",
    desc: "Browse, select, and purchase compliance services directly — with clear pricing and guided onboarding.",
  },
  {
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(1).png?updatedAt=1771417293237",
    title: "Dedicated Service Ownership",
    desc: "Each service is assigned to a responsible team member, so clients always know who's handling their work.",
  },
  {
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(2).png?updatedAt=1771417293299",
    title: "Built-In Follow-Ups & Tracking",
    desc: "Automated reminders and status tracking replace manual follow-ups and last-minute rushes.",
  },
  {
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(3).png?updatedAt=1771417293273",
    title: "Client & Team Dashboards",
    desc: "Clients track progress transparently, while teams manage workloads with clear visibility.",
  },
  {
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(4).png?updatedAt=1771417293232",
    title: "Recurring Compliance Mgmt",
    desc: "Monthly and periodic compliances are proactively handled — renewals and filings stay on schedule.",
  },
];

const platformFeatures = [
  {
    title: "Client Dashboard",
    desc: "Track service status, uploads, certificates, and history in one centralized place.",
    icon: <MdDashboard className="text-xl" />,
    badge: "Popular",
  },
  {
    title: "Dedicated Representative",
    desc: "A single point of contact assigned to handle your service end-to-end.",
    icon: <FaUserTie className="text-xl" />,
  },
  {
    title: "Centralised Communication",
    desc: "All updates, requests, and confirmations tracked within the platform.",
    icon: <FaSlack className="text-xl" />,
  },
  {
    title: "Secure Document Storage",
    desc: "Upload, access, and download your compliance documents securely anytime.",
    icon: <HiOutlineDocumentText className="text-xl" />,
  },
  {
    title: "Automated Follow-Ups",
    desc: "Renewals and recurring compliances tracked and followed up proactively.",
    icon: <FaDropbox className="text-xl" />,
  },
  {
    title: "Complete Service History",
    desc: "View past services, filings, and certificates whenever you need them.",
    icon: <FaHistory className="text-xl" />,
  },
];

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "1,000+", label: "Businesses Served" },
  { value: "5,000+", label: "Services Delivered" },
  { value: "100%", label: "Compliance Track Record" },
];

const logos = ["Layers", "Sisyphus", "Circooles", "Catalog", "Quotient"];

const testimonials = [
  {
    name: "Rahul Mehta",
    location: "Delhi, India",
    title: "GST Registration — Fast & Seamless",
    desc: "Applied for GST registration during a critical business launch. The team handled everything proactively and we received our GSTIN in just 8 working days — faster than expected.",
    img: "https://i.pravatar.cc/100?img=12",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Pune, India",
    title: "Truly Hassle-Free Experience",
    desc: "Never thought compliance could be this stress-free. Insight Consulting handled our trademark registration with clear communication and updates at every single step. Highly recommended.",
    img: "https://i.pravatar.cc/100?img=5",
    rating: 5,
  },
  {
    name: "Aakash Gupta",
    location: "Mumbai, India",
    title: "Dedicated Support Made the Difference",
    desc: "Having a single point of contact who knew our business inside out was invaluable. Our representative proactively managed all renewals — we never had to chase anyone.",
    img: "https://i.pravatar.cc/100?img=33",
    rating: 5,
  },
];

const faqData = [
  {
    q: "How do I get started with your compliance services?",
    a: "Getting started is simple — browse our Service Hub, select the service you need, and submit an enquiry. Our team will contact you within 15 minutes to understand your requirements and guide you through the process.",
  },
  {
    q: "How long does GST registration typically take?",
    a: "GST registration typically takes 7–15 business days from the date of complete document submission. Our team handles all government portal follow-ups to ensure timely completion.",
  },
  {
    q: "What documents are required for company incorporation?",
    a: "You'll need identity proof, address proof, and PAN card for all directors, along with a registered office address proof. After your enquiry, our team provides a complete document checklist tailored to your structure.",
  },
  {
    q: "Do you handle recurring compliance like monthly GST filing?",
    a: "Yes! We offer comprehensive ongoing compliance management, including monthly/quarterly GST filing, annual returns, and renewal tracking. Our system proactively manages all deadlines.",
  },
  {
    q: "How can I track the status of my ongoing service?",
    a: "You'll receive access to a dedicated client dashboard where you can monitor real-time service status, view uploaded documents, communicate with your representative, and download certificates.",
  },
  {
    q: "Will I have a dedicated representative for my compliance?",
    a: "Absolutely. Every service is assigned to a dedicated team member who manages it end-to-end. You'll always have a direct point of contact, and all updates are centralized in your client portal.",
  },
];

const tabs = ["UI Elements", "Pages", "Templates"];

/* ─── Component ──────────────────────────────────────────────────── */

export default function Home() {
  const [activeTab, setActiveTab] = useState("UI Elements");
  const [openItems, setOpenItems] = useState([]);

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

  const toggleItem = (index) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-bright">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-bright to-bright pointer-events-none" />
        {/* Decorative blob */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "var(--color-primary)" }}
        />

        {/* Decorative vector */}
        <img
          src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20157.png"
          alt=""
          className="absolute -bottom-10 md:right-16 lg:right-0 lg:w-[50%] h-160 md:h-180 lg:h-140 pointer-events-none select-none opacity-80"
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-14 pb-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left Content ── */}
          <div className="space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-bright border border-border rounded-full px-4 py-1.5 shadow-sm text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <span className="text-textdark/70">
                Trusted by{" "}
                <span className="text-primary font-semibold">1,000+</span>{" "}
                Business Owners
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-textdark leading-[1.15] tracking-tight">
              Compliance Made
              <br className="hidden sm:block" /> Simple by Experts
              <br className="hidden sm:block" />
              <span className="text-primary">
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

            {/* Subtext */}
            <p className="text-textlight text-lg leading-relaxed max-w-lg">
              From registrations to ongoing filings, we help businesses stay
              compliant across multiple regulatory requirements — without the
              stress.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link to="/servicehub">
                <button className="btn-cta">
                  Explore Services <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/contact">
                <button className="btn-outline">Talk to an Expert</button>
              </Link>
            </div>

            {/* Trust micro-signals */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-sm text-textdark/60">
              {["Free Consultation", "No Hidden Charges", "Expert Support"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <FaCheckCircle className="text-green-500 text-xs flex-shrink-0" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* ── Right Form ── */}
          <div className="relative">
            <Enquiryform />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. SERVICE MARQUEE
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bright border-t border-b border-border overflow-hidden">
        <div className="w-full px-4 py-3 flex items-center gap-5">
          {/* Label */}
          <div className="flex items-center gap-2 text-xs whitespace-nowrap flex-shrink-0">
            <span className="text-textlight font-medium">Top Services at</span>
            <span className="text-primary font-semibold">Insight Consulting</span>
          </div>

          <div className="h-4 border-l border-border hidden sm:block flex-shrink-0" />

          {/* Marquee */}
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max gap-2 animate-[marquee_30s_linear_infinite]">
              {loopServices.map((service, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs font-medium bg-secondary/60 border border-border rounded-lg text-textdark/70 whitespace-nowrap"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. WHY WE EXIST — CHALLENGES
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-darksurface text-textbright px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-14">
            <div className="lg:max-w-lg">
              <p className="section-label text-yellow mb-3">Why We Exist</p>
              <h2 className="section-heading text-textbright mb-4">
                Built From Real Compliance Challenges
              </h2>
              <p className="text-textbright/50 leading-relaxed">
                Working closely with businesses, we noticed compliance failures
                rarely happen due to lack of intent — but poor tracking, manual
                follow-ups, and fragmented processes.
              </p>
            </div>

            <Link to="/contact" className="self-start lg:self-auto flex-shrink-0">
              <button className="bg-textbright text-textdark px-6 py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition-all duration-200 active:scale-[0.98]">
                Enquire Now →
              </button>
            </Link>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map((item, i) => (
              <div
                key={i}
                className="bg-darkcard border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/15 text-primary text-lg mb-4 border border-primary/10">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-base text-textbright mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-textbright/45 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. HOW WE SOLVE IT
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">

          {/* Top Row */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <p className="section-label text-yellow mb-3">How We Solve It</p>
              <h2 className="section-heading mb-4">
                A Smarter Way To Manage Compliance
              </h2>
              <p className="text-textlight leading-relaxed max-w-lg">
                We built a structured system that simplifies compliance
                management, improves visibility, and ensures nothing is missed —
                for both clients and our internal teams.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Image.png"
                alt="Compliance illustration"
                className="w-full max-w-sm lg:max-w-md"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 pt-4">
            {/* Dashed horizontal line */}
            <div className="hidden lg:block absolute top-1/2 w-full border-t border-dashed border-border" />

            {features.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 group"
              >
                <img
                  src={item.icon}
                  alt=""
                  className="w-10 h-9 flex-shrink-0 mt-0.5"
                />
                <div>
                  <h3 className="font-semibold text-textdark mb-1 group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-textlight text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA block */}
            <div className="lg:col-span-1 flex flex-col items-start lg:items-end justify-center gap-4">
              <p className="text-textlight text-sm italic text-left lg:text-right max-w-xs">
                Compliance services, available when you need them —{" "}
                <span className="font-semibold text-textdark">
                  without Manual Coordination
                </span>
              </p>
              <Link to="/servicehub">
                <button className="btn-cta text-sm">
                  Explore Service Hub →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. WHERE COMPLIANCE FEELS SIMPLE — BENTO
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-warmwhite px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="section-label text-yellow mb-3">Why Insight Consulting</p>
            <h2 className="section-heading mb-4">
              Where Compliance Feels Simple
            </h2>
            <p className="text-textlight max-w-2xl mx-auto leading-relaxed mb-6">
              We don't just deliver compliance services — we change how businesses
              experience compliance, communication, and follow-ups.
            </p>
            <Link to="/contact">
              <button className="btn-cta text-sm">Enquire Now →</button>
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Green — tall left */}
            <div className="relative bg-greensoft rounded-2xl p-5 lg:p-6 min-h-72 overflow-hidden">
              <h3 className="text-lg font-bold text-green-700 leading-none">Hassle Free</h3>
              <h4 className="text-lg font-bold text-textdark mb-3">Process</h4>
              <p className="text-textdark/60 text-sm max-w-xs leading-relaxed">
                Simple steps, clear communication, and minimal back-and-forth throughout the service.
              </p>
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/handsome-man-making-no-gesture%201.png"
                alt="Hassle free process"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-44 md:h-64 object-contain select-none"
              />
            </div>

            {/* Middle column */}
            <div className="flex flex-col gap-5">

              {/* Blue */}
              <div className="relative bg-bluesoft rounded-2xl p-5 lg:p-6 min-h-44 overflow-hidden">
                <h3 className="text-lg font-bold text-textdark leading-snug">
                  No <span className="text-primary">Chasing</span>
                </h3>
                <p className="text-textdark/60 text-sm mt-2 max-w-xs leading-relaxed">
                  We proactively manage follow-ups and renewals, so clients don't have to remind us.
                </p>
                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Adobe%20Express%20-%20file%20(2)%201.png"
                  alt="No chasing"
                  className="absolute bottom-0 right-4 h-28 md:h-36 object-contain select-none"
                />
              </div>

              {/* Yellow */}
              <div className="relative bg-yellowsoft rounded-2xl p-5 lg:p-6 min-h-44 overflow-hidden">
                <h3 className="text-lg font-bold text-yellow-700 leading-snug">Clear Ownership</h3>
                <p className="text-textdark/60 text-sm mt-2 max-w-xs leading-relaxed">
                  Every step and update is communicated clearly — no confusion, no surprises.
                </p>
                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Untitled%20(3)%201.png"
                  alt="Clear ownership"
                  className="absolute bottom-0 right-4 h-28 md:h-36 object-contain select-none"
                />
              </div>
            </div>

            {/* Pink — tall right */}
            <div className="relative bg-pinksoft rounded-2xl p-5 lg:p-6 min-h-72 overflow-hidden">
              <h3 className="text-lg font-bold text-textdark leading-snug">
                Human <span className="text-red">Support</span>
              </h3>
              <p className="text-textdark/60 text-sm mt-2 max-w-xs leading-relaxed">
                Real people who understand your business handle your compliance needs.
              </p>
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/portrait-man-working-as-telemarketer%201.png"
                alt="Human support"
                className="absolute bottom-0 right-4 h-44 md:h-64 object-contain select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. HOW IT WORKS — STEPS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div>
              <p className="section-label text-yellow mb-3">How It Works</p>
              <h2 className="section-heading mb-3">Simple Steps. Zero Stress.</h2>
              <p className="text-textlight max-w-xl leading-relaxed">
                A clear, guided process that anyone can follow — no complexity, no
                confusion, just a straight path to the compliance you need.
              </p>
            </div>
            <Link to="/servicehub" className="self-start lg:self-auto flex-shrink-0">
              <button className="btn-cta text-sm">
                Explore Service Hub →
              </button>
            </Link>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative bg-bright rounded-2xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                {/* Step number bar */}
                <div className="bg-yellow px-4 py-2.5 flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{step.no}</span>
                </div>

                {/* Content */}
                <div className="relative px-5 py-4 pt-5">
                  {/* Floating icon */}
                  <img
                    src={step.icon}
                    alt=""
                    className="h-12 absolute top-0 right-4 -translate-y-4 select-none"
                  />
                  <h3 className="font-semibold text-textdark mb-1.5 leading-snug pr-10 group-hover:text-primary transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-textlight text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. COMPLIANCE & CONTINUITY
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bright px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-full border border-primary/30 flex items-center justify-center text-primary text-sm flex-shrink-0">
                  <FaLightbulb />
                </div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-textdark tracking-tight">
                  Compliance &amp; Continuity
                </h2>
              </div>
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20(1).png?updatedAt=1771488262931"
                alt=""
                className="w-36 ml-12 opacity-60"
              />
            </div>

            <div className="max-w-sm">
              <h3 className="font-semibold text-textdark mb-2">
                Compliance You Don't Have to Chase
              </h3>
              <p className="text-textlight text-sm leading-relaxed">
                Our system is built to manage recurring compliances, renewals,
                and follow-ups proactively — so nothing ever slips through.
              </p>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-coolsurface rounded-2xl p-4 lg:p-6 grid lg:grid-cols-3 gap-5 items-stretch">

            {/* Left image */}
            <div className="relative h-80 lg:h-auto rounded-xl overflow-hidden">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Sub%20Container.png"
                alt="Compliance team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-textdark/50 flex flex-col justify-end p-5 text-textbright">
                <div className="flex gap-6 mb-5">
                  {[
                    { v: "10+", l: "Years of Exp." },
                    { v: "1k+", l: "Clients Served" },
                    { v: "100+", l: "Filings Done" },
                  ].map(({ v, l }) => (
                    <div key={l}>
                      <p className="text-2xl font-bold leading-none">{v}</p>
                      <p className="text-textbright/70 text-xs mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
                <Link to="/contact">
                  <button className="bg-red px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold w-max hover:opacity-90 transition-opacity">
                    <HiArrowRight className="w-7 h-7 p-1.5 bg-textbright text-textdark rounded-full flex-shrink-0" />
                    Enquire Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Feature grid */}
            <div className="lg:col-span-2 bg-bright rounded-2xl flex items-center">
              <div className="grid lg:grid-cols-2 w-full divide-y lg:divide-y-0 lg:divide-x divide-border">
                {[
                  {
                    icon: <LuShieldCheck size={20} />,
                    title: "Proactive Follow-Ups",
                    desc: "We track deadlines and follow up before issues arise.",
                    border: "lg:border-b",
                  },
                  {
                    icon: <BiChalkboard size={20} />,
                    title: "Recurring Compliance",
                    desc: "Monthly and periodic compliances managed automatically.",
                    border: "lg:border-b",
                  },
                  {
                    icon: <FaUserGroup size={18} />,
                    title: "Centralised Records",
                    desc: "All filings, certificates, and updates stored securely.",
                    border: "",
                  },
                  {
                    icon: <IoFlagSharp size={18} />,
                    title: "Dedicated Support",
                    desc: "Same team, consistent support — no repeated explanations.",
                    border: "",
                  },
                ].map(({ icon, title, desc, border }, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 p-5 lg:p-6 ${border} border-border`}
                  >
                    <div className="w-10 h-10 p-2 rounded-xl bg-yellow/10 border border-yellow/20 flex items-center justify-center text-yellow flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-textdark mb-1 leading-snug">
                        {title}
                      </h4>
                      <p className="text-textlight text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. PLATFORM FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-secondary/20 py-16 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <p className="section-label text-red mb-2">One Platform</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h2 className="section-heading max-w-xl mb-3">
                Everything You Need, Connected in One Place
              </h2>
              <p className="text-textlight max-w-xl leading-relaxed">
                From communication to documents and follow-ups — all managed
                within a single, structured platform.
              </p>
            </div>
            <Link to="/servicehub" className="self-start md:self-auto flex-shrink-0">
              <button className="btn-cta text-sm">
                Explore Service Hub →
              </button>
            </Link>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {platformFeatures.map((item, i) => (
              <div
                key={i}
                className="relative bg-bright rounded-2xl p-6 border border-border hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                {item.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold bg-yellow text-textbright px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {item.badge}
                  </span>
                )}

                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-secondary text-primary mb-4 group-hover:bg-primary group-hover:text-textbright transition-all duration-300">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-textdark mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-textlight text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. STATS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bright py-16 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">

          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-red mx-auto mb-5">
            <FaBolt />
          </div>

          <h2 className="section-heading max-w-2xl mx-auto mb-4">
            Compliance Backed by Experience
          </h2>
          <p className="text-textlight max-w-lg mx-auto leading-relaxed">
            Helping businesses manage compliance reliably through a structured
            system and dedicated expert support.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-14 border border-border rounded-2xl overflow-hidden">
            {stats.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-8 px-6 border-r last:border-r-0 border-border border-b md:border-b-0 even:border-b md:odd:border-b-0"
              >
                <p className="text-4xl md:text-5xl font-bold text-red leading-none">
                  {item.value}
                </p>
                <p className="text-textlight text-sm mt-2 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Partner logos */}
          <p className="text-textlight text-sm mt-12 mb-6">
            Join{" "}
            <span className="font-semibold text-textdark">4,000+</span>{" "}
            companies already growing
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {logos.map((logo, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm font-semibold text-textdark/50 hover:text-textdark transition-colors duration-200"
              >
                <div className="w-6 h-6 bg-border rounded-full flex-shrink-0" />
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          10. TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-secondary/25 py-16 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-10 rounded-xl bg-bright border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <FaUsers />
            </div>
            <h2 className="section-heading">Real Stories</h2>
          </div>
          <p className="font-medium text-textdark mb-1">
            Businesses That Trust Insight Consulting
          </p>
          <p className="text-textlight max-w-2xl leading-relaxed mb-10">
            Authentic experiences from business owners who trusted us with their
            compliance — and got reliable, proactive support every step of the way.
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="bg-bright rounded-2xl p-6 border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: item.rating }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      className="text-yellow fill-yellow"
                    />
                  ))}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-textdark mb-3 leading-snug">
                  "{item.title}"
                </h4>

                {/* Description */}
                <p className="text-textlight text-sm leading-relaxed mb-5">
                  {item.desc}
                </p>

                {/* Profile */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <BiBadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-textbright rounded-full text-sm p-0.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-textdark">{item.name}</p>
                    <p className="text-xs text-textlight">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-bright border border-border rounded-2xl px-6 py-4 mt-8 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/40?img=${n}`}
                    className="w-9 h-9 rounded-full border-2 border-bright object-cover"
                    alt=""
                  />
                ))}
              </div>
              <p className="text-textdark/70 text-sm text-center sm:text-left">
                <span className="font-semibold text-textdark">1,000+</span>{" "}
                businesses already managing compliance with us
              </p>
            </div>
            <Link to="/contact">
              <button className="btn-cta text-sm flex-shrink-0">
                Enquire Now ›
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          11. FAQ
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bright px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
            <div>
              <p className="section-label text-primary mb-3">Got Questions?</p>
              <h2 className="section-heading mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-textlight text-sm">
                Still have questions?{" "}
                <Link to="/contact" className="text-primary font-semibold hover:underline">
                  Contact our team
                </Link>
              </p>
            </div>
            <Link to="/contact" className="self-start flex-shrink-0">
              <button className="btn-cta text-sm">Contact Us</button>
            </Link>
          </div>

          {/* Tab filter */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-primary text-textbright shadow-md shadow-primary/20"
                    : "bg-secondary text-textdark hover:bg-primary/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Accordion grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {faqData.map((item, i) => (
              <div
                key={i}
                className="border border-border rounded-2xl p-5 hover:border-primary/25 transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(i)}
                  className="w-full flex justify-between items-center text-left gap-4"
                  aria-expanded={openItems.includes(i)}
                >
                  <span className="font-semibold text-textdark text-sm leading-snug">
                    {item.q}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                      openItems.includes(i)
                        ? "bg-primary text-textbright rotate-180"
                        : "bg-secondary text-textdark"
                    }`}
                  >
                    <ChevronDown size={14} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openItems.includes(i) && (
                    <motion.div
                      key={i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-textlight text-sm leading-relaxed mt-3 pr-8">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          12. FOUNDER NOTE
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-14">
            <p className="section-label text-yellow mb-3">Founder Note</p>
            <h2 className="section-heading mb-3">Meet Our Founder</h2>
            <p className="text-textlight max-w-xl mx-auto leading-relaxed">
              A note from the founder on why Insight Consulting was built — to
              make compliance simple, transparent, and stress-free for every
              business.
            </p>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left */}
            <div>
              {/* Founder info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-shrink-0">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="Founder"
                    className="w-16 h-16 rounded-full object-cover border-2 border-border"
                  />
                  <BiBadgeCheck className="text-primary absolute bottom-0 -right-1.5 bg-bright w-6 h-6 rounded-full border border-border" />
                </div>
                <div>
                  <h4 className="font-bold text-textdark">Founder Name</h4>
                  <p className="text-textlight text-sm">
                    Founder, Insight Consulting
                  </p>
                </div>
              </div>

              <p className="section-label text-red mb-4">● Founder's Message</p>

              <h3 className="text-2xl md:text-3xl font-bold text-textdark leading-snug mb-4">
                Your Compliance Partner,{" "}
                <span className="text-primary">Every Step of the Way.</span>
              </h3>

              <p className="text-textlight leading-relaxed mb-7 max-w-md">
                Built from real compliance challenges we saw businesses face —
                poor tracking, manual follow-ups, and fragmented processes. We
                created Insight Consulting to bring structure, transparency, and
                reliability to compliance management.
              </p>

              <button className="bg-textdark text-textbright px-6 py-3 rounded-full text-sm font-semibold hover:bg-textdark/80 transition-all duration-200 active:scale-[0.98]">
                Learn Our Story →
              </button>
            </div>

            {/* Right video card */}
            <div className="relative">
              <div className="bg-bright rounded-2xl shadow-xl border border-border overflow-hidden">
                {/* Browser bar */}
                <div className="bg-coolsurface px-4 py-2.5 flex items-center gap-1.5">
                  {["bg-red/70", "bg-yellow/70", "bg-green-400/70"].map(
                    (c, i) => (
                      <span key={i} className={`w-3 h-3 ${c} rounded-full`} />
                    )
                  )}
                </div>

                {/* Video thumbnail */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
                    alt="Founder video"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-textdark/20">
                    <button
                      aria-label="Play founder video"
                      className="bg-bright/95 backdrop-blur rounded-full p-4 shadow-xl hover:scale-105 transition-transform duration-200"
                    >
                      <IoPlay className="text-2xl text-textdark ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-4 -left-4 bg-bright rounded-xl border border-border shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <FaUsers size={16} />
                </div>
                <div>
                  <p className="font-bold text-textdark text-sm leading-none">1,000+</p>
                  <p className="text-textlight text-xs mt-0.5">Satisfied Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          13. CTA SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-bright px-8 sm:px-12 py-14 text-center shadow-sm">

            {/* Background illustrations */}
            <div
              className="absolute left-0 top-0 w-72 h-72 opacity-80 bg-no-repeat bg-contain pointer-events-none select-none"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Lefft%20Illustration.png')",
              }}
            />
            <div
              className="absolute -right-16 bottom-0 w-72 h-72 opacity-80 bg-no-repeat bg-contain pointer-events-none select-none"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Right%20Illustration.png')",
              }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-xl mx-auto">
              <p className="section-label text-textlight mb-4">
                Take the Next Step
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-textdark leading-snug mb-4">
                Start Your Compliance{" "}
                <span className="text-primary">Journey Today</span>
              </h2>

              <p className="text-textlight leading-relaxed mb-8">
                Join 1,000+ businesses that trust Insight Consulting to manage
                their compliance — reliably, proactively, and on time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <button className="btn-cta">
                    Enquire Now →
                  </button>
                </Link>
                <Link to="/servicehub">
                  <button className="btn-outline">
                    Explore Services
                  </button>
                </Link>
              </div>

              <p className="text-textlight text-xs mt-5">
                Free consultation · No commitment required
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
