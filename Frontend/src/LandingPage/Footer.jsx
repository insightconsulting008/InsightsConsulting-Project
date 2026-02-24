import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "Services",
      links: [
        { label: "GST Registration", to: "/services/gst" },
        { label: "GST Filing", to: "/services/gst-filing" },
        { label: "Company Incorporation", to: "/services/company" },
        { label: "Trademark Registration", to: "/services/trademark" },
        { label: "MSME Registration", to: "/services/msme" },
        { label: "ISO Certification", to: "/services/iso" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/company" },
        { label: "Service Hub", to: "/servicehub" },
        { label: "Resources", to: "/resource" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog & Articles", to: "/resource" },
        { label: "Compliance Guides", to: "/resource" },
        { label: "FAQs", to: "/" },
        { label: "Support", to: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/" },
        { label: "Terms of Service", to: "/" },
        { label: "Cookie Policy", to: "/" },
        { label: "Refund Policy", to: "/" },
      ],
    },
  ];

  const socialIcons = [
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/v3.png",
      alt: "Twitter",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/v1.png",
      alt: "LinkedIn",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark5.png",
      alt: "Facebook",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/s3.png",
      alt: "Instagram",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/s2.png",
      alt: "YouTube",
    },
  ];

  return (
    <footer className="w-full bg-bright border-t border-border">

      {/* ── CTA Strip ── */}
      <section className="bg-textdark py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-textbright leading-snug">
              Ready to simplify your compliance?
            </h2>
            <p className="text-textbright/60 mt-2 text-sm">
              Join 1,000+ businesses already managing compliance with Insight Consulting.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <button className="w-full sm:w-auto px-6 py-3 border border-textbright/20 text-textbright rounded-xl text-sm font-semibold hover:bg-textbright/10 transition-all duration-200">
              Learn More
            </button>
            <button className="w-full sm:w-auto bg-red text-textbright px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
              Get Started →
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Footer Body ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* Brand Column */}
            <div className="lg:w-72 flex-shrink-0 space-y-5">
              <Link to="/">
                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png?updatedAt=1771313237021"
                  alt="Insight Consulting"
                  className="h-12 object-contain"
                />
              </Link>
              <p className="text-textlight text-sm leading-relaxed">
                Simplifying compliance for businesses across India — from GST
                registration to ongoing filings, all managed by dedicated experts.
              </p>

              {/* Contact info */}
              <div className="space-y-2.5">
                <a
                  href="tel:+919857847497"
                  className="flex items-center gap-2.5 text-sm text-textdark/70 hover:text-primary transition-colors"
                >
                  <Phone size={14} className="text-primary flex-shrink-0" />
                  +91 98578 47497
                </a>
                <a
                  href="mailto:support@insightconsulting.in"
                  className="flex items-center gap-2.5 text-sm text-textdark/70 hover:text-primary transition-colors"
                >
                  <Mail size={14} className="text-primary flex-shrink-0" />
                  support@insightconsulting.in
                </a>
                <div className="flex items-start gap-2.5 text-sm text-textdark/70">
                  <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
                  India
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-4 pt-1">
                {socialIcons.map((icon) => (
                  <button
                    key={icon.alt}
                    aria-label={icon.alt}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:border-primary/40 hover:bg-secondary transition-all duration-200"
                  >
                    <img
                      src={icon.src}
                      alt={icon.alt}
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Links Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-6">
              {footerLinks.map((col) => (
                <div key={col.title} className="space-y-4">
                  <h4 className="text-xs font-bold text-textdark/50 uppercase tracking-[0.15em]">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="text-sm text-textdark/70 hover:text-primary font-medium transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Bottom ── */}
      <section className="border-t border-border py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-textlight text-sm text-center md:text-left">
            © {new Date().getFullYear()} Insight Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-textlight">
            <Link to="/" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
