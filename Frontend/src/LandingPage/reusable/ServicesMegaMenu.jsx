import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";



export default function ServicesMegaMenu() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);

  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  /* =========================
     🔹 FETCH CATEGORIES
  ========================== */
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

  /* =========================
     🔹 FETCH SUBCATEGORIES
  ========================== */
  const fetchSubcategories = async (catId) => {
    if (activeCat === catId) return;

    setActiveCat(catId);
    setActiveSub(null);
    setServices([]);
    setLoadingSub(true);

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

  /* =========================
     🔹 FETCH SERVICES
  ========================== */
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

  return (
    <div className="absolute -left-57 top-full mt-6 w-[600px] bg-white shadow-xl border rounded-xl p-8 grid grid-cols-2 gap-10">

   
      <div className="w-full  ">
        <h4 className="text-xs tracking-wider text-gray-400 mb-4 uppercase">
          Categories
        </h4>

        {loadingCat ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                onMouseEnter={() => fetchSubcategories(cat.categoryId)}
                // ✅ redirect
                className={`flex justify-between items-center gap-3 p-2 rounded-md cursor-pointer transition ${activeCat === cat.categoryId
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex gap-3">
                  <FileText size={18} className="text-gray-500 mt-1" />
                  <p className="font-medium text-gray-800">
                    {cat.categoryName}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SUBCATEGORIES ================= */}
      <div className="w-full">
        <h4 className="text-xs tracking-wider text-gray-400 mb-4 uppercase">
          Subcategories
        </h4>

        {loadingSub && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loadingSub && subcategories.length > 0 && (
          <div className="space-y-2">
            {subcategories.map((sub) => (
              <div
                key={sub.subCategoryId}
                onMouseEnter={() => fetchServices(sub.subCategoryId)}
                onClick={() =>
                  navigate(`/services/${activeCat}/${sub.subCategoryId}`, {
                    state: {
                      categoryName: categories.find(c => c.categoryId === activeCat)?.categoryName,
                      subCategoryName: sub.subCategoryName,
                    },
                  })
                }
                className={`flex justify-between items-center gap-3 p-2 rounded-md cursor-pointer transition ${activeSub === sub.subCategoryId
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex gap-3">
                  <FileText size={18} className="text-gray-500 mt-1" />
                  <p className="font-medium text-yellow">
                    {sub.subCategoryName}
                  </p>
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

      {/* ================= SERVICES ================= */}
      {/* <div>
        <h4 className="text-xs tracking-wider text-gray-400 mb-4 uppercase">
          Services
        </h4>

        {loadingServices && (
          <p className="text-gray-400 text-sm">Loading...</p>
        )}

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
                  <p className="font-medium text-gray-800">
                    {service.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingServices && activeSub && services.length === 0 && (
          <p className="text-gray-400 text-sm">No services found</p>
        )}
      </div> */}
    </div>
  );
}