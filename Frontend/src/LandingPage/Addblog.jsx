import React, { useState } from "react";
import axios from "axios";

export default function BlogCreateWithBlocks() {
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    coverImage: "",
    tags: "",
    category: "",
    readTime: "",
    published: true
  });

  // ➕ Add block
  const addBlock = (type) => {
    setBlocks([...blocks, { type, value: "" }]);
  };

  // ✏️ Update block value
  const updateBlock = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].value = value;
    setBlocks(newBlocks);
  };

  // 🗑 Remove block
  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // 🔄 Convert blocks → HTML
  const generateHTML = () => {
    return blocks
      .map((block) => {
        if (block.type === "h1") return `<h1>${block.value}</h1>`;
        if (block.type === "p") return `<p>${block.value}</p>`;
        if (block.type === "ul") {
          const items = block.value
            .split("\n")
            .map((item) => `<li>${item}</li>`)
            .join("");
          return `<ul>${items}</ul>`;
        }
        if (block.type === "img")
          return `<img src="${block.value}" alt="blog image" />`;
        return "";
      })
      .join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      content: generateHTML(),
      author: form.author,
      coverImage: form.coverImage,
      meta: {
        tags: form.tags.split(",").map((t) => t.trim()),
        category: form.category,
        readTime: form.readTime
      },
      published: form.published
    };

    try {
      await axios.post(
        "https://insightsconsult-backend.onrender.com/blogs",
        payload
      );
      alert("Blog created 🚀");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Create Blog</h2>

        {/* BASIC INFO */}
        <div className="space-y-3 mb-6">
          <input
            placeholder="Title"
            className="w-full border px-4 py-2 rounded"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Description"
            className="w-full border px-4 py-2 rounded"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        {/* EXTRA BLOG INFO */}
<div className="grid md:grid-cols-2 gap-3">
  <input
    placeholder="Author"
    className="w-full border px-4 py-2 rounded"
    value={form.author}
    onChange={(e) => setForm({ ...form, author: e.target.value })}
  />

  <input
    placeholder="Cover Image URL"
    className="w-full border px-4 py-2 rounded"
    value={form.coverImage}
    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
  />

  <input
    placeholder="Tags (comma separated)"
    className="w-full border px-4 py-2 rounded"
    value={form.tags}
    onChange={(e) => setForm({ ...form, tags: e.target.value })}
  />

  <input
    placeholder="Category"
    className="w-full border px-4 py-2 rounded"
    value={form.category}
    onChange={(e) => setForm({ ...form, category: e.target.value })}
  />

  <input
    placeholder="Read Time (ex: 5 min)"
    className="w-full border px-4 py-2 rounded"
    value={form.readTime}
    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
  />
</div>

{/* PUBLISH TOGGLE */}
<label className="flex items-center gap-2 mt-3">
  <input
    type="checkbox"
    checked={form.published}
    onChange={(e) => setForm({ ...form, published: e.target.checked })}
  />
  Publish immediately
</label>


        {/* BLOCK BUTTONS */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button onClick={() => addBlock("h1")} className="btn">+ Heading</button>
          <button onClick={() => addBlock("p")} className="btn">+ Paragraph</button>
          <button onClick={() => addBlock("ul")} className="btn">+ List</button>
          <button onClick={() => addBlock("img")} className="btn">+ Image</button>
        </div>

        {/* BLOCK EDITOR */}
        <div className="space-y-4">
          {blocks.map((block, i) => (
            <div key={i} className="border p-3 rounded relative">
              <button
                onClick={() => removeBlock(i)}
                className="absolute top-2 right-2 text-red-500"
              >
                ✕
              </button>

              <p className="text-xs text-gray-500 mb-1 uppercase">
                {block.type}
              </p>

              <textarea
                rows={block.type === "img" ? 1 : 3}
                placeholder={
                  block.type === "img"
                    ? "Image URL"
                    : block.type === "ul"
                    ? "One item per line"
                    : "Enter text"
                }
                value={block.value}
                onChange={(e) => updateBlock(i, e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-black text-white py-2 rounded"
        >
          Publish Blog
        </button>
      </div>
    </div>
  );
}
