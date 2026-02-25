
import { TbUsers } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineRise } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { FaRegFlag } from "react-icons/fa";
import { RiFlashlightLine } from "react-icons/ri";
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
    title: "Client-Centric Mindset",
    desc: "We place our clients at the core of every decision, ensuring solutions that genuinely support their growth and compliance needs.",
    icon: <TbUsers/>,
  },
  {
    title: "Integrity & Transparency",
    desc: "We operate with honesty, clarity, and ethical responsibility, building long-term trust through every interaction.",
    icon: < FaRegHeart/>,
  },
  {
    title: "Commitment to Excellence",
    desc: "We maintain the highest standards of accuracy, quality, and professionalism in every service we deliver.",
    icon:<AiOutlineRise/>,
  },
  {
    title: "Reliability & Accountability",
    desc: "We take ownership of our responsibilities, ensuring dependable service, timely delivery, and consistent support.",
    icon: < BsEmojiSmile />,
  },
  {
    title: "Solution-Driven Approach",
    desc: "We embrace complex challenges with a practical mindset, focusing on clear, effective, and compliant outcomes.",
    icon: <FaRegFlag/>,
  },
  {
    title: "Attention to Detail",
    desc: "We believe precision matters. Every process, document, and compliance step is handled with meticulous care.",
    icon: <RiFlashlightLine/>,
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
  Building Reliable Business Solutions
</h1>

<p className="text-[18px] leading-[28px] lg:text-[20px] lg:leading-[30px] font-normal text-[#535862]">
  We help businesses navigate compliance, taxation, and financial processes with clarity, confidence, and consistency.
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
  Trusted by growing businesses
</span>

<h2 className="text-[32px] lg:text-[48px] font-semibold leading-[40px] lg:leading-[60px] tracking-[-0.02em] text-[#181D27]">
  Supporting businesses at every stage of growth
</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[32px] gap-y-[32px] lg:gap-y-[48px] w-full lg:w-[560px]">
<div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left ">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                    400+
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                     Clients Supported 
                  </p>
                </div>

                <div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                   30+
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                    Years of Experience 
                  </p>
                </div>

                <div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                    10k
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                   Compliance Filings Managed  
                  </p>
                </div>

                <div className="w-full lg:w-[264px] flex flex-col gap-[8px] lg:gap-[20px] text-center lg:text-left">
                  <h3 className="text-[48px] lg:text-[60px] leading-tight lg:leading-[72px] tracking-[-0.02em] font-semibold text-[#D11C16]">
                   200+
                  </h3>
                  <p className="text-[18px] leading-[28px] font-medium text-[#181D27]">
                 Businesses Served 
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

{/* Social Proof Section  */}
 



{/* Hiring Section */}
{/* <section className="w-full  mx-auto bg-white md:py-24 py-14 antialiased">
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

      
      <div className="w-full mt-[64px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px]">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-[#FAFAFA] p-[24px]  flex flex-col items-center text-center rounded-sm">
               <div className="w-[80px] h-[80px] rounded-full bg-[#C7B9DA] mb-[20px] overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>

              
              <div className="flex flex-col gap-[8px] mb-[20px]">
                <h3 className="text-[18px] font-semibold text-[#181D27] leading-[28px] ">{member.name}</h3>
                <p className="text-[16px] font-medium text-[#D11C16] leading-[24px] mt-[-4px] ">{member.role}</p>
                <p className="text-[16px] font-normal text-[#535862] leading-[24px]  ">
                  {member.desc}
                </p>
              </div>

             
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
   
</section> */}

<section className="w-full bg-white py-14 lg:py-20">
  <div className="lg:px-12 mx-auto px-4 m container flex flex-col lg:flex-row items-center gap-12">

    {/* LEFT CONTENT */}
    <div className="flex-1  text-center lg:text-left">

      <span className="text-[#D11C16] text-sm font-semibold tracking-wide">
        About Us
      </span>

      <h2 className="text-[#181D27] text-[30px] lg:text-[42px] leading-[38px] lg:leading-[52px] font-semibold tracking-[-0.02em] mt-3 relative inline-block">
        Simplifying Compliance for Growing Businesses

        {/* underline highlight */}
        <img
          src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20(1).png?updatedAt=1771488262931"
          alt="underline"
          className="absolute -bottom-2 left-0 w-40 opacity-80 hidden sm:block"
        />
      </h2>

      <p className="text-[#535862] text-[18px] leading-[30px] mt-6">
        We help businesses navigate complex regulatory and compliance
        requirements with clarity and confidence. From registrations and
        filings to ongoing financial and tax support, our solutions are
        designed to reduce friction and eliminate uncertainty.
      </p>

      <p className="text-[#535862] text-[18px] leading-[30px] mt-4">
        Our focus is on precision, transparency, and efficiency — ensuring
        that every process is handled accurately, every deadline is met,
        and every client receives dependable professional guidance.
      </p>
    </div>

    {/* RIGHT IMAGE */}
    <div className="lg:pr-12">
      <div className="flex-1 w-full max-w-[520px] relative ">
      <div className="">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
          alt="Team working"
          className="w-full h-[320px] lg:h-[420px] object-cover rounded-2xl shadow-md"
        />

        {/* decorative shape */}
        <img src='https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design%20(4).png?updatedAt=1771772119170' className="absolute -top-10 -right-20 w-20" alt="" />
      </div>
    </div>
    </div>

  </div>

   <section className="w-full bg-white py-16 lg:py-24 antialiased">
      <div className="max-w-[1280px] mx-auto px-[20px] lg:px-[32px]">
         <div className="flex flex-col gap-[32px] items-center">
          <p className="text-[16px] leading-[24px] font-medium text-[#535862] text-center">
           Trusted by startups, SMEs, and growing enterprises
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
                  How We Deliver Value to Businesses
                </h2>
              </div>
              <p className="text-[#535862] text-[18px] lg:text-[20px] leading-[30px] font-normal">
                We combine expertise, efficiency, and transparency to simplify complex
  compliance processes for growing organizations.
              </p>
            </div>
  <div className="w-full max-w-[1216px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[48px] lg:gap-y-[64px]">
              {values.map((item, index) => (
                <div 
                  key={index} 
                  className="w-full max-w-[384px] flex flex-col items-center gap-[20px] mx-auto" >
                
                  <div className="w-[48px] h-[48px] text-[#D11C16] bg-[#F4EBFF] rounded-full  flex items-center justify-center bg-[#F4EBFF]">
                    
                    {item.icon}
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



