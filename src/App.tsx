/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Ticket, Globe, Zap, Music, MapPin, Menu, X, Calendar, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import type { Artist } from '../types';
import Logo from './assets/Logo.png';

// Dummy Data
const LINEUP: Artist[] = [
  { 
    id: '1', 
    name: 'Neural Forge', 
    genre: 'Generative AI', 
    day: 'TRACK 01', 
    image: 'https://images.pexels.com/photos/26887007/pexels-photo-26887007.jpeg',
    description: 'We design and deploy large-scale generative AI systems — from fine-tuned LLMs to multimodal pipelines — that transform raw data into intelligent, production-ready products.'
  },
  { 
    id: '2', 
    name: 'DataStream', 
    genre: 'Data Engineering', 
    day: 'TRACK 01', 
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Real-time data pipelines, ETL architecture, and lakehouse design at enterprise scale. We turn noisy, fragmented data into a single source of truth your teams can act on.'
  },
  { 
    id: '3', 
    name: 'CloudAxis', 
    genre: 'Cloud Infrastructure', 
    day: 'TRACK 02', 
    image: 'https://images.pexels.com/photos/6153741/pexels-photo-6153741.jpeg',
    description: 'Multi-cloud architecture, Kubernetes orchestration, and zero-downtime deployments. We build resilient infrastructure that scales with your ambition and shrinks your AWS bill.'
  },
  { 
    id: '4', 
    name: 'Cipher Lab', 
    genre: 'Cybersecurity & DevSecOps', 
    day: 'TRACK 02', 
    image: 'https://images.pexels.com/photos/14589883/pexels-photo-14589883.jpeg',
    description: 'Threat modelling, penetration testing, and shift-left security baked into every sprint. We harden your stack so your team ships fast without compromising on safety.'
  },
  { 
    id: '5', 
    name: 'Synapse UX', 
    genre: 'Product & Design', 
    day: 'TRACK 03', 
    image: 'https://images.pexels.com/photos/8380086/pexels-photo-8380086.jpeg',
    description: 'Human-centred design meets engineering precision. We craft interfaces that feel inevitable — from discovery workshops and wireframes to pixel-perfect, accessible frontends.'
  },
  { 
    id: '6', 
    name: 'Quantum Ops', 
    genre: 'MLOps & Automation', 
    day: 'TRACK 03', 
    image: 'https://images.unsplash.com/photo-1543906965-f9520aa2ed8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'End-to-end ML lifecycle management — model registry, CI/CD for AI, drift detection, and automated retraining. We keep your models sharp long after launch day.'
  },
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Custom');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sent'>('idle');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    timeline: '',
    preferredDate: '',
    details: '',
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  // Handle keyboard navigation for artist modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtist && !isContactOpen) return;
      if (e.key === 'ArrowLeft' && selectedArtist) navigateArtist('prev');
      if (e.key === 'ArrowRight' && selectedArtist) navigateArtist('next');
      if (e.key === 'Escape') {
        if (selectedArtist) {
          setSelectedArtist(null);
        }
        if (isContactOpen) {
          closeContactModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtist, isContactOpen]);

  useEffect(() => {
    document.body.style.overflow = isContactOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isContactOpen]);

  const closeContactModal = () => {
    setIsContactOpen(false);
    setContactStatus('idle');
  };

  const openContactModal = (plan: string) => {
    setSelectedPlan(plan);
    setContactStatus('idle');
    setIsContactOpen(true);
  };

  const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(prev => !prev);
  };

  const handleDateSelection = (value: string) => {
    handleContactChange('preferredDate', value);
    setIsDatePickerOpen(false);
  };

  const handleContactChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `Dialektika inquiry — ${selectedPlan}`;
    const body = [
      'Hi Dialektika,',
      '',
      `Name: ${contactForm.name}`,
      `Email: ${contactForm.email}`,
      `Company: ${contactForm.company || 'Not provided'}`,
      `Preferred timeline: ${contactForm.timeline || 'To be discussed'}`,
      `Preferred date: ${contactForm.preferredDate || 'To be discussed'}`,
      '',
      'Project details:',
      contactForm.details || 'No additional details provided.',
      '',
      'Thanks!',
    ].join('\n');

    const mailtoLink = `mailto:ayushsr0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setContactStatus('sent');
  };

  useEffect(() => {
    if (contactForm.preferredDate) {
      const [year, month] = contactForm.preferredDate.split('-').map(Number);
      setCalendarMonth(new Date(year, month - 1, 1));
    }
  }, [contactForm.preferredDate]);

  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const daysBeforeMonth = (firstDay + 6) % 7;
  const totalCells = Math.ceil((daysBeforeMonth + daysInMonth) / 7) * 7;
  const calendarDays = Array.from({ length: totalCells }, (_, index) => {
    const dayOffset = index - daysBeforeMonth + 1;
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayOffset);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      inCurrentMonth: date.getMonth() === calendarMonth.getMonth(),
      value: toDateInputValue(date),
    };
  });
  const todayValue = toDateInputValue(new Date());

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateArtist = (direction: 'next' | 'prev') => {
    if (!selectedArtist) return;
    const currentIndex = LINEUP.findIndex(a => a.id === selectedArtist.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % LINEUP.length;
    } else {
      nextIndex = (currentIndex - 1 + LINEUP.length) % LINEUP.length;
    }
    setSelectedArtist(LINEUP[nextIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">
          <img src={Logo} alt="Logo" className="w-24 h-24" />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-md font-bold tracking-widest uppercase">
          {['About', 'Services', 'Projects'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#a8fbd3] transition-colors text-slate-700 cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        <button 
          onClick={() => openContactModal('Discovery Call')}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          Book a Call
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#31326f]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['About', 'Services', 'Projects'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-4xl font-heading font-bold text-white hover:text-[#a8fbd3] transition-colors uppercase bg-transparent border-none"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => openContactModal('Discovery Call')}
              className="mt-8 border border-white px-10 py-4 text-sm font-bold tracking-widest uppercase bg-white text-black"
            >
              Book a Call
            </button>
            
            <div className="absolute bottom-10 flex gap-6">
               <a href="https://x.com/GoogleAIStudio" className="text-white/50 hover:text-white transition-colors">Twitter</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
           {/* Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-base font-mono text-[#a8fbd3] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <span>Thesis</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>Antithesis</span>
             <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>Synthesis</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text="DIALEKTIKA" 
              as="h1" 
              className="text-[11vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter text-center" 
            />
            {/* Optimized Orb - Reduced Blur for Performance */}
            <motion.div 
               className="absolute -z-20 w-[50vw] h-[50vw] bg-white/5 blur-[40px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 6, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-4 md:mt-8 mb-6 md:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-2xl font-light max-w-xl mx-auto text-white/90 leading-relaxed drop-shadow-lg px-4"
          >
            AI for EQ
          </motion.p>
        </motion.div>

        {/* MARQUEE - SLOWED DOWN for Performance & Aesthetics */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-black shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {/* Duplicate content for seamless loop */}
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    DIALEKTIKA <span className="text-black text-2xl md:text-4xl">●</span> 
                    AI FOR EQ <span className="text-black text-2xl md:text-4xl">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section id="about" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
             <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg break-words w-full md:w-auto">
              About <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {LINEUP.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => setSelectedArtist(artist)} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="projects" className="relative z-10 py-20 md:py-32 bg-black/20 backdrop-blur-sm border-t border-white/10 overflow-hidden">
        {/* Decorative blurred circle - Optimized */}
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-[#4fb7b3]/20 rounded-full blur-[40px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                Beyond <br/> <GradientText text="REALITY" className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-12 font-light leading-relaxed drop-shadow-md">
                Dialektika isnt just a company , its a philosophy of how things work , how things are made and how we act
              </p>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: Globe, title: 'Gradient Descent', desc: 'of AI works on same principle- adjusting weights & changing vectors' },
                  { icon: Zap, title: 'Dialectical Materialism', desc: 'Thesis, Synthesis and Antithesis the truth about answers of life' },
                  { icon: Music, title: 'Unix Philosophy', desc: 'Make each program do one thing well, then connect like lego bricks' },
                ].map((feature, i) => (
                  <div
                    key={i} 
                    className="flex items-start gap-6"
                  >
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[400px] md:h-[700px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-3xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" 
                  alt="Crowd" 
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-50">
                    AI
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                    AI Assistant
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK A CALL SECTION */}
      <section id="services" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-20 text-white">
               SERVICES
             </h2>
             <p className="text-[#a8fbd3] font-mono uppercase tracking-widest -mt-3 md:-mt-8 relative z-10 text-sm md:text-base">
               The Tech that you deserve
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '$999/mo', color: 'white', accent: 'bg-white/5' },
              { name: 'Growth', price: '$2,499/mo', color: 'teal', accent: 'bg-[#4fb7b3]/10 border-[#4fb7b3]/50' },
              { name: 'Enterprise', price: 'Custom', color: 'periwinkle', accent: 'bg-[#637ab9]/10 border-[#637ab9]/50' },
            ].map((ticket, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -20 }}
                className={`relative p-8 md:p-10 border border-white/10 backdrop-blur-md flex flex-col min-h-[450px] md:min-h-[550px] transition-colors duration-300 ${ticket.accent} will-change-transform`}
                data-hover="true"
              >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-white">{ticket.name}</h3>
                    <div className={`text-5xl md:text-6xl font-bold mb-8 md:mb-10 tracking-tighter ${ticket.color === 'white' ? 'text-white' : ticket.color === 'teal' ? 'text-[#4fb7b3]' : 'text-[#637ab9]'}`}>
                      {ticket.price}
                    </div>
                    <ul className="space-y-4 md:space-y-6 text-sm text-gray-200">
                      <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-gray-400" /> AI-powered web app</li>
                      <li className="flex items-center gap-3"><Globe className="w-5 h-5 text-gray-400" /> Cloud deployment & hosting</li>
                      {i > 0 && <li className="flex items-center gap-3 text-white"><Music className={`w-5 h-5 text-[#a8fbd3]`} /> Custom LLM integration</li>}
                      {i > 0 && <li className="flex items-center gap-3 text-white"><Zap className={`w-5 h-5 text-[#a8fbd3]`} /> Dedicated MLOps pipeline</li>}
                      {i > 1 && <li className="flex items-center gap-3 text-white"><MapPin className={`w-5 h-5 text-[#4fb7b3]`} /> On-site consulting & SLA</li>}
                      {i > 1 && <li className="flex items-center gap-3 text-white"><Calendar className={`w-5 h-5 text-[#4fb7b3]`} /> 24/7 priority support</li>}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => openContactModal(ticket.name)}
                    className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border border-white/20 transition-all duration-300 mt-8 group overflow-hidden relative text-white cursor-pointer hover:bg-white hover:text-black"
                  >
                    <span className="relative z-10">Book a Call</span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0" />
                  </button>

                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-center mt-3 text-white/40 font-mono"
                  >
                    We&apos;ll open your email app with a prefilled request.
                  </motion.p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeContactModal}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 py-4 sm:px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a]/95 p-4 sm:p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#a8fbd3]">Book a call</p>
                  <h3 className="text-3xl md:text-4xl font-heading font-bold mt-2">Tell us about your idea</h3>
                </div>
                <button
                  type="button"
                  onClick={closeContactModal}
                  className="rounded-full border border-white/20 p-2 text-white/70 transition-colors hover:text-white"
                  aria-label="Close contact form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* <p className="mt-4 text-sm text-gray-300">
                We&apos;ll open your email app with a prefilled request for info@dialektika.in.
              </p> */}

              {contactStatus === 'sent' ? (
                <div className="mt-6 rounded-2xl border border-[#a8fbd3]/40 bg-[#a8fbd3]/10 p-4 text-sm text-[#a8fbd3]">
                  Your draft is ready. Send it from your email app and we&apos;ll reach out shortly.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-200">Selected plan</label>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#a8fbd3]">
                      {selectedPlan}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-200">Name</label>
                    <input id="name" required value={contactForm.name} onChange={(event) => handleContactChange('name', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-gray-400" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-200">Email</label>
                    <input id="email" type="email" required value={contactForm.email} onChange={(event) => handleContactChange('email', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-gray-400" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-200">Company</label>
                    <input id="company" value={contactForm.company} onChange={(event) => handleContactChange('company', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-gray-400" placeholder="Optional" />
                  </div>
                  <div>
                    <label htmlFor="preferredDate" className="mb-2 block text-sm font-medium text-gray-200">Preferred date</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={toggleDatePicker}
                        className="flex min-h-[48px] w-full cursor-pointer items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white"
                      >
                        <span className={`flex-1 ${contactForm.preferredDate ? 'text-white' : 'text-gray-400'}`}>
                          {contactForm.preferredDate
                            ? new Date(`${contactForm.preferredDate}T00:00:00`).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Pick a date'}
                        </span>
                        <Calendar className="ml-3 h-4 w-4 shrink-0 text-[#a8fbd3]" />
                      </button>

                      {isDatePickerOpen && (
                        <div className="absolute z-10 mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl">
                          <div className="mb-3 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                              className="rounded-full p-1 text-gray-300 hover:bg-white/10"
                              aria-label="Previous month"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-semibold text-white">
                              {calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                              className="rounded-full p-1 text-gray-300 hover:bg-white/10"
                              aria-label="Next month"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.2em] text-gray-400">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                              <span key={day}>{day}</span>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map(({ key, date, inCurrentMonth, value }) => {
                              const isSelected = contactForm.preferredDate === value;
                              const isToday = value === todayValue;
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => handleDateSelection(value)}
                                  className={`h-8 rounded-full text-sm transition-colors ${
                                    !inCurrentMonth
                                      ? 'text-gray-500 hover:text-gray-300'
                                      : 'text-white hover:bg-white/10'
                                  } ${isSelected ? 'bg-[#a8fbd3] text-black' : ''} ${isToday && !isSelected ? 'ring-1 ring-[#4fb7b3]' : ''}`}
                                >
                                  {date.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="details" className="mb-2 block text-sm font-medium text-gray-200">What are you building?</label>
                    <textarea id="details" required rows={5} value={contactForm.details} onChange={(event) => handleContactChange('details', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-gray-400" placeholder="Tell us about the product, goals, and what you need help with." />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full rounded-2xl border border-[#a8fbd3]/40 bg-[#a8fbd3] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#8fe8c2]">
                      Send request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white">DIALEKTIKA</div>
             <div className="flex gap-2 text-sm font-mono text-gray-400">
             <span> contact us </span>
             <a
               href="info@dialektika.in"
               target="_blank"
               rel="noopener noreferrer"
               className="transition-colors hover:text-[#a8fbd3]"               
             >
               <span>info@dialektika.in</span>
             </a>
             </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Pulsing globe icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="text-[#4fb7b3]"
              >
                <Globe className="w-3 h-3" />
              </motion.div>

              {/* Gradient shimmer text */}
              <span
                className="text-xs font-mono uppercase tracking-widest font-bold"
                style={{
                  background: 'linear-gradient(90deg, #a8fbd3, #4fb7b3, #637ab9, #a8fbd3)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite',
                }}
              >
                Our Flagship Initiative
              </span>

              {/* Live blinking dot */}
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#a8fbd3] inline-block"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <a
              href="https://euindiaconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold uppercase text-sm tracking-widest cursor-pointer"
              data-hover="true"
              style={{
                background: 'linear-gradient(90deg, #003399, #6fa8dc, #ffffff, #FF9933, #FF6600)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              EU India Connect
            </a>
          </div>
        </div>
      </footer>

      {/* Artist Detail Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtist(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) navigateArtist('next');
                if (info.offset.x > 50) navigateArtist('prev');
              }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#1a1b3b] border border-white/10 overflow-y-auto overflow-x-hidden flex flex-col md:flex-row shadow-2xl shadow-[#4fb7b3]/10 group/modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArtist(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateArtist('prev'); }}
                className="absolute left-4 top-32 -translate-y-1/2 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm"
                data-hover="true"
                aria-label="Previous Artist"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateArtist('next'); }}
                className="absolute right-4 top-32 -translate-y-1/2 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm md:right-8"
                data-hover="true"
                aria-label="Next Artist"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedArtist.id}
                    src={selectedArtist.image} 
                    alt={selectedArtist.name} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div
                  key={selectedArtist.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#4fb7b3] mb-4">
                     <Calendar className="w-4 h-4" />
                     <span className="font-mono text-sm tracking-widest uppercase">{selectedArtist.day}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold uppercase leading-none mb-2 text-white break-words">
                    {selectedArtist.name}
                  </h3>
                  
                  <p className="text-lg text-[#a8fbd3] font-medium tracking-widest uppercase mb-6">
                    {selectedArtist.genre}
                  </p>
                  
                  <div className="h-px w-20 bg-white/20 mb-6" />
                  
                  <p className="text-gray-300 leading-relaxed text-lg font-light mb-8">
                    {selectedArtist.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;