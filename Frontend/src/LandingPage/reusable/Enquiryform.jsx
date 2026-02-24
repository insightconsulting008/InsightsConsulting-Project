import React, { useState } from "react";
import axios from "axios";
import { CheckCircle, Zap } from "lucide-react";

const Enquiryform = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceRequired: "",
    comments: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://insightsconsult-backend.onrender.com/enquiry",
        formData
      );
      if (res.status === 200 || res.status === 201) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          serviceRequired: "",
          comments: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex w-auto justify-center lg:justify-end">
        <div className="bg-bright rounded-2xl shadow-xl border border-border/60 w-full max-w-md p-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-textdark">Enquiry Submitted!</h3>
          <p className="text-textlight text-sm leading-relaxed">
            Our compliance expert will reach out within{" "}
            <span className="text-primary font-semibold">15 minutes</span>.
            Thank you for choosing Insight Consulting.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-cta text-sm mt-2"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-auto justify-center lg:justify-end">
      <form
        onSubmit={handleSubmit}
        className="bg-bright rounded-2xl shadow-xl border border-border/60 overflow-hidden w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center gap-3">
          <img
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/call.png"
            className="w-10 h-10 object-contain"
            alt=""
          />
          <div>
            <h3 className="font-semibold text-textbright text-sm leading-snug">
              Get Expert Compliance Support
            </h3>
            <p className="text-textbright/75 text-xs mt-0.5 flex items-center gap-1">
              <Zap size={11} className="text-yellow" />
              Response Time: &lt; 15 Minutes
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-textdark/70 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1.5 w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-textdark placeholder:text-textlight/60
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-textdark/70 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="mt-1.5 w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-textdark placeholder:text-textlight/60
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-textdark/70 uppercase tracking-wide">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1.5 w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-textdark placeholder:text-textlight/60
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Service Required */}
          <div>
            <label className="text-xs font-semibold text-textdark/70 uppercase tracking-wide">
              Service Required
            </label>
            <select
              name="serviceRequired"
              required
              value={formData.serviceRequired}
              onChange={handleChange}
              className="mt-1.5 w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-textdark
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
            >
              <option value="">Select the service required</option>
              <option>GST Registration</option>
              <option>GST Filing</option>
              <option>Company Incorporation</option>
              <option>Trademark Registration</option>
              <option>MSME Registration</option>
              <option>FSSAI License</option>
              <option>ISO Certification</option>
            </select>
          </div>

          {/* Comments */}
          <div>
            <label className="text-xs font-semibold text-textdark/70 uppercase tracking-wide">
              Message (Optional)
            </label>
            <textarea
              rows={3}
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Any specific requirements or questions?"
              className="mt-1.5 w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-textdark placeholder:text-textlight/60 resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red text-textbright py-3.5 rounded-xl font-semibold text-sm
                       hover:opacity-90 hover:shadow-md active:scale-[0.98]
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-textbright/40 border-t-textbright rounded-full animate-spin" />
                Submitting…
              </span>
            ) : (
              "Enquire Now →"
            )}
          </button>

          <p className="text-center text-textlight text-xs">
            Free consultation · No commitment required
          </p>
        </div>
      </form>
    </div>
  );
};

export default Enquiryform;
