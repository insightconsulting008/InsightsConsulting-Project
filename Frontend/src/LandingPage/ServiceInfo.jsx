import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaGift, FaBoxes, FaArrowUp } from "react-icons/fa";
import {
  FaInfoCircle,
  FaFileAlt,
  FaListOl,
  FaQuestionCircle,
} from "react-icons/fa";
import { FaArrowLeft, FaArrowRight, FaQuoteRight} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Enquiryform from "./reusable/Enquiryform";
import { useParams } from "react-router-dom";

/* ── DATA ── */
const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: <FaInfoCircle />,
    tag: "Process",
    title: "GST Registration Process",
    desc1:
      "GST registration is mandatory for businesses exceeding the turnover threshold set by the government. Once registered, businesses can claim input tax credits and stay compliant.",
    desc2:
      "After approval, a unique GSTIN is issued and the business can start filing returns, charging GST, and availing ITC benefits.",
  },
  {
    id: "documents",
    label: "Documents Required",
    icon: <FaFileAlt />,
    tag: "Documents Required",
    title: "Documents Needed",
    desc1:
      "PAN card, Aadhaar card, address proof of business premises, and bank account details are the core documents required for every applicant.",
    desc2:
      "Additional documents depend on the business type — such as partnership deed, MOA/AOA for companies, or lease agreement for rented premises.",
  },
  {
    id: "process",
    label: "Registration Process",
    icon: <FaListOl />,
    tag: "Registration Process",
    title: "How Registration Works",
    desc1:
      "Apply online on the GST portal, fill in the required details, and upload all necessary documents. The portal generates an ARN for tracking.",
    desc2:
      "Verification is completed via OTP on your registered mobile/email or DSC. Approval is typically granted within 3–7 working days.",
  },
  {
    id: "faq",
    label: "FAQ",
    icon: <FaQuestionCircle />,
    tag: "FAQ",
    title: "Frequently Asked Questions",
  },
];

const faqTabs = ["ALL", "ORDERING", "SHIPPING", "RETURNS", "CUSTOMER SUPPORT"];

const faqData = [
  { category: "ORDERING", q: "Who needs to register for GST?", a: "Businesses crossing turnover limit must register." },
  { category: "ORDERING", q: "How can I place an order on Klothink?", a: "Ordering is easy! Simply browse, add items to cart and checkout." },
  { category: "RETURNS", q: "How do I initiate a return?", a: "Go to orders page and click return." },
  { category: "RETURNS", q: "Are there any additional fees for returns?", a: "No additional fees within policy period." },
  { category: "CUSTOMER SUPPORT", q: "How do I create an account on Klothink?", a: "Click signup and fill details." },
  { category: "CUSTOMER SUPPORT", q: "Can I change my account information?", a: "Yes from profile settings." },
  { category: "SHIPPING", q: "How can I track my order?", a: "Tracking link will be emailed." },
  { category: "SHIPPING", q: "What is your shipping policy?", a: "Delivery in 3–5 business days." },
];

const testimonials = [
  {
    name: "Sarah Thompson",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Klothink exceeded my expectations. The gown's quality and design made me feel like a queen. Fast shipping, too!",
  },
  {
    name: "Rajesh Patel",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Absolutely love the style and warmth of the jacket. A perfect blend of fashion and functionality!",
  },
  {
    name: "Emily Walker",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Adorable and comfortable! My daughter loves her new outfit. Thank you for dressing our little fashionista.",
  },
  {
    name: "Daniel Smith",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "Great quality and amazing support. Will definitely shop again!",
  },
];

