    import React, { useEffect, useState, useMemo } from "react";
    import axios from "axios";
    import { FaClock, FaTag, FaUser } from "react-icons/fa";
    import { useParams } from "react-router-dom";

    export default function Blogdesc() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState(null);


    // 👉 fetch blog
    useEffect(() => {
        const fetchBlog = async () => {
        try {
            const res = await axios.get(
            `https://insightsconsult-backend.onrender.com/blogs/${slug}`
            );
            setBlog(res.data);
        } catch (err) {
            console.error(err);
        }
        };
        fetchBlog();
    }, [slug]);

    // 👉 parse HTML and extract h1
    const parsedContent = useMemo(() => {
        if (!blog?.content) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(blog.content, "text/html");

        const h1s = doc.querySelectorAll("h1");
        const list = [];

        h1s.forEach((h1, index) => {
        const id = `section-${index}`;
        h1.setAttribute("id", id);
        list.push({
            id,
            text: h1.textContent,
        });
        });

        setHeadings(list);
        return doc.body.innerHTML;
    }, [blog]);

    useEffect(() => {
  if (!headings.length) return;

  const handleScroll = () => {
    let current = null;

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (!el) return;

      const rect = el.getBoundingClientRect();

      if (rect.top <= 120) {
        current = heading.id;
      }
    });

    setActiveId(current);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, [headings]);


    const styleBlogContent = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // style headings
    doc.querySelectorAll("h1").forEach((el) => {
        el.className =
        "text-2xl md:text-3xl font-semibold text-gray-900 mt-12 mb-4";
    });

    // style paragraphs
    doc.querySelectorAll("p").forEach((el) => {
        el.className = "text-gray-600 leading-relaxed mb-6 text-[15px]";
    });

    // style images
    doc.querySelectorAll("img").forEach((el) => {
        el.className = "rounded-2xl my-6 shadow-sm";
    });

    // style blockquotes
    doc.querySelectorAll("blockquote").forEach((el) => {
        el.className =
        "border-l-4 border-red-500 pl-4 italic text-gray-700 my-8";
    });

    // style lists
    doc.querySelectorAll("ul").forEach((el) => {
        el.className = "list-disc pl-6 mb-6 text-gray-600";
    });

    doc.querySelectorAll("li").forEach((el) => {
        el.className = "mb-2";
    });

    return doc.body.innerHTML;
    };


    if (!blog) return <div className="p-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HERO */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs">
                {blog.meta.category}
                </span>
                <span className="flex items-center gap-1">
                <FaClock /> {blog.meta.readTime}
                </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                {blog.title}
            </h1>

            <p className="text-gray-500 mt-4 text-lg">{blog.description}</p>

            <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser />
                </div>
                <div>
                <p className="font-semibold">{blog.author}</p>
                <p className="text-sm text-gray-500">
                    Published {new Date(blog.createdAt).toDateString()}
                </p>
                </div>
            </div>
            </div>

            <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-[320px] object-cover rounded-2xl shadow"
            />
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-4 gap-10 mt-14">
            {/* TOC */}
            <aside className="md:col-span-1 sticky top-24 h-fit">
            <h3 className="text-red-500 font-semibold mb-4">
                Table of contents
            </h3>

           <ul className="space-y-3 text-sm border-l pl-4">
  {headings.map((item) => (
    <li key={item.id}>
      <a
        href={`#${item.id}`}
        className={`transition ${
          activeId === item.id
            ? "text-red-500 font-semibold border-l-2 border-red-500 pl-2"
            : "text-gray-600 hover:text-black"
        }`}
      >
        {item.text}
      </a>
    </li>
  ))}
</ul>


            {/* TAGS */}
            <div className="mt-8">
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                {blog.meta.tags.map((tag, i) => (
                    <span
                    key={i}
                    className="flex items-center gap-1 text-xs bg-gray-100 px-3 py-1 rounded-full"
                    >
                    <FaTag /> {tag}
                    </span>
                ))}
                </div>
            </div>
            </aside>

            {/* BLOG BODY */}
            <article className="md:col-span-3">
            <div
                className="prose max-w-none prose-img:rounded-xl prose-h1:text-2xl"
                dangerouslySetInnerHTML={{ __html:styleBlogContent(parsedContent)}}
            />
            </article>
        </div>
        </div>
    );
    }
