import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecommendedServices() {
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [sortBy, setSortBy] = useState("Popularity");
  const [search, setSearch] = useState("");

  const sortOptions = ["Popularity", "Price -- Low to High", "Price -- High to Low", "Newest First"];

  /* ───────────────── FETCH CATEGORIES ───────────────── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://insightsconsult-backend.onrender.com/api/categories"
        );
        const cats =
          res.data?.data ||
          res.data?.categories ||
          res.data ||
          [];
        setCategories(Array.isArray(cats) ? cats : []);
        if (Array.isArray(cats) && cats.length > 0) {
          setSelectedCatId(cats[0].categoryId);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCatId) return;
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(
          `https://insightsconsult-backend.onrender.com/api/categories/${selectedCatId}/subcategories`
        );
        const subs =
          res.data?.data ||
          res.data?.subcategories ||
          res.data ||
          [];
        setSubcategories(Array.isArray(subs) ? subs : []);
        if (subs.length > 0) {
          setSelectedSubId(subs[0].subCategoryId);
        }
      } catch (err) {
        console.error("Error fetching subcategories", err);
      }
    };
    fetchSubcategories();
  }, [selectedCatId]);

  /* ───────────────── FETCH SERVICES ───────────────── */
  useEffect(() => {
    if (!selectedSubId) return;
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await axios.get(
          `https://insightsconsult-backend.onrender.com/api/subcategories/${selectedSubId}/services`
        );
        const svcs =
          res.data?.data ||
          res.data?.services ||
          res.data ||
          [];
        setServices(Array.isArray(svcs) ? svcs : []);
      } catch (err) {
        console.error("Error fetching services", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [selectedSubId]);

  const filteredServices = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ───────────────── UI ───────────────── */
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <nav className="flex items-center gap-1  text-gray-400">
          <span className="text-blue-500 cursor-pointer hover:underline">GST Services</span>
          <span className="mx-1">›</span>
          <span className="text-blue-500 cursor-pointer hover:underline">GST Registration &amp; Setu</span>
          <span className="mx-1">›</span>
          <span className="text-blue-600 font-semibold">GST Registration</span>
        </nav>
      </div>

      <div className="bg-white px-6 pt-5 pb-0 border-b border-gray-100">
        {/* ── Page Title ── */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            GST Registration
          </h1>
          <p className=" text-gray-400 mt-0.5">
            Showing 1 – 24 products of 85 products
          </p>
        </div>

        {/* ── Sort Bar ── */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className=" font-semibold text-gray-500 mr-2">Sort By</span>
          {sortOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={` px-0 py-1 mr-4 border-b-2 transition-all font-medium ${
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
                className="bg-transparent  outline-none w-full text-gray-700 placeholder-gray-400"
              />
            </div>
            {/* Filter */}
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5  text-gray-600 hover:bg-gray-50 relative">
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
              Filter
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        {/* <div className="flex items-center gap-6  overflow-x-auto border-t border-gray-100 pt-3 pb-0">
          <span className=" font-bold text-gray-400 whitespace-nowrap">Category</span>
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => setSelectedCatId(cat.categoryId)}
              className={`  whitespace-nowrap font-semibold border-b-2 transition-all ${
                selectedCatId === cat.categoryId
                  ? "text-blue-600 border-blue-500"
                  : "text-gray-500 border-transparent hover:text-gray-800"
              }`}
            >
              {cat.categoryName?.toUpperCase()}
            </button>
          ))}
        </div> */}

        {/* ── Subcategory Tabs ── */}
        <div className="flex items-center gap-6 overflow-x-auto border-t border-gray-100 pt-3 pb-3">
          <span className="font-bold text-gray-400 whitespace-nowrap">Sub Category</span>
          {subcategories.map((sub) => (
            <button
              key={sub.subCategoryId}
              onClick={() => setSelectedSubId(sub.subCategoryId)}
              className={` pb-0 whitespace-nowrap font-semibold border-b-2 transition-all ${
                selectedSubId === sub.subCategoryId
                  ? "text-blue-600 border-blue-500"
                  : "text-gray-500 border-transparent hover:text-gray-800"
              }`}
            >
              {sub.subCategoryName?.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div className="px-6 py-6">
        {loadingServices ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
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

        {!loadingServices && filteredServices.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No services found.</div>
        )}
      </div>
    </div>
  );
}