const ServiceInfoSection = () => {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isStickyActive, setIsStickyActive] = useState(true); // New state for sticky control

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoadingSub(true);
        const res = await fetch(
          `https://insightsconsult-backend.onrender.com/api/categories/${categoryId}/subcategories`
        );
        const data = await res.json();
        setSubcategories(data?.data || data || []);
      } catch (err) {
        console.error("Subcategory fetch error", err);
      } finally {
        setLoadingSub(false);
      }
    };

    if (categoryId) fetchSubcategories();
  }, [categoryId]);

  const handleSubClick = async (subId) => {
    try {
      setSelectedSubId(subId);
      setLoadingServices(true);
      const res = await fetch(
        `https://insightsconsult-backend.onrender.com/api/subcategories/${subId}/services`
      );
      const data = await res.json();
      setServices(data?.data || data || []);
    } catch (err) {
      console.error("Services fetch error", err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    if (subcategories.length > 0 && !selectedSubId) {
      const firstId = subcategories[0].subCategoryId;
      setSelectedSubId(firstId);
      handleSubClick(firstId);
    }
  }, [subcategories]);

  const [active, setActive] = useState("overview");
  const [tab, setTab] = useState("ALL");
  const [open, setOpen] = useState(null);
  const [index, setIndex] = useState(0);

  const sectionRefs = useRef({});
  const tabsRef = useRef(null);
  const contentContainerRef = useRef(null); // Ref for content container

  const filteredFaq =
    tab === "ALL" ? faqData : faqData.filter((f) => f.category === tab);

  /* ── Fixed: Stop scrolling at the end of content and control sticky ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current || !contentContainerRef.current) return;

      const TAB_HEIGHT = tabsRef.current.offsetHeight;
      const OFFSET = 150;
      
      // Get the last section
      const lastSection = sections[sections.length - 1];
      const lastSectionEl = sectionRefs.current[lastSection.id];
      
      if (!lastSectionEl) return;

      const lastSectionRect = lastSectionEl.getBoundingClientRect();
      const contentContainerRect = contentContainerRef.current.getBoundingClientRect();
      
      // Check if we've reached the end of content
      const isAtEnd = contentContainerRect.bottom <= window.innerHeight;

      // Check if we're within the last section
      const isInLastSection = lastSectionRect.top - TAB_HEIGHT <= OFFSET;

      // Control sticky behavior
      setIsStickyActive(!isAtEnd);

      // Update active section
      if (isInLastSection || isAtEnd) {
        setActive(lastSection.id);
        return;
      }

      let current = sections[0].id;
      sections.forEach((sec) => {
        const el = sectionRefs.current[sec.id];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top - TAB_HEIGHT <= OFFSET) {
          current = sec.id;
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (!el || !tabsRef.current) return;

    const TAB_HEIGHT = tabsRef.current.offsetHeight;
    const top =
      el.getBoundingClientRect().top + window.pageYOffset - TAB_HEIGHT - 2;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get visible cards based on screen size
  const getVisibleCards = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return [testimonials[index]];
    }
    return [
      testimonials[index],
      testimonials[(index + 1) % testimonials.length],
      testimonials[(index + 2) % testimonials.length],
    ];
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="bg-white">
      <section className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>

        <div className="relative px-4 lg:px-12 mx-auto py-20 grid lg:grid-cols-2 xl:grid-cols-3 items-center">
          {/* LEFT CONTENT */}
          <div className="xl:col-span-2 mx-auto">
            <p className="text-sm text-gray-400 mb-4">
              GST SERVICE / GST REGISTRATION & SETUP
            </p>

            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-800 mb-4">
              GST REGISTRATION
            </h1>

            <p className="text-gray-500 max-w-2xl mb-12">
              We help businesses register under GST quickly, accurately, and without
              unnecessary back-and-forth.
            </p>

            <div className="flex flex-col gap-6 items-start">
              <div className='grid-cols-3 gap-2 flex'>
                <div className="bg-gray-200 cols-span-2 rounded-2xl p-6 flex gap-4 items-start">
                  <div className="bg-yellow-500 text-white p-3 rounded-full">
                    <FaStar />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Ongoing Support
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We assist beyond registration with filings, amendments, and
                      renewals.
                    </p>
                  </div>
                </div>
                <div className="flex items-center col-span-1">
                  <div className="text-center">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <h2 className="text-4xl font-semibold text-gray-800">
                        10+ Years
                      </h2>
                      <div className="bg-yellow-500 text-white p-2 rounded-full">
                        <FaArrowUp size={14} />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">
                        GST Compliance Experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-yellow-500 text-white rounded-2xl p-6">
                  <div className="bg-white/20 w-10 h-10 flex items-center justify-center rounded-full mb-3">
                    <FaBoxes />
                  </div>
                  <h3 className="font-semibold mb-1">Who Should Register</h3>
                  <p className="text-sm opacity-90">
                    For businesses required to register under GST as per
                    regulations.
                  </p>
                </div>

                <div className="bg-gray-200 rounded-2xl p-6">
                  <div className="bg-yellow-500 text-white w-10 h-10 flex items-center justify-center rounded-full mb-3">
                    <FaGift />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Turnaround Time
                  </h3>
                  <p className="text-sm text-gray-600">
                    24 Hours fastrack application, subject to document
                    verification.
                  </p>
                </div>
              </div>

              <button className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black transition">
                Explore GST Products
              </button>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="relative xl:col-span-1 mt-8 lg:mt-0">
            <Enquiryform />
          </div>
        </div>
      </section>

      {/* ── SUBCATEGORY SECTION ── */}
      <section className="py-12 px-4 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-semibold tracking-wide">
                RECOMMENDED SERVICES
              </h2>
              <p className="text-gray-500 mt-1">
                From registration to filings and amendments choose the GST service you need.
              </p>
            </div>

            <button className="bg-[#F8F8FF] border-[#DBDBFE] rounded-full px-5 py-3 text-sm hover:bg-white transition">
              View All Products
            </button>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex flex-col lg:flex-row border-[#F1F1F3] border-t border-b py-4 lg:items-center lg:justify-between gap-6 mb-10">
            <div className="flex gap-6 font-medium text-gray-500">
              <button className="text-black border-r px-3 border-[#F1F1F3] pb-2">
                ALL
              </button>

              {subcategories.map((sub) => (
                <button
                  key={sub.subCategoryId}
                  onClick={() => handleSubClick(sub.subCategoryId)}
                  className={`pb-2 transition ${
                    selectedSubId === sub.subCategoryId
                      ? "text-black px-3 border-r border-[#F1F1F3]"
                      : "hover:text-black"
                  }`}
                >
                  {sub.subCategoryName.toUpperCase()}
                </button>
              ))}
            </div>

            {/* PLAN TOGGLE */}
            <div className="flex bg-white p-1 text-sm">
              <button className="px-4 py-1.5 rounded-full bg-black text-white">
                Standard
              </button>
              <button className="px-4 py-1.5 rounded-full text-gray-500">
                Plus
              </button>
              <button className="px-4 py-1.5 rounded-full text-gray-500">
                Support
              </button>
            </div>
          </div>

          {/* SERVICES GRID */}
          {loadingServices ? (
            <p className="text-gray-500">Loading services...</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                 <div
                key={service.serviceId}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={service.photoUrl}
                    alt={service.name}
                    className="w-full h-44  p-3 rounded object-cover rounded-t-xl"
                  />
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Category + Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                      {service.categoryName || "GST SERVICE"}
                    </span>
                    <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded font-bold tracking-wide">
                      STANDARD
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-sm mb-1 leading-snug">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Explore row */}
                  <div className="border-t border-b border-gray-100 flex items-center justify-between py-2.5 mb-3">
                    <span className="text-xs text-gray-400">
                      For More Info of {service.name}?
                    </span>
                    <button className="text-xs font-semibold text-gray-800 flex items-center gap-0.5 hover:text-blue-600 transition-colors">
                      Explore Service
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-red  text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
                      Buy Now
                    </button>
                    <button className="flex-1 border border-red  hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2.5 rounded-lg transition-colors">
                      More Details
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sticky Navigation - Now with conditional sticky class */}
      <div 
        ref={tabsRef} 
        className={`${isStickyActive ? 'sticky top-30' : ''} z-30 bg-white`}
      >
        <div className="px-4 flex justify-between lg:px-12 mx-auto py-12">
          <h2 className="text-4xl font-semibold mb-4">
            GST REGISTRATION — <br />WHAT YOU NEED TO KNOW
          </h2>
          <div>
            <p className="text-lg font-semibold">family time is cherished</p>
            <p className="text-gray-500 max-w-md">
              A complete guide covering overview, required documents, the
              registration process, and common questions.
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-12 mx-auto">
          <div className="flex border-[#EEF3F6] border-10 px-3 rounded-md gap-1 py-2 overflow-x-auto">
            {sections.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => scrollTo(tabItem.id)}
                className={`flex items-center uppercase gap-2 px-5 py-2.5 border-r text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${
                    active === tabItem.id
                      ? ""
                      : "text-[#98989A] hover:bg-gray-100 hover:text-gray-800"
                  }`}
              >
                <span className="text-base">{tabItem.icon}</span>
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div ref={contentContainerRef} className="px-4 lg:px-12 mx-auto py-8">
        {sections.map((sec) => (
          <div
            key={sec.id}
            ref={(el) => (sectionRefs.current[sec.id] = el)}
            className="min-h-[40vh] pt-10 pb-6 scroll-mt-14"
          >
            {sec.id !== "faq" && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">
                <span className="inline-block text-xs font-bold tracking-widest text-yellow-600 uppercase mb-4 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                  {sec.tag}
                </span>

                <h3 className="text-2xl font-semibold text-gray-800 mb-5">
                  {sec.title}
                </h3>

                <div className="w-12 h-1 bg-black rounded mb-6" />

                <p className="text-gray-600 leading-relaxed">{sec.desc1}</p>
                <p className="text-gray-600 leading-relaxed mt-4">{sec.desc2}</p>
              </div>
            )}

            {sec.id === "faq" && (
              <div className="bg-gray-100 rounded-2xl p-8">
                <p className="text-xs text-red-500 font-semibold mb-2">FAQ</p>
                <h3 className="text-2xl font-semibold mb-8">
                  FREQUENTLY ASKED QUESTIONS
                </h3>

                <div className="flex flex-wrap gap-3 mb-8">
                  {faqTabs.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setTab(category);
                        setOpen(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${
                          tab === category
                            ? "bg-yellow-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 items-center gap-4">
                  {filteredFaq.map((item, index) => {
                    const isOpen = open === index;

                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpen(isOpen ? null : index)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center"
                        >
                          <span className="font-medium text-gray-800 pr-8">
                            {item.q}
                          </span>
                          <span className="text-2xl text-gray-500">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 text-gray-600">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="bg-gray-50 py-16 px-4">
        <div className="md:px-12 px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div>
              <p className="text-xs tracking-widest text-gray-400 mb-2">
                TESTIMONIALS
              </p>
              <h2 className="text-4xl font-semibold mb-3">CUSTOMERS LOVE.</h2>
              <p className="text-gray-500 max-w-xl">
                At Klothink, our customers are the heartbeat of our brand. Explore the heartfelt testimonials shared by those who have experienced the magic of Klothink fashion.
              </p>
            </div>

            <button className="bg-red text-white px-6 py-3 rounded-full hover:bg-red-700 transition whitespace-nowrap">
              Get Your GST Now
            </button>
          </div>

          <div className="relative bg-[#FCFCFD] rounded-2xl border border-gray-200 p-8">
            <button
              onClick={prev}
              className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white border rounded-full p-3 shadow hover:bg-gray-100 z-10"
            >
              <FaArrowLeft />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {visibleCards.map((t, i) => (
                  <motion.div
                    key={t.name + i}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl p-6 border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={t.img}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{t.name}</h4>
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                      <FaQuoteRight className="ml-auto text-red-600 text-2xl" />
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={next}
              className="absolute -right-5 top-1/2 -translate-y-1/2 bg-black text-white rounded-full p-3 shadow hover:bg-gray-800 z-10"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ServiceInfoSection;