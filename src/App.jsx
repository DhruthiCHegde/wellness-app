import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Activity,
  Wallet,
  Brain,
  Leaf,
  Coffee,
  Phone,
  TrendingUp,
  Car,
  DollarSign,
  Calendar,
  Utensils,
  Dumbbell,
  Stethoscope,
  CheckCircle,
  Menu,
  X,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Milestone,
  Megaphone,
  Orbit, // Renamed FamilySupport to a standard Lucide equivalent Orbit or Users
  Trophy
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from './data.json';

gsap.registerPlugin(ScrollTrigger);

// --- Icon Mapping ---
// Maps string names from JSON to actual Lucide component references
const iconMap = {
  Heart, Activity, Wallet, Brain, Leaf, Coffee, Phone,
  TrendingUp, Car, DollarSign, Calendar, Utensils,
  Dumbbell, Stethoscope, CheckCircle, ShieldCheck,
  StarAward: Award, Milestone, Megaphone, FamilySupport: Orbit
};

const getThemeClasses = (categoryKey) => {
  return { text: 'text-[#00FFAB]', bg: 'bg-[#00FFAB]/10', icon: 'text-[#00FFAB]', hover: 'group-hover:bg-[#00FFAB]/20' };
};

// --- Animated Components ---

const MagneticButton = ({ children, className, onClick, ...props }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const navItem = button;

    const handleMouseMove = (e) => {
      const rect = navItem.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - h;

      gsap.to(navItem, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 1,
        ease: 'power4.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(navItem, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    navItem.addEventListener('mousemove', handleMouseMove);
    navItem.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      navItem.removeEventListener('mousemove', handleMouseMove);
      navItem.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const RevealText = ({ text, className, containerRef, scrollerRef, scrollSnapDelay = 0 }) => {
  const textRef = useRef(null);

  useGSAP(() => {
    if (!textRef.current || !containerRef.current || !scrollerRef?.current) return;

    const chars = textRef.current.querySelectorAll('.char');

    gsap.fromTo(chars,
      {
        y: 100,
        opacity: 0,
        rotateX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scrollerRef.current,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={textRef} className={`perspective-1000 ${className} py-2`} style={{ perspective: '1000px' }}>
      {text.split('').map((char, index) => (
        <span key={index} className="char inline-block" style={{ transformOrigin: 'top center', paddingBottom: '0.1em' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
    // <></>
  );
};

// --- Components ---

const Modal = ({ isOpen, onClose, data }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    if (isOpen && data) {
      gsap.to(modalRef.current, { opacity: 1, duration: 0.4, ease: 'power3.out', pointerEvents: 'auto' });
      gsap.fromTo(contentRef.current,
        { y: 50, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.1 }
      );
    } else if (modalRef.current) {
      gsap.to(modalRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', pointerEvents: 'none' });
    }
  }, [isOpen, data]);

  if (!data) return null;

  // Dynamically resolve the URL: use specific item URL if present, else fallback
  const url = data.item.policy_url || content.common_url.policyUrl;
  const policyIconImg = data.item.policyIconImg || "privacy-policy.gif";
  const policyIconName = data.item.policyIconName || "View detailed policy";

  return (
    <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 opacity-0 pointer-events-none">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onClose}></div>

      {/* Main Modal container with 3D entry animation */}
      <div ref={contentRef} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl hide-scrollbar" style={{ opacity: 0 }}>

        {/* Sticky Close Button - Inside the container, pinned to the top right intersection */}
        <div className="sticky top-6 z-[1000] flex justify-end px-6 md:px-8 pointer-events-none h-0">
          <button onClick={onClose} className="pointer-events-auto w-12 h-12 flex items-center justify-center shrink-0 border border-zinc-700/50 bg-black/80 hover:bg-black text-white rounded-full backdrop-blur-xl transition-all hover:scale-110 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
            <X className="w-6 h-6 shrink-0" />
          </button>
        </div>

        <div className="h-64 md:h-96 w-full relative group overflow-hidden">
          <img src={data.item.image} alt={data.item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-8 right-8 flex flex-row justify-between items-end gap-4">
            <div className="flex-1 pr-4">
              <h2 className="font-playfair text-3xl md:text-5xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-2 pb-1">{data.item.title}</h2>
              <p className={`text-base md:text-lg font-bold ${data.theme.text}`}>{renderTextWithLinks(data.item.desc, data.theme.text)}</p>
            </div>
            {/* Animated Policy Link Pinned to Image overlay */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative w-12 h-12 md:w-16 md:h-16 shrink-0 transition-all duration-300 hover:scale-110 md:mb-2 hover:-translate-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={policyIconImg}
                alt="Policy Information"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_8px_20px_rgba(0,255,171,0.6)] transition-all duration-300"
              />
              {/* Tooltip */}
              <span className="absolute top-[100%] left-1/3 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-zinc-900 border border-[#00FFAB]/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none z-20">
                {policyIconName}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-t border-l border-[#00FFAB]/30 rotate-45 transform"></span>
              </span>
            </a>
          </div>
        </div>

        <div className="p-8 md:p-12 text-zinc-300 space-y-8">
          {data.item.title !== 'Rewards & Recognition' && (
            <div className="prose prose-invert prose-lg max-w-none font-light leading-relaxed">
              <p>{renderTextWithLinks(data.item.modalDetails?.fullDescription || data.item.desc, data.theme.text)}</p>
            </div>
          )}

          {data.item.modalDetails?.gallery && (
            <div className="grid grid-cols-2 gap-4 mt-8">
              {data.item.modalDetails.gallery.map((img, i) => (
                <img key={i} src={img} alt="" className="rounded-2xl object-cover h-48 w-full hover:scale-[1.02] transition-transform duration-300 shadow-lg" />
              ))}
            </div>
          )}

          {data.item.modalDetails?.bulletPoints && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {data.item.modalDetails.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
                  <CheckCircle className={`w-6 h-6 shrink-0 ${data.theme.text} mt-0.5`} />
                  <span className="font-medium text-zinc-200">{renderTextWithLinks(point, data.theme.text)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const renderTextWithLinks = (text, themeClass) => {
  if (!text) return null;
  // Match URLs starting with http:// or https:// or simple domain names like fyers.ethika.in
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, i) => {
    if (part && part.match(/^https?:\/\/[^\s]+$/)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      // Remove https:// or http:// for clean display
      const displayString = part.replace(/^https?:\/\//, '');
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`font-bold underline underline-offset-4 ${themeClass || 'text-white'} hover:opacity-80 transition-opacity whitespace-normal break-all`}
        >
          {displayString}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const SectionHeader = ({ title, subtitle, color, containerRef, scrollerRef }) => (
  <div className="mb-0 md:mb-0 text-center overflow-hidden pb-4">
    <RevealText
      text={title}
      containerRef={containerRef} scrollerRef={scrollerRef} className={`font-playfair text-4xl sm:text-5xl md:text-6xl font-bold mb-2 md:mb-6 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent pb-2 leading-relaxed`} />
    {/* <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto subtitle-reveal opacity-0 translate-y-8">{subtitle}</p> */}
  </div>
);

const BenefitCard = ({ item, theme, index, onClick }) => {
  const cardRef = useRef(null);
  const Icon = iconMap[item.iconName] || CheckCircle;

  // GSAP 3D Hover Tilt Effect
  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        ease: 'power3.out',
        duration: 0.5
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'elastic.out(1, 0.3)',
        duration: 1.2
      });
    };

    if (window.matchMedia("(min-width: 768px)").matches) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(item, theme)}
      className="benefit-card opacity-0 translate-y-12 cursor-pointer h-[350px] md:h-[450px] rounded-3xl transition-all flex flex-col items-start group relative overflow-hidden shadow-lg hover:shadow-2xl border border-[#00FFAB]/20 bg-zinc-950/40 backdrop-blur-xl hover:border-[#00FFAB]/50"
      style={{ transitionDuration: '0.8s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', perspective: '1000px' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
        style={{ backgroundImage: `url(${item.image})` }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30 group-hover:via-zinc-950/50 transition-all duration-500"></div>

      <div className="relative z-10 p-8 h-full flex flex-col w-full">
        <div className={`p-4 rounded-2xl mb-auto self-start ${theme.text} bg-zinc-950/50 backdrop-blur-md border border-[#00FFAB]/20 transition-colors duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon size={28} />
        </div>
        <div className="mt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="font-playfair font-semibold text-2xl bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-2 pb-1">{item.title}</h3>
          <p className="text-zinc-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {item.desc.split(/(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g).map((part, i) => {
              if (part.match(/^(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)$/)) {
                const href = part.startsWith('http') ? part : `https://${part}`;
                return (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                    className={`font-semibold underline underline-offset-2 ${theme.text} hover:opacity-80 transition-opacity`}
                  >
                    {part}
                  </a>
                );
              }
              return part;
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ categoryKey, scrollerRef, onCardClick, isModalOpen }) => {
  const data = content[categoryKey];
  const theme = getThemeClasses(categoryKey);
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(450);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef({ x: 0, rotation: 0 });


  const totalItems = data.benefits.length;
  const angle = 360 / totalItems;

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 260 : 450);
    };
    handleResize(); // init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play Carousel Loop
  useEffect(() => {
    // Pause auto-rotation if the user is interacting
    if (isDragging || isHovered || isModalOpen) return;

    const intervalId = setInterval(() => {
      setRotation(r => r - angle);
    }, 3000); // spins every 3 seconds

    return () => clearInterval(intervalId);
  }, [isDragging, isHovered, angle, isModalOpen]);

  const next = () => setRotation(r => r - angle);
  const prev = () => setRotation(r => r + angle);

  const handlePointerDown = (e) => {
    // Restrict drag-to-spin to mobile and touch screens only
    if (window.innerWidth >= 1024 || e.pointerType === 'mouse') return;

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, rotation: rotation };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    // Multiplier for drag sensitivity (drag left spins cylinder left, i.e. items move right)
    setRotation(dragStartRef.current.rotation + (deltaX * 0.4));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest item
    setRotation(r => Math.round(r / angle) * angle);
  };

  // Determine active item to highlight it and enable pointers
  const normalizedActiveIndex = Math.round(((-rotation % 360) + 360) % 360 / angle) % totalItems;

  useGSAP(() => {
    if (!containerRef.current || !scrollerRef?.current) return;

    // Stagger reveal for subtitle and benefit cards
    gsap.to('.subtitle-reveal', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: scrollerRef.current,
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      }
    });

    gsap.to('.benefit-card', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.1,
      ease: 'expo.out',
      delay: 0.2, // slight delay after title/subtitle
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: scrollerRef.current,
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      }
    });

    if (categoryKey === 'rewards') {
      gsap.fromTo('.footer-text-anim',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.1,
          ease: 'expo.out',
          delay: 0.5,
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: scrollerRef.current,
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id={categoryKey} className={`snap-start min-h-screen w-full flex flex-col justify-center shrink-0 pt-16 md:pt-20 pb-6 md:pb-10 bg-transparent relative overflow-hidden`}>
      {/* Gradient Transitions */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FFAB]/30 to-violet-500/30 opacity-70"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#00FFAB]/5 to-transparent blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center -translate-y-8 md:-translate-y-16">
        <div className="w-full mb-8 md:mb-16">
          <SectionHeader
            title={data.title}
            subtitle={data.subtitle}
            color={theme.text}
            containerRef={containerRef}
            scrollerRef={scrollerRef}
          />
        </div>

        {/* 3D Infinite Circular Carousel */}
        <div
          className="relative w-full h-[500px] md:h-[400px] mt-2 md:mt-8 flex items-center justify-center touch-pan-y md:cursor-default"
          style={{ perspective: '2000px' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={(e) => { setIsHovered(false); handlePointerUp(e); }}
          onMouseEnter={() => setIsHovered(true)}
        >
          {/* Left Navigation Arrow */}
          <button
            onClick={prev}
            className="absolute left-0 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-xl rounded-full flex items-center justify-center border border-zinc-700/50 hover:border-[#00FFAB]/50 text-white shadow-2xl transition-all hover:scale-110 group"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* 3D Cylinder System */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              // The cylinder is pushed backwards so the active front card stays perfectly in focus at Z=0
              transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            {data.benefits.map((item, index) => {
              const itemAngle = index * angle;
              const isFront = index === normalizedActiveIndex;

              // Calculate shortest distance in slots from current active index
              let diff = index - normalizedActiveIndex;
              if (diff > totalItems / 2) diff -= totalItems;
              if (diff < -totalItems / 2) diff += totalItems;

              // Add a gap on the left and right side of the current card if total items > 6
              let gapOffset = 0;
              if (totalItems > 6 && !isFront) {
                // Push right-sided cards further right, left-sided cards further left
                gapOffset = diff > 0 ? 120 : -120;
              }

              return (
                <div
                  key={index}
                  className="absolute w-[70vw] sm:w-[350px] md:w-[450px]"
                  style={{
                    // Each card orbits around the central cylinder point
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) translateX(${gapOffset}px)`,
                    opacity: isFront ? 1 : 0.3,
                    filter: isFront ? 'blur(0px)' : 'blur(4px)',
                    pointerEvents: isFront ? 'auto' : 'none',
                    transition: 'all 0.8s ease'
                  }}
                >
                  <BenefitCard
                    index={index}
                    item={item}
                    theme={theme}
                    onClick={(item, theme) => {
                      onCardClick(item, theme);
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={next}
            className="absolute right-0 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-xl rounded-full flex items-center justify-center border border-zinc-700/50 hover:border-[#00FFAB]/50 text-white shadow-2xl transition-all hover:scale-110 group"
            aria-label="Next card"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12 z-20">
          {data.benefits.map((_, index) => {
            // Calculate shortest path rotation when a dot is clicked
            let targetRotation = -index * angle;
            // Adjust smoothly from current rotation
            const currentMod = ((rotation % 360) + 360) % 360;
            const diff = (targetRotation % 360 + 360) % 360 - currentMod;
            let finalDiff = diff;
            if (diff > 180) finalDiff -= 360;
            if (diff < -180) finalDiff += 360;

            return (
              <button
                key={index}
                onClick={() => setRotation(r => r + finalDiff)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-700 backdrop-blur-md ${normalizedActiveIndex === index
                  ? 'w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                  : 'w-2 bg-white/20 hover:bg-white/50 cursor-pointer'
                  }`}
              />
            )
          })}
        </div>

      </div>

      {categoryKey === 'rewards' && (
        <footer className="absolute bottom-0 left-0 w-full text-white flex flex-col justify-center items-center shrink-0 z-20 pointer-events-none">
          <div className="footer-text-anim pb-4 text-sm text-zinc-600 font-medium tracking-wide text-center pointer-events-auto">
            <p>Copyright © FYERS Securities Private Limited.</p>
            {/* <p className="mt-1 text-xs opacity-75">360° Wellness Platform</p> */}
          </div>
        </footer>
      )}
    </section>
  );
};

// --- Main App Component ---

const OverviewSection = ({ scrollerRef, onNavigate }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current || !scrollerRef?.current) return;

    gsap.fromTo('.overview-card', {
      opacity: 0,
      scale: 0.95
    }, {
      opacity: 1,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: scrollerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }, { scope: containerRef });

  return (
    <section id="overview" ref={containerRef} className="snap-start min-h-screen w-full relative flex flex-col items-center justify-center shrink-0 bg-zinc-950 py-0 md:py-0 overflow-hidden border-b border-zinc-900">
      {/* Subtle parallax background elements */}
      <div className="parallax-bg absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0"></div>
      <div className="parallax-bg absolute bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-0 md:mt-0">
        {/* <SectionHeader
          title=""
          subtitle="We support every dimension of your life with comprehensive benefits."
          color="text-white"
          containerRef={containerRef}
          scrollerRef={scrollerRef}
        /> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10 lg:mt-10">
          {['physical', 'mental', 'financial'].map((key, index) => {
            const catData = content[key];
            const theme = getThemeClasses(key);
            const overviewImages = {
              physical: "https://hr-assets.fyers.co.in/kettlebell-fitness-still-life.jpg",
              mental: "https://hr-assets.fyers.co.in/wellness-practices-self-care-world-health-day.jpg",
              financial: "https://hr-assets.fyers.co.in/photorealistic-money-with-plant.jpg"
            };
            const bgImage = overviewImages[key];
            const delayClass = `animation-delay-${((index * 2000) % 4000) || 1000}`; // simple stagger for 3 items

            return (
              <div key={key} className={`animate-float-small ${delayClass} h-full`}>
                <div
                  onClick={() => onNavigate(key)}
                  className="overview-card group cursor-pointer border border-[#00FFAB]/20 bg-zinc-950/40 p-8 lg:p-10 rounded-3xl hover:border-[#00FFAB]/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,255,171,0.1)] relative overflow-hidden h-[400px] md:h-[450px]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  ></div>

                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-zinc-950/60 group-hover:bg-zinc-950/40  transition-colors duration-500"></div>

                  <div className={`absolute top-0 right-0 w-48 h-48 ${theme.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-30 group-hover:opacity-60 transition-opacity duration-700`}></div>

                  <div className="relative z-10 w-full h-full flex flex-col justify-end">
                    <h3 className="font-playfair text-3xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-4 pb-1 transition-all duration-500 group-hover:text-white group-hover:from-white group-hover:to-white">{catData.title}</h3>
                    <p className="text-zinc-300 text-base leading-relaxed mb-8 transform transition-transform duration-500 group-hover:translate-x-2">{catData.subtitle}</p>
                    <div className={`flex items-center gap-2 text-sm font-bold ${theme.text} uppercase tracking-wider`}>
                      Explore Benefits <ArrowUp className="w-5 h-5 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('physical');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollerReady, setScrollerReady] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollContainerRef = useRef(null);
  const homeRef = useRef(null);

  const handleCardClick = (item, theme) => {
    setSelectedCard({ item, theme });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedCard(null);
    }, 400); // Wait for exit animation
  };

  useEffect(() => {
    setScrollerReady(true);

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;

        // Dynamically get all sections
        const sectionNodes = Array.from(scrollContainerRef.current.querySelectorAll('.snap-start'));
        const sections = sectionNodes.map(node => node.id).filter(Boolean);

        // Auto-update active tab based on scroll position
        for (const id of [...sections].reverse()) {
          const el = document.getElementById(id);
          if (el && scrollTop >= el.offsetTop - 300) {
            setActiveTab(id === 'home' ? 'physical' : id);
            break;
          }
        }

        scrollContainerRef.current.lastScrollTop = scrollTop;
        setShowBackToTop(scrollTop > 500);
      }
    };

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (section) => {
    setActiveTab(section);
    const element = document.getElementById(section);
    if (element && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setActiveTab('home'); // Reset tab state
    }
  };

  // Navbar Logo Floating Effect
  useGSAP(() => {
    if (!scrollContainerRef.current || !homeRef.current) return;
    const scroller = scrollContainerRef.current;
    gsap.to('.nav-logo', {
      y: -5,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Hero Staggered Entrance Choreography
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.fromTo('.hero-tag',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo('.hero-title-word',
        { opacity: 0, y: 30, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', transformPerspective: 800 },
        "-=0.5"
      )
      .fromTo('.hero-body',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        "-=0.8"
      )
      .fromTo('.hero-cta',
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.5)' },
        "-=1.0"
      );

    // After entrance choreography finishes, start continuous ambient floating motion
    heroTl.eventCallback("onComplete", () => {
      gsap.to('.hero-tag', {
        y: "-=8",
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
      gsap.to('.hero-title-word', {
        y: "-=10",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.1
      });
      gsap.to('.hero-body', {
        y: "-=6",
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
      gsap.to('.hero-cta', {
        y: "-=5",
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      // Classic ECG Monitor Trace
      gsap.fromTo('.ecg-line',
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 8.5, ease: "none", repeat: -1 }
      );
    });

    // 3D Mouse Parallax & Tilt Effect for Hero Content
    const homeElement = homeRef.current;
    let cleanup = () => { };
    if (homeElement && window.matchMedia("(min-width: 768px)").matches) {
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 15;
        const y = (clientY / window.innerHeight - 0.5) * 15;

        gsap.to('.hero-content', {
          rotateY: x,
          rotateX: -y,
          duration: 1,
          ease: 'power2.out',
          transformPerspective: 1000,
          transformOrigin: "center center"
        });

        // Sub-element parallax for depth
        gsap.to('.hero-tag', { x: x * 1.5, y: y * 1.5, duration: 1, ease: 'power2.out' });
        gsap.to('.hero-title-word', { x: x * 0.8, y: y * 0.8, duration: 1, ease: 'power2.out' });
        gsap.to('.hero-body', { x: -x * 0.5, y: -y * 0.5, duration: 1, ease: 'power2.out' });
        gsap.to('.hero-cta', { x: -x * 1.2, y: -y * 1.2, duration: 1, ease: 'power2.out' });
      };

      const handleMouseLeave = () => {
        gsap.to(['.hero-content', '.hero-tag', '.hero-title-word', '.hero-body', '.hero-cta'], {
          rotateY: 0,
          rotateX: 0,
          x: 0,
          y: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.3)'
        });
      };

      homeElement.addEventListener('mousemove', handleMouseMove);
      homeElement.addEventListener('mouseleave', handleMouseLeave);

      cleanup = () => {
        homeElement.removeEventListener('mousemove', handleMouseMove);
        homeElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    // Scroll-Driven Parallax for Background Glows (Move Slower than Foreground)
    if (scroller && homeRef.current) {
      gsap.to('.hero-glow-1', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: homeRef.current,
          scroller: scroller,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('.hero-glow-2', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: homeRef.current,
          scroller: scroller,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    return cleanup;
  }, { scope: scrollContainerRef });

  return (
    <>
      <div id="main-scroller" ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth font-sans text-zinc-100 bg-zinc-950 hide-scrollbar selection:bg-emerald-500/30">

        {/* Hero Section */}
        <div id="home" ref={homeRef} className="snap-start min-h-screen w-full relative text-white flex flex-col items-center justify-center overflow-hidden shrink-0 pt-20 sm:pt-24 border-b border-zinc-900 bg-zinc-950">

          {/* Logos in Hero Section */}
          <div className="absolute top-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-50 pointer-events-none">
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <div className="flex items-center gap-3 cursor-pointer nav-logo w-fit text-white hover:text-emerald-400 transition-colors" onClick={() => scrollToSection('home')}>
                {/*<img src="/fyers.jpeg" alt="Fyers Logo" className="h-8 md:h-10 w-auto rounded-md object-contain" />*/}
                <div className="flex items-center gap-[3px] shrink-0">
                  <svg className="h-10 md:h-12 w-auto" viewBox="47.166 110.056 226.693 377.333" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M47.166 110.056H273.859V487.389L222.67 404.619V284.116H151.981L117.855 229.342H222.67V181.871H88.6044L47.166 110.056Z" fill="currentColor" />
                  </svg>
                  <svg className="h-10 md:h-12 w-auto" viewBox="292.14 110.056 226.693 377.333" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M518.833 110.056H292.14V487.389L343.329 404.619V284.116H414.017L446.924 229.342H343.329V181.871H477.393L518.833 110.056Z" fill="currentColor" />
                  </svg>
                </div>

                {/* <span className="font-sans text-2xl md:text-2xl font-bold tracking-tight whitespace-nowrap">360° Wellness</span> */}
              </div>
              <div className="nav-logo w-fit cursor-pointer group">
                <img src="/GPW.jpeg" alt="Great Place To Work" className="w-14 md:w-16 h-auto object-contain rounded-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
          </div>

          {/* Ambient Motion: Moving Mesh Gradient replacing the video */}
          <div className="absolute inset-0 z-0 opacity-50 mix-blend-screen pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
            <div className="hero-glow-1 absolute top-[10%] left-[20%] w-[80vw] md:w-[40vw] h-[80vw] md:h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#00FFAB]/30 blur-[60px] md:blur-[100px] animate-blob"></div>
            <div className="hero-glow-2 absolute top-[30%] right-[10%] w-[70vw] md:w-[35vw] h-[70vw] md:h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[#172BFE]/30 blur-[60px] md:blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="hero-glow-1 absolute bottom-[10%] left-[40%] w-[90vw] md:w-[45vw] h-[90vw] md:h-[45vw] max-w-[700px] max-h-[700px] rounded-full bg-violet-600/30 blur-[80px] md:blur-[120px] animate-blob animation-delay-4000"></div>

            {/* Classic ECG Background Animation */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
              <svg width="100%" height="100%" viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-48 drop-shadow-[0_0_10px_rgba(0,255,171,0.5)]">
                <defs>
                  <linearGradient id="ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00FFAB" stopOpacity="0" />
                    <stop offset="20%" stopColor="#00bb7dff" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="80%" stopColor="#172BFE" />
                    <stop offset="100%" stopColor="#172BFE" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="ecg-line"
                  pathLength="100"
                  d="M0,100 H170 L185,50 L200,0 L215,200 L230,100 H380 L390,80 L410,120 L420,100 H570 L585,50 L600,0 L615,200 L630,100 H780 L790,80 L810,120 L820,100 H970 L985,50 L1000,0 L1015,200 L1030,100 H1180 L1190,80 L1210,120 L1220,100 H1370 L1385,50 L1400,0 L1415,200 L1430,100 H1580 L1590,80 L1610,120 L1620,100 H1770 L1785,50 L1800,0 L1815,200 L1830,100 H2000"
                  fill="none"
                  stroke="url(#ecg-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ strokeDasharray: "15 85", strokeDashoffset: "100" }}
                />
              </svg>
            </div>
          </div>

          <div className="hero-content max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full pt-4 md:pt-8" style={{ transformStyle: 'preserve-3d' }}>
            {/*<div className="hero-tag inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-zinc-900/80 border border-zinc-700/50 mb-6 sm:mb-8 backdrop-blur-md shadow-2xl cursor-default opacity-0">
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-300">{content.hero.tag}</span>
            </div>*/}

            <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tight leading-[1.3] md:leading-[1.3]">
              <div className="flex justify-center flex-wrap gap-x-2 md:gap-x-4">
                {content.hero.title.split(' ').map((word, index) => (
                  <span key={index} className="hero-title-word inline-block opacity-0 px-1 pb-2 md:pb-4" style={{ backgroundImage: 'linear-gradient(to right, #fff 50%, #4a4a5a 50%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', transition: 'background-position 1.5s cubic-bezier(0.16, 1, 0.3, 1)', backgroundPosition: '100% 0' }} ref={(el) => { if (el) setTimeout(() => el.style.backgroundPosition = '0 0', 500 + (index * 100)) }}>
                    {word}
                  </span>
                ))}
              </div>
              <div className="mt-1 md:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 font-playfair italic hero-title-word opacity-0 px-1 pb-2 md:pb-4">
                {content.hero.highlight}
              </div>
            </h1>

            <p className="hero-body text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed font-light opacity-0 px-2 sm:px-0">
              {content.hero.subtitle}
            </p>

            <div className="hero-cta opacity-0 flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-4">
              <MagneticButton
                onClick={() => scrollToSection('overview')}
                className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 font-bold text-zinc-950 bg-[#00FFAB] rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_4px_20px_rgba(0,255,171,0.2)] hover:shadow-[0_8px_40px_rgba(0,255,171,0.4)] duration-300 text-base sm:text-lg border border-[#00FFAB]/50"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease"></div>
                <span className="relative z-10 mr-2 transition-colors duration-300">{content.hero.cta}</span>
                <svg className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-all duration-300 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </MagneticButton>
              <MagneticButton
                onClick={() => scrollToSection('rewards')}
                className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 font-bold text-zinc-950 bg-[#00FFAB] rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_4px_20px_rgba(0,255,171,0.2)] hover:shadow-[0_8px_40px_rgba(0,255,171,0.4)] duration-300 text-base sm:text-lg border border-[#00FFAB]/50"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease"></div>
                <span className="relative z-10 mr-2 transition-colors duration-300">Explore Rewards & Recognition</span>
                <svg className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-all duration-300 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </MagneticButton>
            </div>

          </div>
        </div>

        {/* Dynamic Content Sections */}
        {scrollerReady && (
          <>
            <OverviewSection scrollerRef={scrollContainerRef} onNavigate={scrollToSection} />
            <CategorySection categoryKey="physical" scrollerRef={scrollContainerRef} onCardClick={handleCardClick} isModalOpen={isModalOpen} />
            <CategorySection categoryKey="mental" scrollerRef={scrollContainerRef} onCardClick={handleCardClick} isModalOpen={isModalOpen} />
            <CategorySection categoryKey="financial" scrollerRef={scrollContainerRef} onCardClick={handleCardClick} isModalOpen={isModalOpen} />
            <CategorySection categoryKey="rewards" scrollerRef={scrollContainerRef} onCardClick={handleCardClick} isModalOpen={isModalOpen} />
          </>
        )}

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className={`fixed bottom-8 right-8 p-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.5)] transition-all duration-300 z-50 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        >
          <ArrowUp className="w-6 h-6 stroke-[2.5]" />
        </button>

      </div>

      {/* Detail Modal Component */}
      <Modal isOpen={isModalOpen} onClose={closeModal} data={selectedCard} />
    </>
  );
}

export default App;