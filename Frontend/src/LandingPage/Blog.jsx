import React, { useEffect, useState } from "react";
import { FiSearch, FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const API =
    "https://insightsconsult-backend.onrender.com/blogs?page=1&limit=10";

  useEffect(() => {
  fetch(API)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    })
    .then((data) => {
      setBlogs(data.data || []);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message || "Something went wrong");
      setLoading(false);
    });
}, []);


  return (
    <section className=" relative overflow-hidden">
      {/* Heading */}
     <div className="bg-[#FFFBEC] relative ">
  
  <div className="text-center container py-16 space-y-6 mx-auto mb-12 relative z-10">
    <span className="text-xs bg-[#FFFBEC] text-red px-3 py-1 rounded-full">
      Our blog
    </span>

    <h2 className="text-3xl lg:text-4xl font-bold text-[#42307D] mt-4">
      Resources and insights
    </h2>

    <p className="text-red mt-2">
      The latest industry news, interviews, technologies, and resources.
    </p>

    <div className="flex justify-center mt-6">
      <div className="flex items-center bg-white px-4 py-2 rounded-lg w-72">
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none ml-2 w-full"
        />
      </div>
    </div>
  </div>

  
 
</div>


   {/* Blog Grid Section with Background */}
<div className="relative mt-10 pb-20">
  
  {/* Background Image */}
  <img
    src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Background%20pattern.png"
    alt=""
    className="absolute inset-0 -top-14   h-130 object-cover opacity-100 pointer-events-none"
  />

  {/* Grid */}
  {loading ? (
  <p className="text-center relative z-10">Loading...</p>
) : error ? (
  <div className="text-center py-20 relative z-10">
    <p className="text-red-500 font-semibold">⚠ {error}</p>
  </div>
) : blogs.length === 0 ? (
  <div className="text-center py-20 relative z-10">
    <p className="text-gray-500 text-lg">No blogs found</p>
  </div>
) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto max-w-7xl relative z-10"     >
      {blogs.map((blog) => (
        <div
          key={blog.blogId}
          className="bg-white  shadow-md p-4 overflow-hidden hover:shadow-lg transition"
        >
          {/* Image */}
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-56 w-full  object-cover"
          />

          {/* Content */}
          <div className="p-5">
            <span className="text-xs text-red-500 font-medium">
              {blog.category || ""}
            </span>

            <h3 className="text-lg font-semibold text-gray-800 mt-2 flex items-start justify-between gap-2">
              {blog.title}
<FiArrowUpRight
  className="text-gray-500 mt-1 cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/resource/${blog.slug}`);
  }}
/>
            </h3>

            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {blog.description || ""}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-5">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                {blog.author?.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  {blog.author}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(blog.createdAt).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    </section>
  );
}