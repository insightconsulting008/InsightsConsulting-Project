import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const LIMIT = 10;

/* ───────────────── SKELETON CARD ───────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-44 bg-gray-200 rounded-t-xl" />
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category + badge row */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        {/* Description lines */}
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
        </div>
        {/* Divider row */}
        <div className="border-t border-b border-gray-100 py-2.5 flex items-center justify-between">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-28 bg-gray-100 rounded" />
        </div>
        {/* Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-10 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ───────────────── NO DATA STATE ───────────────── */
function NoData({ search }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Illustration */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#F3F4F6" />
        <rect x="22" y="26" width="36" height="28" rx="4" fill="#E5E7EB" />
        <rect x="28" y="32" width="14" height="3" rx="1.5" fill="#D1D5DB" />
        <rect x="28" y="38" width="24" height="3" rx="1.5" fill="#D1D5DB" />
        <rect x="28" y="44" width="18" height="3" rx="1.5" fill="#D1D5DB" />
        <circle cx="54" cy="54" r="10" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
        <path d="M50 54h8M54 50v8" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <div className="text-center">
        <p className="text-gray-700 font-semibold text-base">
          {search ? `No results for "${search}"` : "No services available"}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {search
            ? "Try a different search term or browse another category."
            : "There are no services in this subcategory yet. Please check back later."}
        </p>
      </div>
    </div>
  );
}

