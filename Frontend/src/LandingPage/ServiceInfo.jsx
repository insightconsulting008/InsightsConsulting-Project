import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaGift, FaBoxes, FaArrowUp } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Enquiryform from "./reusable/Enquiryform";
import { useParams, useLocation } from "react-router-dom";
import ServiceContent from "./ServiceContent";


const ServiceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse flex flex-col">
      <div className="w-full h-44 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded mt-2" />
      </div>
    </div>
  );
};



export const commonServiceHighlights = {




  support: {
    icon: <FaStar />,
    title: "Ongoing Support",
    desc: "We assist beyond registration with filings, amendments, and renewals.",
  },
  experience: {
    years: "10+ Years",
    label: "Compliance Experience",
    icon: <FaArrowUp size={14} />,
  },
  whoShouldRegister: {
    icon: <FaBoxes />,
    title: "Who Should Register",
    desc: "For businesses required to comply under applicable statutory regulations.",
  },
  turnaround: {
    icon: <FaGift />,
    title: "Turnaround Time",
    desc: "24–48 hours fast-track processing, subject to document verification.",
  },
  cta: {
    label: "Explore Our Services",
  },
};

const data = commonServiceHighlights;

/* ── SERVICE CARD CAROUSEL ── */
const ServiceCarousel = ({ services, subCategoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisible = () => {
      setVisibleCount(window.innerWidth < 640 ? 1 : 4);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const total = services.length;
  const maxIndex = Math.max(0, total - visibleCount);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const visibleServices = services.slice(currentIndex, currentIndex + visibleCount);

  // Progress bar:
  // Total track = full width
  // Highlighted portion = visibleCount / total  (visible segment)
  // Position of highlight = currentIndex / total
  const progressWidth = total > 0 ? (visibleCount / total) * 100 : 100;
  const progressLeft = total > 0 ? (currentIndex / total) * 100 : 0;
  const isFullyCovered = total <= visibleCount;

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-300 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-700">
          No services found
        </h3>
        <p className="text-gray-400 text-sm">
          Try selecting another category or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {visibleServices.map((service) => (
          <div
            key={service.serviceId}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
          >
            {/* Image — no padding, full bleed like screenshot */}
            <img
              src={service.photoUrl}
              alt={service.name}
              className="w-full h-70 p-4 rounded-3xl object-cover"
            />

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
              {/* Category label + STANDARD badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  {subCategoryName || "GST SERVICE"}
                </span>
                <span
                  style={{ color: "#B8860B" }}
                  className="text-[9px] bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-bold tracking-widest uppercase"
                >
                  STANDARD
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug">
                {service.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                {service.description}
              </p>

              {/* Need More Info / Explore Service row */}
              <div className="flex items-center justify-between border-t border-b border-gray-100 py-2.5 mb-3">
                <span className="text-gray-400 text-sm">Need More Info?</span>
                <button className="font-semibold text-sm text-gray-800 flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Explore Service
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-red  text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                  Buy Now
                </button>
                <button className="flex-1 bg-[#FAFCFF] border border-[#EAEAEA] text-gray-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
                  More Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PROGRESS BAR + ARROWS ROW ── */}
      <div className="flex items-center justify-between mt-8 gap-6">
        {/* Progress Bar */}
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full relative overflow-hidden">
          {isFullyCovered ? (
            /* All cards visible → full bar highlighted */
            <div className="absolute inset-0 bg-gray-800 rounded-full" />
          ) : (
            /* Partial → show sliding highlight segment */
            <div
              className="absolute top-0 h-full bg-gray-800 rounded-full transition-all duration-300"
              style={{
                left: `${progressLeft}%`,
                width: `${progressWidth}%`,
              }}
            />
          )}
        </div>

        {/* Arrow Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};


const ServiceInfoSection = () => {
  const { categoryId, subCategoryId } = useParams();
  const location = useLocation();

  const categoryName = location.state?.categoryName;
  const subCategoryName = location.state?.subCategoryName;

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

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
    if (subcategories.length > 0) {
      const idToSelect = subCategoryId || subcategories[0].subCategoryId;
      setSelectedSubId(idToSelect);
      handleSubClick(idToSelect);
    }
  }, [subcategories, subCategoryId]);

  return (
    <section className="bg-white">
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>

        <div className="relative px-4 lg:px-12 mx-auto py-20 grid lg:grid-cols-2 gap-15 xl:grid-cols-3 items-center">
          {/* LEFT CONTENT */}
          <div className="xl:col-span-2 mx-auto">
            <p className="text-sm text-gray-400 mb-4">
              {categoryName?.toUpperCase()}
            </p>

            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-800 mb-4">
              {subCategoryName?.toUpperCase()}
            </h1>

            <p className="text-gray-500 max-w-2xl mb-12">
              We help businesses register under {subCategoryName} quickly, accurately, and without
              unnecessary back-and-forth.
            </p>

            <div className="flex flex-col gap-6 items-start">
              {/* Top Row */}
              <div className="grid grid-cols-3 justify-baseline w-full">
                <div className="bg-gray-200 col-span-2 rounded-2xl p-6 flex gap-4 items-start">
                  <div className="bg-yellow-500 text-white p-3 rounded-full">
                    {data.support.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{data.support.title}</h3>
                    <p className="text-gray-600 text-sm">{data.support.desc}</p>
                  </div>
                </div>

                <div className="flex items-center col-span-1 justify-end">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <h2 className="text-4xl font-semibold text-gray-800">
                        {data.experience.years}
                      </h2>
                      <div className="bg-yellow-500 text-white p-2 rounded-full">
                        {data.experience.icon}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">{data.experience.label}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Cards */}
              <div className="grid sm:grid-cols-2 gap-6 w-full">
                <div className="bg-yellow-500 text-white rounded-2xl p-6">
                  <div className="bg-white/20 w-10 h-10 flex items-center justify-center rounded-full mb-3">
                    {data.whoShouldRegister.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{data.whoShouldRegister.title}</h3>
                  <p className="text-sm opacity-90">{data.whoShouldRegister.desc}</p>
                </div>

                <div className="bg-gray-200 rounded-2xl p-6">
                  <div className="bg-yellow-500 text-white w-10 h-10 flex items-center justify-center rounded-full mb-3">
                    {data.turnaround.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{data.turnaround.title}</h3>
                  <p className="text-sm text-gray-600">{data.turnaround.desc}</p>
                </div>
              </div>

              {/* CTA */}
              <button className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black transition">
                {data.cta.label}
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
      <section className="py-12">
        <div className="px-4 lg:px-12 container mx-auto">
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

            <button className="bg-[#F8F8FF] border-[#DBDBFE] rounded-full px-5 py-3 text-sm transition">
              View All Products
            </button>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex flex-col lg:flex-row border-[#F1F1F3] border-t border-b py-4 lg:items-center lg:justify-between gap-6 mb-10">
            <div className="flex gap-6 font-medium text-gray-500 overflow-x-auto">
              <button className="text-black border-r px-3 border-[#F1F1F3] pb-2 whitespace-nowrap">
                ALL
              </button>

              {subcategories.map((sub) => (
                <button
                  key={sub.subCategoryId}
                  onClick={() => handleSubClick(sub.subCategoryId)}
                  className={`pb-2 transition whitespace-nowrap ${selectedSubId === sub.subCategoryId
                      ? "text-black px-3 border-r border-[#F1F1F3]"
                      : "hover:text-black"
                    }`}
                >
                  {sub.subCategoryName.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SERVICES CAROUSEL */}
          {loadingServices ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ServiceCarousel
              services={services}
              subCategoryName={subCategoryName}
            />
          )}
        </div>
      </section>

      <ServiceContent />
    </section>
  );
};

export default ServiceInfoSection;