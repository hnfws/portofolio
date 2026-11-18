import React, { useState, useEffect, memo } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles, Palette } from "lucide-react"
import { PORTFOLIO_ROLES } from "../utils/portfolio"
import AOS from 'aos'
import 'aos/dist/aos.css'

const StatusBadge = memo(({ role }) => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          {role === "illustrator" ? "Creating visual stories" : "Ready to Innovate"}
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(({ role }) => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      {PORTFOLIO_ROLES[role].titleLines.map((line, index) => (
        <React.Fragment key={line}>
          {index > 0 && <br />}
          <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
            <span className={`relative bg-gradient-to-r ${index === 0 ? "from-white via-blue-100 to-purple-200" : "from-[#6366f1] to-[#a855f7]"} bg-clip-text text-transparent`}>
              {line}
            </span>
          </span>
        </React.Fragment>
      ))}
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <button className="group relative p-3"
      aria-label={label}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const ROLE_WORDS = {
  developer: ["Full-Stack Developer", "Digital Problem Solver"],
  illustrator: ["Digital Illustrator", "Visual Storyteller"],
};
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/hnfws", label: "GitHub Profile" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/muhanafawwassausan/", label: "LinkedIn Profile" },
  { icon: Instagram, link: "https://www.instagram.com/hn.fws/", label: "Instagram Profile" }
];

const Home = ({ role, onRoleChange }) => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const words = ROLE_WORDS[role]

  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  useEffect(() => {
    setText("");
    setWordIndex(0);
    setCharIndex(0);
    setIsTyping(true);
  }, [role]);

  useEffect(() => {
    let timeout;
    const word = words[wordIndex];

    if (isTyping) {
      if (charIndex < word.length) {
        timeout = setTimeout(() => {
          setText(word.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setText(word.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, ERASING_SPEED);
      } else {
        setWordIndex((previous) => (previous + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, wordIndex, words]);

  const roleDetails = PORTFOLIO_ROLES[role];
  const RoleIcon = role === "illustrator" ? Palette : ExternalLink;
  const title = `Muhana Fawwas Sausan — ${roleDetails.label}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Portfolio Muhana Fawwas Sausan sebagai ${roleDetails.label}.`} />
     <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ekizr.com" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={`Website portfolio Muhana Fawwas Sausan sebagai ${roleDetails.label}.`} />
        <meta property="og:url" content="https://ekizr.com" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Muhana Fawwas Sausan",
            "jobTitle": "${roleDetails.label}",
            "url": "https://ekizr.com",
            "sameAs": [
              "https://github.com/hnfws",
              "https://www.linkedin.com/in/muhanafawwassausan/",
              "https://www.instagram.com/hn.fws/"
            ]
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-[#030014] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="container mx-auto min-h-screen">
            <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">
              {/* Left Column */}
              <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
                data-aos="fade-right"
                data-aos-delay="200">
                <div className="space-y-4 sm:space-y-6">
                  <div
                    className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1"
                    role="group"
                    aria-label="Choose portfolio role"
                  >
                    {Object.entries(PORTFOLIO_ROLES).map(([roleKey, details]) => (
                      <button
                        key={roleKey}
                        type="button"
                        aria-pressed={role === roleKey}
                        onClick={() => onRoleChange(roleKey)}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                          role === roleKey
                            ? "bg-indigo-500/20 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {details.shortLabel}
                      </button>
                    ))}
                  </div>
                  <StatusBadge role={role} />
                  <MainTitle role={role} />

                  {/* Typing Effect */}
                  <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                    <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                      {text}
                    </span>
                    <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                  </div>

                  {/* Description */}
                  <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                    data-aos="fade-up"
                    data-aos-delay="1000">
                    {role === "illustrator"
                      ? "Mengubah ide menjadi ilustrasi dan cerita visual yang berkarakter."
                      : "Menciptakan website yang inovatif, fungsional, dan user-friendly untuk solusi digital."}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                    {roleDetails.stack.map((tech, index) => (
                      <TechStack key={index} tech={tech} />
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                    <CTAButton href="#Portofolio" text={role === "illustrator" ? "Artwork" : "Projects"} icon={RoleIcon} />
                    <CTAButton href="#Contact" text="Contact" icon={Mail} />
                  </div>

                  {/* Social Links */}
                  <div className="hidden sm:flex gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                    {SOCIAL_LINKS.map((social, index) => (
                      <SocialLink key={index} {...social} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full py-0 md:py-[10%] sm:py-0 lg:w-1/2 h-[260px] sm:h-[400px] lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2  mt-5 sm:mt-0"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                data-aos="fade-left"
                data-aos-delay="600">
                <div className="relative w-full opacity-90">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                    isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                  }`}>
                  </div>

                  {role === "illustrator" ? (
                    <div className="relative lg:left-12 z-10 mx-auto flex aspect-[4/3] w-[88%] max-w-[500px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#23143b] via-[#111027] to-[#090817] shadow-[0_30px_100px_rgba(99,102,241,0.18)]">
                      <svg aria-hidden="true" viewBox="0 0 500 380" className="absolute inset-0 h-full w-full">
                        <defs>
                          <linearGradient id="illustration-bg" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f472b6" />
                            <stop offset="100%" stopColor="#818cf8" />
                          </linearGradient>
                        </defs>
                        <circle cx="250" cy="184" r="118" fill="url(#illustration-bg)" opacity=".18" />
                        <path d="M92 300c28-81 85-120 158-120s130 39 158 120" fill="#17152d" stroke="#c4b5fd" strokeOpacity=".5" strokeWidth="2" />
                        <path d="M176 170c0-57 32-96 77-96s77 39 77 96v41H176z" fill="#f3a5a5" />
                        <path d="M168 171c3-66 37-111 89-111 47 0 75 37 78 89-20-4-38-16-53-33-19 27-59 46-114 55" fill="#23143b" />
                        <path d="M218 179h2m59 0h2" stroke="#312445" strokeLinecap="round" strokeWidth="8" />
                        <path d="M233 206c11 9 23 9 34 0" fill="none" stroke="#9f466c" strokeLinecap="round" strokeWidth="4" />
                        <path d="M124 103l12-20m227 67 22-4M108 216l19 8m218-145 5-18" stroke="#f9a8d4" strokeLinecap="round" strokeWidth="5" />
                      </svg>
                      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md">
                        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200">Illustration portfolio</p>
                        <p className="mt-1 text-sm text-white">Ideas, characters & visual stories</p>
                      </div>
                    </div>
                  ) : (
                  <div className={`relative lg:left-12 z-10 w-full opacity-90 transform transition-transform duration-500 ${
                    isHovering ? "scale-105" : "scale-100"
                  }`}>
                    <img
                      src="Animation1.gif"
                      alt="Developer Animation"
                      className={`w-full h-full object-contain transition-all duration-500 ${
                        isHovering 
                          ? "scale-[95%] sm:scale-[90%] md:scale-[90%] lg:scale-[90%] rotate-2" 
                          : "scale-[90%] sm:scale-[80%] md:scale-[80%] lg:scale-[80%]"
                      }`}
                    />
                  </div>
                  )}

                  <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    isHovering ? "opacity-50" : "opacity-20"
                  }`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                      isHovering ? "scale-110" : "scale-100"
                    }`}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Home);