export default function RecommendedServices() {
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [totalServices, setTotalServices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("Popularity");
  const [search, setSearch] = useState("");

  // Category panel state
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [panelCatId, setPanelCatId] = useState(null);
  const [panelSubcategories, setPanelSubcategories] = useState([]);
  const [loadingPanelSubs, setLoadingPanelSubs] = useState(false);
  const panelRef = useRef(null);

  // Server-side pagination
  const [currentPage, setCurrentPage] = useState(1);

  const sortOptions = ["Popularity", "Price -- Low to High", "Price -- High to Low", "Newest First"];

  /* ───────────────── FETCH CATEGORIES ───────────────── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://insightsconsult-backend.onrender.com/api/categories"
        );
        const cats = res.data?.data || res.data?.categories || res.data || [];
        setCategories(Array.isArray(cats) ? cats : []);
        if (Array.isArray(cats) && cats.length > 0) {
          setSelectedCatId(cats[0].categoryId);
          setPanelCatId(cats[0].categoryId);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  /* ───────────────── FETCH SUBCATEGORIES ───────────────── */
  useEffect(() => {
    if (!selectedCatId) return;
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(
          `https://insightsconsult-backend.onrender.com/api/categories/${selectedCatId}/subcategories`
        );
        const subs = res.data?.data || res.data?.subcategories || res.data || [];
        setSubcategories(Array.isArray(subs) ? subs : []);
        if (subs.length > 0) {
          setSelectedSubId(subs[0].subCategoryId);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Error fetching subcategories", err);
      }
    };
    fetchSubcategories();
  }, [selectedCatId]);

  /* ───────────────── FETCH PANEL SUBCATEGORIES ───────────────── */
  useEffect(() => {
    if (!panelCatId) return;
    const fetchPanelSubs = async () => {
      setLoadingPanelSubs(true);
      try {
        const res = await axios.get(
          `https://insightsconsult-backend.onrender.com/api/categories/${panelCatId}/subcategories`
        );
        const subs = res.data?.data || res.data?.subcategories || res.data || [];
        setPanelSubcategories(Array.isArray(subs) ? subs : []);
      } catch (err) {
        console.error("Error fetching panel subcategories", err);
      } finally {
        setLoadingPanelSubs(false);
      }
    };
    fetchPanelSubs();
  }, [panelCatId]);

  /* ───────────────── FETCH SERVICES ───────────────── */
  useEffect(() => {
    if (!selectedSubId) return;

    let cancelled = false;

    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await axios.get(
          `https://insightsconsult-backend.onrender.com/api/subcategories/${selectedSubId}/services`,
          { params: { page: currentPage, limit: LIMIT } }
        );
        if (cancelled) return;

        const svcs = res.data?.data || res.data?.services || [];
        setServices(Array.isArray(svcs) ? svcs : []);
        setTotalServices(res.data?.total ?? 0);
        setTotalPages(res.data?.totalPages ?? 1);
      } catch (err) {
        if (!cancelled) console.error("Error fetching services", err);
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    };

    fetchServices();

    return () => { cancelled = true; };
  }, [selectedSubId, currentPage]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowCategoryPanel(false);
      }
    };
    if (showCategoryPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategoryPanel]);

  const handleSubcategorySelect = (subId) => {
    setSelectedCatId(panelCatId);
    setSelectedSubId(subId);
    setCurrentPage(1);
    setShowCategoryPanel(false);
  };

  const displayedServices = services
    .filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "Price -- Low to High") {
        return (Number(a.finalIndividualPrice) || 0) - (Number(b.finalIndividualPrice) || 0);
      }
      if (sortBy === "Price -- High to Low") {
        return (Number(b.finalIndividualPrice) || 0) - (Number(a.finalIndividualPrice) || 0);
      }
      if (sortBy === "Newest First") {
        // serviceId is a cuid — lexicographic sort gives newest last, so reverse it
        return b.serviceId?.localeCompare(a.serviceId) || 0;
      }
      // Popularity — keep original API order
      return 0;
    });

  const selectedCat = categories.find((c) => c.categoryId === selectedCatId);
  const selectedSub = subcategories.find((s) => s.subCategoryId === selectedSubId);

  /* ───────────────── PAGINATION ───────────────── */
  const renderPageNumbers = () => {
    const pages = [];

    const addPage = (n) =>
      pages.push(
        <button
          key={n}
          onClick={() => setCurrentPage(n)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
            currentPage === n
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {n}
        </button>
      );

    const addDots = (key) =>
      pages.push(
        <span key={key} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
          ...
        </span>
      );

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      addPage(2);
      addPage(3);
      if (currentPage > 5) addDots("dots1");
      if (currentPage > 4 && currentPage < totalPages - 3) {
        addPage(currentPage - 1);
        addPage(currentPage);
        addPage(currentPage + 1);
      }
      if (currentPage < totalPages - 4) addDots("dots2");
      addPage(totalPages - 2);
      addPage(totalPages - 1);
      addPage(totalPages);
    }

    return pages;
  };

  /* ───────────────── UI ───────────────── */
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <nav className="flex items-center gap-1 text-gray-400 text-sm">
          <span className="text-blue-500 cursor-pointer hover:underline">Home</span>
          {selectedCat && (
            <>
              <span className="mx-1">›</span>
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  setSelectedCatId(selectedCat.categoryId);
                  setPanelCatId(selectedCat.categoryId);
                }}
              >
                {selectedCat.categoryName}
              </span>
            </>
          )}
          {selectedSub && (
            <>
              <span className="mx-1">›</span>
              <span className="text-blue-600 font-semibold">{selectedSub.subCategoryName}</span>
            </>
          )}
        </nav>
      </div>

      <div className="bg-white px-6 pt-5 pb-0 border-b border-gray-100">
        {/* ── Page Title ── */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {selectedSub?.subCategoryName || selectedCat?.categoryName || "GST Registration"}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loadingServices ? (
              <span className="inline-block w-24 h-3 bg-gray-200 rounded animate-pulse" />
            ) : (
              `Showing ${totalServices} services`
            )}
          </p>
        </div>

        {/* ── Sort Bar ── */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-500 mr-2">Sort By</span>
          {sortOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`text-sm px-0 py-1 mr-4 border-b-2 transition-all font-medium ${
                sortBy === opt
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {opt}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 gap-2 w-52">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={panelRef}>
              <button
                onClick={() => setShowCategoryPanel((v) => !v)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 relative"
              >
                
                Filter
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4" />
                </svg>
              </button>

              {/* ── Category Panel Dropdown ── */}
              {showCategoryPanel && (
                <div
                  className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-[480px] flex overflow-hidden"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                >
                  {/* Left: Categories */}
                  <div className="w-48 bg-gray-50 border-r border-gray-100 py-2 overflow-y-auto max-h-80">
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Categories
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat.categoryId}
                        onClick={() => setPanelCatId(cat.categoryId)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                          panelCatId === cat.categoryId
                            ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="truncate">{cat.categoryName}</span>
                        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Right: Subcategories */}
                  <div className="flex-1 py-2 overflow-y-auto max-h-80">
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Sub Categories
                    </div>
                    {loadingPanelSubs ? (
                      <div className="flex items-center justify-center h-20">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : panelSubcategories.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-400">No subcategories</div>
                    ) : (
                      panelSubcategories.map((sub) => (
                        <button
                          key={sub.subCategoryId}
                          onClick={() => handleSubcategorySelect(sub.subCategoryId)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            selectedSubId === sub.subCategoryId
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {sub.subCategoryName}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div className="px-6 py-6">
        {loadingServices ? (
          /* ── SKELETON GRID ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayedServices.length === 0 ? (
          /* ── NO DATA STATE ── */
          <NoData search={search} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayedServices.map((service) => (
                <div
                  key={service.serviceId}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={service.photoUrl}
                      alt={service.name}
                      className="w-full h-44 p-3 rounded object-cover rounded-t-xl"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                        {service.categoryName || "GST SERVICE"}
                      </span>
                      <span
                        style={{ color: "#B8860B" }}
                        className="text-[9px] bg-amber-50 border border-yellow px-2 py-0.5 rounded font-bold tracking-widest uppercase"
                      >
                        STANDARD
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug">
                      {service.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
                      {service.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      {service.offerPrice && (
                        <span className="text-base font-bold text-gray-900">
                          ₹{Number(service.offerPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                      {service.finalIndividualPrice && (
                        <span className={`text-sm ${service.offerPrice ? "line-through text-gray-400" : "font-bold text-gray-900"}`}>
                          ₹{Number(service.finalIndividualPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                      {service.offerPrice && service.finalIndividualPrice && (
                        <span className="text-[10px] bg-green-50 text-green-600 font-semibold px-1.5 py-0.5 rounded">
                          {Math.round((1 - Number(service.offerPrice) / Number(service.finalIndividualPrice)) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-b border-gray-100 py-2.5 mb-3">
                      <span className="text-gray-400 text-sm">Need More Info?</span>
                      <button className="font-semibold text-sm text-gray-800 flex items-center gap-1 hover:text-blue-600 transition-colors">
                        Explore Service
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M7 7h10v10" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-red text-white text-sm font-semibold py-2.5 rounded-lg transition-colors hover:bg-red-600">
                        Buy Now
                      </button>
                      <button className="flex-1 bg-[#FAFCFF] border border-[#EAEAEA]  text-red text-sm font-semibold py-2.5 rounded-lg transition-colors">
                        More Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between mt-8 px-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex bg-[#F9F5FF] items-center gap-1">
                  {renderPageNumbers()}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}