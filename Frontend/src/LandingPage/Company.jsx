

const About = () => {
  
  //Team Members
  const teamMembers = [
    { name: "Olivia Rhye", role: "Founder & CEO", desc: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a3.png" },
    { name: "Phoenix Baker", role: "Engineering Manager", desc: "Lead engineering teams at Figma, Pitch, and Protocol Labs.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a8.png" },
    { name: "Lana Steiner", role: "Product Manager", desc: "Former PM for Linear, Lambda School, and On Deck.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a8.png" },
    { name: "Demi Wilkinson", role: "Frontend Developer", desc: "Former frontend dev for Linear, Coinbase, and Postscript.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a6.png" },
    { name: "Candice Wu", role: "Backend Developer", desc: "Lead backend dev at Clearbit. Former Clearbit and Loom.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a8.png" },
    { name: "Natali Craig", role: "Product Designer", desc: "Founding design team at Figma. Former Pleo, Stripe, and Tile.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a6.png" },
    { name: "Drew Cano", role: "UX Researcher", desc: "Lead user research for Slack. Contractor for Netflix and Udacity.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a8.png" },
    { name: "Orlando Diggs", role: "Customer Success", desc: "Lead CX at Wealthsimple. Former PagerDuty and Sqreen.", image: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/a6.png" },
  ];

 //Features
  const values = [
    {
      title: "Care about our team",
      desc: "Understand what matters to our employees. Give them what they need to do their best work.",
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/i1.png",
    },
    {
      title: "Be excellent to each other",
      desc: "No games. No bullshit. We rely on our peers to improve. Be open, honest and kind.",
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/i4.png",
    },
    {
      title: "Pride in what we do",
      desc: "Value quality and integrity in everything we do. At all times. No exceptions.",
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/i5.png",
    },
    {
      title: "Don't #!&$ the customer",
      desc: "Understand customers' stated and unstated needs. Make them wildly successful.",
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/i3.png",
    },
    {
      title: "Do the impossible",
      desc: "Be energized by difficult problems. Revel in unknowns. Ask \"Why?\", but always question, \"Why not?\"",
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/i2.png",
    },
    {
      title: "Sweat the small stuff",
      desc: "We believe the best products come from the best attention to detail. Sweat the small stuff.",
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/i4.png",
    },
  ];

  //Logos
 const logos = [
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark4.png", name: "Layers" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark5.png", name: "Sisyphus" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark2.png", name: "Circooles" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark3.png", name: "Catalog" },
    { src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark1.png", name: "Quotient" },
  ];

   
  return (
    <div className="font-inter w-full overflow-x-hidden">

      {/* Header Section */}
      <section className="w-full bg-white py-5 lg:py-24">
        <div className="w-full lg:max-w-[1280px] mx-auto px-[20px] lg:px-[32px]">
         <div className="w-full flex flex-col items-center gap-[24px] text-center lg:max-w-[960px] lg:mx-auto">
             <span className="text-[#D11C16] text-[16px] font-semibold leading-[24px]">
              About us
            </span>
 <h1 className="text-[32px] leading-[40px] lg:text-[48px] lg:leading-[60px] font-semibold text-[#181D27] tracking-[-0.02em]">
              About the company
            </h1>
 <p className="text-[18px] leading-[28px] lg:text-[20px] lg:leading-[30px] font-normal text-[#535862]">
              Learn more about the company and the team behind it.
            </p>
</div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="w-full bg-gray-50 py-[64px] lg:py-[96px]">
        <div className="w-full lg:max-w-[1280px] mx-auto px-[20px] lg:px-[32px]">
            <div className="flex flex-col lg:flex-row gap-[48px] lg:gap-[96px] items-center">

            {/* Left side */}
            <div className="w-full lg:flex-1">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/Image%20(4).png"
                alt="Office"
                
                className="w-full h-[360px] md:h-[420px] lg:h-[560px] object-cover"/>
            </div>

            {/* Right side */}
         <div className="w-full lg:w-[560px] flex flex-col gap-[48px] lg:gap-[64px]">
 <div className="w-full lg:w-[560px] flex flex-col gap-[12px] text-center lg:text-left">
                <span className="text-[16px] font-semibold leading-[24px] text-[#D11C16]">
                  We’ve helped hundreds of companies
                </span>
<h2 className="text-[32px] lg:text-[48px] font-semibold leading-[40px] lg:leading-[60px] tracking-[-0.02em] text-[#181D27]">
                  We’re only just getting started on our journey
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[32px] gap-y-[32px] lg:gap-y-[48px] w-full lg:w-[560px]">
<div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left ">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                    400+
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                    Projects completed
                  </p>
                </div>

                <div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                    600%
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                    Return on investment
                  </p>
                </div>

                <div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                    10k
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                    Global downloads
                  </p>
                </div>

                <div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                    200+
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                    5-star reviews
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

{/* Social Proof Section  */}
  <section className="w-full bg-white py-16 lg:py-24 antialiased">
      <div className="max-w-[1280px] mx-auto px-[20px] lg:px-[32px]">
         <div className="flex flex-col gap-[32px] items-center">
          <p className="text-[16px] leading-[24px] font-medium text-[#535862] text-center">
            From startups to the world’s largest companies
          </p>
<div className="w-full max-w-[1216px] flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-y-[40px] gap-x-[32px] md:gap-x-[48px] lg:gap-x-0">
             {logos.map((logo, index) => (
              <div 
                key={index} 
                className="flex items-center gap-[12px] flex-shrink-0">
                <img  src={logo.src}  alt={`${logo.name} mark`}  className="w-[44px] h-[44px] object-contain flex-shrink-0" />
 <span className="text-[24px] font-bold text-[#535862] tracking-tight antialiased">
                  {logo.name}
                </span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  
 {/* Divider Section */}
 <section className="w-full max-w-[1440px] mx-auto bg-white py-[20px]"> 
  <div className="max-w-[1280px] mx-auto px-[32px]">
   <div className="w-full h-[1px] bg-[#E9EAEB]"></div>
  </div>
</section>



{/* Hiring Section */}
<section className="w-full  mx-auto bg-white md:py-24 py-14 antialiased">
<div className="md:px-12 px-4 mx-auto ">
     <div className="max-w-[1216px] mx-auto flex flex-col items-center gap-[40px]">
      <div className="max-w-[768px] w-full flex flex-col items-center gap-[20px] text-center">
        <div className="flex flex-col gap-[12px]">
          <span className="text-[#D11C16] text-[16px] leading-[24px] font-semibold">
            We’re hiring!
          </span>
          <h2 className="text-[#181D27] text-[30px] lg:text-[36px] leading-[38px] lg:leading-[44px] font-semibold tracking-[-0.02em]">
            Meet our team
          </h2>
        </div>
  <p className="text-[#535862] text-[18px] lg:text-[20px] leading-[28px] lg:leading-[30px] font-normal">
          Our philosophy is simple — hire a team of diverse, passionate people and foster a culture that empowers you to do you best work.
        </p>
      </div>

    <div className="flex flex-row w-full gap-[12px]">
        <button className="w-full  px-5 py-3 bg-white border border-[#D5D7DA] rounded-[8px] text-[#414651] text-[16px] leading-[24px] font-semibold shadow-sm hover:bg-gray-50 transition-colors">
          About us
        </button>
        <button className="w-full  px-5 py-3 bg-[#D11C16] border border-[#D11C16] rounded-[8px] text-white text-[16px] leading-[24px] font-semibold shadow-sm hover:bg-[#b01712] transition-colors">
          Open positions
        </button>
      </div>

      {/* Members */}
      <div className="w-full mt-[64px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px]">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-[#FAFAFA] p-[24px]  flex flex-col items-center text-center rounded-sm">
               <div className="w-[80px] h-[80px] rounded-full bg-[#C7B9DA] mb-[20px] overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>

              {/* Name & Role Wrapper */}
              <div className="flex flex-col gap-[8px] mb-[20px]">
                <h3 className="text-[18px] font-semibold text-[#181D27] leading-[28px] ">{member.name}</h3>
                <p className="text-[16px] font-medium text-[#D11C16] leading-[24px] mt-[-4px] ">{member.role}</p>
                <p className="text-[16px] font-normal text-[#535862] leading-[24px]  ">
                  {member.desc}
                </p>
              </div>

              {/* Social Icons */}
           <div className="flex justify-center gap-[16px]">
          <img 
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/s1.png" 
            alt="Twitter" 
            className="w-[20px] h-[20px] object-contain" 
          />
          <img 
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/s2.png" 
            alt="LinkedIn" 
            className="w-[20px] h-[20px] object-contain" 
          />
           <img 
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/v3%20(1).png" 
            alt="Icon" 
            className="w-[20px] h-[20px] object-contain" 
          />
        </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
   
</section>


  {/* --- Our values section --- */}
  <section className="w-full bg-[#FAFAFA] py-[64px] lg:py-[96px] antialiased">
         <div className="w-full md:px-12 px-4 mx-auto ">
           <div className="flex flex-col items-center gap-[48px] lg:gap-[64px]">
            <div className="w-full max-w-[768px] flex flex-col items-center gap-[20px] text-center">
              <div className="flex flex-col gap-[12px]">
                <span className="text-[#D11C16] text-[16px] leading-[24px] font-semibold">
                  Our values
                </span>
                <h2 className="text-[#181D27] text-[30px] lg:text-[36px] leading-[38px] lg:leading-[44px] font-semibold tracking-[-0.02em]">
                  How we work at Untitled
                </h2>
              </div>
              <p className="text-[#535862] text-[18px] lg:text-[20px] leading-[30px] font-normal">
                Our shared values keep us connected and guide us as one team.
              </p>
            </div>
  <div className="w-full max-w-[1216px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[48px] lg:gap-y-[64px]">
              {values.map((item, index) => (
                <div 
                  key={index} 
                  className="w-full max-w-[384px] flex flex-col items-center gap-[20px] mx-auto" >
                
                  <div className="w-[48px] h-[48px] rounded-full  flex items-center justify-center bg-[#F4EBFF]">
                    <img 
                      src={item.icon} 
                      alt={item.title} 
                      className="w-[24px] h-[24px] object-contain" 
                    />
                  </div>
 <div className="flex flex-col gap-[8px] text-center">
                    <h3 
                    style={{ fontWeight: 525 }} className="text-[#181D27] text-[20px]  leading-[30px]  antialiased ">
                      {item.title}
                    </h3>
                    <p className="text-[#535862] text-[16px] leading-[24px] font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>



 
    </div>
  );
};

export default About;



