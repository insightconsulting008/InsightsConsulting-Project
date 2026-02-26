import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Phone, FileText, ChevronRight, Menu, X, ChevronUp } from "lucide-react";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [openServices, setOpenServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);

  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const navLinkClass = "hover:text-red-500 transition-colors duration-200";
  const activeClass = "text-red-500 font-semibold";

  const isServicesActive = location.pathname.startsWith("/services");

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://insightsconsult-backend.onrender.com/api/categories"
        );
        setCategories(res.data?.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);

  /* ================= FETCH SUBCATEGORIES ================= */
  const fetchSubcategories = async (catId) => {
    if (activeCat === catId) {
      // If clicking the same category, just toggle expansion
      setExpandedCategory(expandedCategory === catId ? null : catId);
      return;
    }

    setActiveCat(catId);
    setActiveSub(null);
    setServices([]);
    setLoadingSub(true);
    setExpandedCategory(catId);

    try {
      const res = await axios.get(
        `https://insightsconsult-backend.onrender.com/api/categories/${catId}/subcategories`
      );
      setSubcategories(res.data?.data || []);
    } catch (err) {
      console.log(err);
      setSubcategories([]);
    } finally {
      setLoadingSub(false);
    }
  };

  /* ================= FETCH SERVICES ================= */
  const fetchServices = async (subId) => {
    if (activeSub === subId) return;

    setActiveSub(subId);
    setLoadingServices(true);

    try {
      const res = await axios.get(
        `https://insightsconsult-backend.onrender.com/api/subcategories/${subId}/services`
      );
      setServices(res.data?.data || []);
    } catch (err) {
      console.log(err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  /* ================= SELECT SUBCATEGORY ================= */
  const handleSelectSub = (sub) => {
    navigate(`/services/${activeCat}/${sub.subCategoryId}`, {
      state: {
        categoryName:
          categories.find((c) => c.categoryId === activeCat)?.categoryName,
        subCategoryName: sub.subCategoryName,
      },
    });

    setOpenServices(false);
    setMobileMenuOpen(false);
    setExpandedCategory(null);
    setActiveCat(null);
    setActiveSub(null);
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpenServices(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="w-full shadow-sm sticky top-0 z-40">
      {/* TOP BAR */}
      <div className="bg-black text-white text-sm py-2 px-4 flex items-center justify-center gap-2 text-center flex-wrap">
        <span>
          Looking For The Right{" "}
          <span className="text-yellow font-medium">
            Compliance & Registration Services
          </span>{" "}
          | Get A Quick Guidance From Our Team →
        </span>

        <button className="ml-3 bg-red text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
          Enquire Now
        </button>
      </div>

      {/* MAIN NAV */}
      <div className="bg-white px-4 lg:px-12 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/home" className="flex items-center gap-2">
          <img
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png"
            className="h-10 md:h-14"
            alt="Insights Consultancy"
          />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
          <NavLink to="/" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Home
          </NavLink>

          {/* SERVICES */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenServices(!openServices)}
              className={`flex items-center gap-1 ${navLinkClass} ${isServicesActive ? activeClass : ""}`}
            >
              Service We Provide <ChevronDown size={16} />
            </button>

            {openServices && (
              <div className="absolute -left-57 top-full mt-6 w-[900px] bg-white shadow-xl border rounded-xl p-8 grid grid-cols-3 gap-10">
                
                {/* CATEGORIES */}
                <div>
                  <h4 className="text-xs text-gray-400 mb-4 uppercase">Categories</h4>
                  {loadingCat ? (
                    <p className="text-gray-400 text-sm">Loading...</p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div
                          key={cat.categoryId}
                          onMouseEnter={() => fetchSubcategories(cat.categoryId)}
                          className={`flex justify-between items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                            activeCat === cat.categoryId ? "bg-gray-100" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex gap-3">
                            <FileText size={18} className="text-gray-500 mt-1" />
                            <p className="font-medium text-gray-800">{cat.categoryName}</p>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SUBCATEGORIES */}
                <div>
                  <h4 className="text-xs text-gray-400 mb-4 uppercase">Subcategories</h4>

                  {loadingSub && <p className="text-gray-400 text-sm">Loading...</p>}

                  {!loadingSub && subcategories.length > 0 && (
                    <div className="space-y-2">
                      {subcategories.map((sub) => (
                        <div
                          key={sub.subCategoryId}
                          onMouseEnter={() => fetchServices(sub.subCategoryId)}
                          onClick={() => handleSelectSub(sub)}
                          className={`flex justify-between items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                            activeSub === sub.subCategoryId ? "bg-gray-100" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex gap-3">
                            <FileText size={18} className="text-gray-500 mt-1" />
                            <p className="font-medium">{sub.subCategoryName}</p>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingSub && activeCat && subcategories.length === 0 && (
                    <p className="text-gray-400 text-sm">No subcategories</p>
                  )}
                </div>

                {/* SERVICES */}
                <div>
                  <h4 className="text-xs text-gray-400 mb-4 uppercase">Services</h4>

                  {loadingServices && <p className="text-gray-400 text-sm">Loading...</p>}

                  {!loadingServices && services.length > 0 && (
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div
                          key={service.serviceId}
                          className="flex gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <img
                            src={service.photoUrl}
                            alt={service.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{service.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingServices && activeSub && services.length === 0 && (
                    <p className="text-gray-400 text-sm">No services found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/servicehub" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Service Hub
          </NavLink>

          <NavLink to="/resource" className={({ isActive }) => `${navLinkClass} flex items-center gap-1 ${isActive ? activeClass : ""}`}>
            Resources <ChevronDown size={16} />
          </NavLink>

          <NavLink to="/company" className={({ isActive }) => `${navLinkClass} flex items-center gap-1 ${isActive ? activeClass : ""}`}>
            Company <ChevronDown size={16} />
          </NavLink>

          <NavLink to="/contact" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Contact
          </NavLink>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 border rounded-lg px-3 py-2 text-gray-700">
            <Phone size={18} />
            <span className="font-medium">+91 98578474975</span>
          </div>

          <Link to="/login">
            <button className="bg-red text-white px-5 py-2 rounded-lg font-medium">
              Login →
            </button>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE SIDE NAV */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Side Navigation */}
          <div 
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Menu</h2>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="overflow-y-auto h-[calc(100vh-140px)]">
              <div className="p-4 space-y-2">
                {/* Home Link */}
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `block p-3 rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-red-50 text-red-500' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>

                {/* Services Section with Categories */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 font-medium">
                    Service We Provide
                  </div>
                  
                  {/* Categories List */}
                  <div className="divide-y">
                    {loadingCat ? (
                      <div className="p-4 text-center text-gray-400">Loading categories...</div>
                    ) : (
                      categories.map((cat) => (
                        <div key={cat.categoryId} className="border-b last:border-b-0">
                          {/* Category Button */}
                          <button
                            onClick={() => fetchSubcategories(cat.categoryId)}
                            className="flex items-center justify-between w-full p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={18} className="text-gray-500" />
                              <span className="font-medium">{cat.categoryName}</span>
                            </div>
                            {expandedCategory === cat.categoryId ? (
                              <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-400" />
                            )}
                          </button>

                          {/* Subcategories (shown when category is expanded) */}
                          {expandedCategory === cat.categoryId && (
                            <div className="bg-gray-50 pl-11 pr-3 py-2 space-y-1">
                              {loadingSub && activeCat === cat.categoryId ? (
                                <div className="py-2 text-sm text-gray-400">Loading subcategories...</div>
                              ) : subcategories.length > 0 ? (
                                subcategories.map((sub) => (
                                  <button
                                    key={sub.subCategoryId}
                                    onClick={() => handleSelectSub(sub)}
                                    className="w-full text-left p-2 text-sm hover:text-red-500 hover:bg-white rounded transition-colors"
                                  >
                                    {sub.subCategoryName}
                                  </button>
                                ))
                              ) : (
                                <div className="py-2 text-sm text-gray-400">No subcategories available</div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Other Navigation Links */}
                <NavLink 
                  to="/servicehub" 
                  className={({ isActive }) => 
                    `block p-3 rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-red-50 text-red-500' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Service Hub
                </NavLink>

                <NavLink 
                  to="/resource" 
                  className={({ isActive }) => 
                    `block p-3 rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-red-50 text-red-500' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resources
                </NavLink>

                <NavLink 
                  to="/company" 
                  className={({ isActive }) => 
                    `block p-3 rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-red-50 text-red-500' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Company
                </NavLink>

                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => 
                    `block p-3 rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-red-50 text-red-500' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </NavLink>

                {/* Mobile Contact Info */}
                <div className="pt-4 mt-4 border-t">
                  <div className="flex items-center gap-2 p-3 text-gray-700">
                    <Phone size={18} />
                    <span className="font-medium">+91 98578474975</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Login Button for Mobile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-red text-white px-5 py-3 rounded-lg font-medium">
                  Login →
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}