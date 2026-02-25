
import React, { useState, useRef, useEffect } from "react";
import {
  FaInfoCircle,
  FaFileAlt,
  FaListOl,
  FaQuestionCircle,
} from "react-icons/fa";
import { FaStar, FaArrowLeft, FaArrowRight, FaQuoteRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ServiceContent = () => {
  const [isStickyActive, setIsStickyActive] = useState(true);

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaInfoCircle />,
      tag: "Overview",

      items: [
        {
          title: "Business Registration & GST",
          desc1:
            "Business registration and GST registration are essential compliance steps for operating legally and building credibility.",
          desc2:
            "GST registration enables businesses to collect tax, claim input tax credits, and participate seamlessly in the formal economy.",
        },
        {
          title: "Book Keeping",
          desc1:
            "Book keeping ensures accurate tracking of financial transactions, income, and expenses for better financial clarity.",
          desc2:
            "Well-maintained records support tax filings, audits, funding opportunities, and strategic decision-making.",
        },
        {
          title: "GST Filing",
          desc1:
            "GST filing is a mandatory compliance requirement ensuring uninterrupted tax credit benefits and regulatory safety.",
          desc2:
            "Accurate filings reduce penalties, improve transparency, and ensure smooth business operations.",
        },
        {
          title: "TDS Payment",
          desc1:
            "Tax Deducted at Source (TDS) is a statutory compliance mechanism applicable to specified financial transactions.",
          desc2:
            "Timely deduction and payment prevent penalties, interest liabilities, and compliance risks.",
        },
      ],
    },

    {
      id: "documents",
      label: "Documents Required",
      icon: <FaFileAlt />,
      tag: "Documents Required",

      items: [
        {
          title: "Business Registration & GST",
          desc1:
            "PAN, Aadhaar, address proof, bank details, and business information are typically required.",
          desc2:
            "Additional documents vary depending on business structure and operational model.",
        },
        {
          title: "Book Keeping",
          desc1:
            "Bank statements, invoices, expense records, payroll data, and GST credentials are needed.",
          desc2:
            "Operational data like assets, suppliers, and customers may also be required.",
        },
        {
          title: "GST Filing",
          desc1:
            "Sales invoices, purchase bills, GST certificate, and bank statements are commonly required.",
          desc2:
            "HSN/SAC codes and adjustments may apply based on business activity.",
        },
        {
          title: "TDS Payment",
          desc1:
            "Payment records, deductee details, PAN information, and transaction data are required.",
          desc2:
            "Accurate documentation ensures proper deduction and reporting.",
        },
      ],
    },

    {
      id: "process",
      label: "Registration Process",
      icon: <FaListOl />,
      tag: "Process",

      items: [
        {
          title: "Business Registration & GST",
          desc1:
            "The process involves preparing documents, submitting applications, and completing verification.",
          desc2:
            "Accurate filings significantly reduce approval delays and rejections.",
        },
        {
          title: "Book Keeping",
          desc1:
            "Financial data is collected, categorized, reconciled, and maintained in structured ledgers.",
          desc2:
            "Regular updates ensure compliance and reporting readiness.",
        },
        {
          title: "GST Filing",
          desc1:
            "Data reconciliation, tax computation, return preparation, and portal submission are involved.",
          desc2:
            "Consistent compliance prevents penalties and credit mismatches.",
        },
        {
          title: "TDS Payment",
          desc1:
            "TDS applicability is evaluated, tax is deducted, challans generated, and payments remitted.",
          desc2:
            "Timely filings ensure full regulatory compliance.",
        },
      ],
    },

    {
      id: "faq",
      label: "FAQ",
      icon: <FaQuestionCircle />,
      tag: "FAQ",
      title: "Frequently Asked Questions",
    },
  ];

  const tabs = [
    "ALL",
    "GST REGISTRATION",
    "BOOK KEEPING",
    "GST FILING",
    "TDS PAYMENT",
  ];

  const faqData = [
    // GST REGISTRATION
    {
      service: "GST REGISTRATION",
      q: "Who is required to obtain GST registration?",
      a: "Businesses exceeding prescribed turnover thresholds or engaged in specific taxable activities must obtain GST registration.",
    },
    {
      service: "GST REGISTRATION",
      q: "What documents are required for GST registration?",
      a: "PAN, Aadhaar, address proof, bank details, and entity-specific documents are typically required.",
    },
    {
      service: "GST REGISTRATION",
      q: "How long does GST registration take?",
      a: "Most applications are processed within a few working days, subject to verification.",
    },

    // BOOK KEEPING
    {
      service: "BOOK KEEPING",
      q: "Why is book keeping important for businesses?",
      a: "Proper records ensure financial clarity, compliance readiness, and smoother tax filings.",
    },
    {
      service: "BOOK KEEPING",
      q: "What records are required for book keeping?",
      a: "Invoices, expense records, bank statements, payroll data, and tax documents.",
    },

    // GST FILING
    {
      service: "GST FILING",
      q: "Is GST return filing mandatory?",
      a: "Yes. All registered taxpayers must file GST returns within prescribed timelines.",
    },
    {
      service: "GST FILING",
      q: "What happens if GST returns are delayed?",
      a: "Delayed filings may result in penalties, interest, and late fees.",
    },

    // TDS PAYMENT
    {
      service: "TDS PAYMENT",
      q: "What is TDS?",
      a: "Tax Deducted at Source (TDS) is a mechanism where tax is deducted at the time of payment.",
    },
    {
      service: "TDS PAYMENT",
      q: "What are risks of delayed TDS payment?",
      a: "Delayed payments may attract penalties and interest liabilities.",
    },
  ];

  const testimonials = [
    {
      name: "Arun Kumar",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "The GST registration process was handled smoothly and professionally. Everything was completed faster than expected.",
    },
    {
      name: "Priya Sharma",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Excellent support and clear guidance throughout the compliance process. Highly reliable service.",
    },
    {
      name: "Rahul Mehta",
      img: "https://randomuser.me/api/portraits/men/75.jpg",
      text: "Very responsive team. They simplified what initially felt like a complicated registration process.",
    },
    {
      name: "Sneha Iyer",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Professional service with great attention to detail. The entire experience was stress-free.",
    },
  ];

  const [active, setActive] = useState("overview");
  const [tab, setTab] = useState("ALL");
  const [open, setOpen] = useState(null);
  const [index, setIndex] = useState(0);

  const sectionRefs = useRef({});
  const tabsRef = useRef(null);
  const contentContainerRef = useRef(null);

  const filteredFaq =
    tab === "ALL"
      ? faqData
      : faqData.filter((f) => f.service === tab);

  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current || !contentContainerRef.current) return;

      const TAB_HEIGHT = tabsRef.current.offsetHeight;
      const OFFSET = 150;

      const lastSection = sections[sections.length - 1];
      const lastSectionEl = sectionRefs.current[lastSection.id];

      if (!lastSectionEl) return;

      const lastSectionRect = lastSectionEl.getBoundingClientRect();
      const contentContainerRect =
        contentContainerRef.current.getBoundingClientRect();

      const isAtEnd = contentContainerRect.bottom <= window.innerHeight;
      const isInLastSection =
        lastSectionRect.top - TAB_HEIGHT <= OFFSET;

      setIsStickyActive(!isAtEnd);

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
      el.getBoundingClientRect().top +
      window.pageYOffset -
      TAB_HEIGHT -
      2;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleCards = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
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
    <div>
      {/* Sticky Navigation - Now with conditional sticky class */}
      <div
        ref={tabsRef}
       className={`${isStickyActive ? 'md:sticky md:top-25' : ''} z-30 bg-white`}
      >
        <div className="px-4 flex lg:flex-row flex-col justify-between lg:px-12 mx-auto py-4  pt-12    lg:pb-5">
          <h2 className="text-2xl lg:text-4xl font-semibold mb-2 lg:mb-4">
            PROFESSIONAL BUSINESS SERVICES  <br />
            EVERYTHING YOU NEED TO KNOW
          </h2>

          <div>
            <p className="lg:text-lg font-semibold">
              Simplifying Compliance & Financial Processes
            </p>

            <p className="text-gray-500 max-w-md">
              Explore detailed insights into our services, including key benefits,
              documentation requirements, processes, and frequently asked questions —
              designed to help you make informed decisions with confidence.
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-12 mx-auto">
          <div className="flex flex-wrap md:flex-nowrap border-[#EEF3F6] md:border-20 border-14 px- rounded-2xl gap-2 py-2 md:overflow-x-auto">
            {sections.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => scrollTo(tabItem.id)}
                className={`flex items-center uppercase gap-2 px-2  md:px-5 py-2.5 border-r text-xs md:text-sm md:font-medium whitespace-nowrap transition-all duration-200
                  ${active === tabItem.id
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
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 lg:p-8 shadow-sm">

                <span className="inline-block text-xs font-bold tracking-widest text-yellow uppercase mb-6 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                  {sec.tag}
                </span>

                <div className="grid md:grid-cols-2 gap-6">
                  {sec.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-3 lg:p-6 border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {item.title}
                      </h3>

                      <div className="w-10 h-1 bg-black rounded mb-4" />

                      <p className="text-gray-600 leading-relaxed">
                        {item.desc1}
                      </p>

                      <p className="text-gray-600 leading-relaxed mt-3">
                        {item.desc2}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sec.id === "faq" && (
              <div className="bg-gray-100  rounded-2xl p-3 lg:p-8">
                <p className="text-xs text-red-500 font-semibold mb-2">FAQ</p>
                <h3 className="text-2xl font-semibold mb-8">
                  FREQUENTLY ASKED QUESTIONS
                </h3>

                <div className="flex flex-wrap gap-3 mb-8">
                  {tabs.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setTab(category);
                        setOpen(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${tab === category
                          ? "bg-yellow text-white"
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

      <section className="bg-gray-50 py-16 ">
        <div className="md:px-12 px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div>
              <p className="text-xs tracking-widest text-gray-400 mb-2">
                TESTIMONIALS
              </p>
              <h2 className="text-4xl font-semibold mb-3">
                WHAT OUR CLIENTS SAY.
              </h2>
              <p className="text-gray-500 max-w-xl">
                Businesses across industries trust our expertise for registrations,
                compliance, and financial processes. Here’s what our clients say about
                working with us.
              </p>
            </div>

            <button className="bg-red text-white px-6 py-3 rounded-full hover:bg-red-700 transition whitespace-nowrap">
              Get Started Today
            </button>
          </div>

          <div className="relative bg-[#FCFCFD] rounded-2xl border border-gray-200 p-3 lg:p-8">
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
                    className="bg-white rounded-xl p-3 lg:p-6 border border-gray-200"
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
    </div>
  )
}

export default ServiceContent