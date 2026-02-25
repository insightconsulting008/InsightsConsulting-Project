import React from "react";

const Footer = () => {
    //Links
  const footerData = [
    { title: "Product", links: ["Overview", "Features", "Solutions", "Tutorials", "Pricing", "Releases"] },
    { title: "Company", links: ["About us", "Careers", "Press", "News", "Media kit", "Contact"] },
    { title: "Resources", links: ["Blog", "Newsletter", "Events", "Help centre", "Tutorials", "Support"] },
    { title: "Social", links: ["Twitter", "LinkedIn", "Facebook", "GitHub", "AngelList", "Dribbble"] },
    { title: "Legal", links: ["Terms", "Privacy", "Cookies", "Licenses", "Settings", "Contact"] },
  ];

  // Icons 
  const socialIcons = [
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/v3.png", w: "22.98px", h: "22px" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/v1.png", w: "24px", h: "24px" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark5.png", w: "24px", h: "23.85px" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/s3.png", w: "24px", h: "23.44px" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/v3.png", w: "16.68px", h: "24px" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/s2.png", w: "24px", h: "24px" },
  ];

  return (
    <footer className="w-full bg-white antialiased font-inter">
   
  
<section className="w-full pt-[64px] pb-[48px]">
  <div className=" lg:px-14 px-4 mx-auto ">
    
    <div className=" mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-start gap-[32px]">
      
      <div className="flex flex-col gap-[16px] text-center lg:text-left">
  <h2 className="text-[#181D27] text-[24px] lg:text-[30px] leading-[38px] font-semibold tracking-[-0.02em]">
    Simplify Your Business Compliance Today
  </h2>

  <p className="text-[#535862] text-[18px] lg:text-[20px] leading-[30px] font-normal">
    Trusted by businesses for registrations, filings, and regulatory support.
  </p>
</div>

      
      <div className="flex flex-col flex-row items-center justify-center gap-[12px] w-full lg:w-auto">
       
        <button className="w-full sm:w-[128px] h-[48px] border border-[#D5D7DA] rounded-[8px] text-[#414651] font-semibold shadow-sm hover:bg-gray-50 transition-all">
          Learn more
        </button>
        
   
        <button className="w-full sm:w-[129px] h-[48px] bg-[#D11C16] border border-[#D11C16] rounded-[8px] text-white font-semibold shadow-sm hover:bg-[#b01712] transition-all">
          Get started
        </button>
      </div>

    </div>
  </div>
</section>

     {/*Divider*/}
      <div className=" mx-auto px-4 lg:px-12">
        <div className=" mx-auto h-[1px] bg-[#E9EAEB]"></div>
      </div>

      {/* Links */}
      <section className="w-full pt-[64px] pb-[48px]">
        <div className=" mx-auto  md:px-14 px-4">
          <div className=" mx-auto flex flex-col justify-between lg:flex-row gap-[48px] lg:gap-[64px] items-start">
            
           
            <div className="flex flex-col gap-[32px] w-full lg:w-[320px]">
              <div className="flex items-center gap-[12px]">
                <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/Logomark.png" alt="Logo" className="w-[32px] h-[32px] object-contain" />
                <span className="text-[#181D27] text-[19px] font-bold leading-none">Untitled UI</span>
              </div>
              <p className="text-[#535862] text-[16px] leading-[24px]">
                Design amazing digital experiences that create more happy in the world.
              </p>
            </div>

            
            <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-[32px] gap-y-[48px] lg:gap-y-[32px]">
              {footerData.map((col) => (
                <div key={col.title} className="flex flex-col gap-[16px] lg:w-[140.8px]">
                  <h4 className="text-[#717680] text-[14px] font-semibold capitalize">{col.title}</h4>
                  <ul className="flex flex-col gap-[12px]">
                    {col.links.map((link) => (
                      <li key={link} className="flex items-center gap-[8px]">
                        <button className="text-[#535862] text-[16px] font-semibold hover:text-black transition-colors text-left">{link}</button>
                        {link === "Solutions" && (
                          <span 
                            className="bg-[#ECFDF3] text-[#027A48] text-[12px] leading-[18px] font-medium flex items-center justify-center " 
                            style={{ width: '42px', height: '22px', borderRadius: '16px' }}
                          >
                            New
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    
      <section className="w-full pb-[48px]">
        <div className="max-w-[1280px] mx-auto px-[20px] lg:px-[32px]">
          <div className="max-w-[1216px] mx-auto h-[1px] bg-[#E9EAEB]"></div>
          
          <div className="max-w-[1216px] mx-auto pt-[32px] flex flex-col md:flex-row justify-between items-center gap-[24px]">
            
           
            <p className="text-[#717680] text-[16px] leading-[24px] font-normal w-full lg:w-[920px] text-center md:text-left">
              © 2077 Untitled UI. All rights reserved.
            </p>

          
            <div className="flex items-center justify-center md:justify-end gap-[24px] w-full lg:w-[264px]">
              {socialIcons.map((icon, index) => (
                <div key={index} className="w-[24px] h-[24px] flex items-center justify-center">
                  <img 
                    src={icon.src} 
                    alt="social icon"
                    style={{ width: icon.w, height: icon.h }}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;