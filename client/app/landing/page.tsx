'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaPlane,
  FaShieldAlt,
  FaRegLifeRing,
  FaUserFriends,
  FaBars,
  FaTimes,
  FaCheck,
} from 'react-icons/fa'; // Importing icons
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'; // Importing animation library
import { MdTranslate, MdTravelExplore, MdViewInAr } from 'react-icons/md';
import {
  HiSparkles,
  HiGlobe,
  HiChartBar,
  HiLightningBolt,
  HiCube,
  HiArrowRight,
} from 'react-icons/hi';
import { SiOpenai, SiFramer, SiVercel } from 'react-icons/si';

const pricingPlans = [
  {
    name: 'Explorer Buddy',
    nickname: 'Start Your Journey',
    price: 0,
    features: [
      { text: '20 AI Translations per month', included: true, icon: MdTranslate },
      { text: '3 AI Trip Generations', included: true, icon: MdTravelExplore },
      { text: '5 AR Landmark Explorations', included: true, icon: MdViewInAr },
      { text: 'Basic Trip Planning Tools', included: true },
      { text: 'Community Access', included: true },
      { text: 'Priority Support', included: false },
    ],
    ctaText: 'Start Exploring',
    popular: false,
  },
  {
    name: 'Wanderlust Buddy',
    nickname: 'Your Perfect Travel Partner',
    price: 199,
    features: [
      { text: '100 AI Translations per month', included: true, icon: MdTranslate },
      { text: '10 AI Trip Generations', included: true, icon: MdTravelExplore },
      { text: '20 AR Landmark Explorations', included: true, icon: MdViewInAr },
      { text: 'Advanced Trip Planning', included: true },
      { text: 'Community Access', included: true },
      { text: 'Priority Support', included: true },
    ],
    ctaText: 'Choose Your Buddy',
    popular: true,
  },
  {
    name: 'Globetrotter Buddy',
    nickname: 'Ultimate Travel Companion',
    price: 499,
    features: [
      { text: 'Unlimited AI Translations', included: true, icon: MdTranslate },
      { text: 'Unlimited Trip Generations', included: true, icon: MdTravelExplore },
      { text: 'Unlimited AR Explorations', included: true, icon: MdViewInAr },
      { text: 'Premium Trip Planning', included: true },
      { text: 'Priority Community Access', included: true },
      { text: '24/7 Priority Support', included: true },
    ],
    ctaText: 'Go Ultimate',
    popular: false,
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">TravelBuddy</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-teal-600 transition">
                Features
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-teal-600 transition">
                Services
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-teal-600 transition">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-teal-600 transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {/* Add mobile menu items */}
        </div>
      </motion.div>
    </nav>
  );
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Navbar />

      {/* Hero Section - Modern Gradient + 3D Element */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 mb-6">
                <HiSparkles className="text-teal-600" />
                <span className="text-sm text-teal-800 dark:text-teal-200">
                  AI-Powered Travel Planning
                </span>
              </div>

              <h1 className="text-6xl font-bold leading-tight">
                Your Next-Gen
                <span className="block mt-2 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Travel Companion
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                Experience the future of travel planning with our AI-powered platform. Smart
                itineraries, real-time translations, and immersive AR experiences.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-xl transition-all duration-300"
                  >
                    Start Free Trial
                    <HiLightningBolt className="ml-2" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#demo"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-medium text-gray-700 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Watch Demo
                  </Link>
                </motion.div>
              </div>

              {/* Trust Badges */}
              <div className="mt-12">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Trusted by leading companies
                </p>
                <div className="flex flex-wrap gap-6 items-center">
                  {[SiOpenai, SiFramer, SiVercel].map((Icon, index) => (
                    <Icon key={index} className="h-6 w-auto text-gray-400 dark:text-gray-600" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Hero Image with Gradient Blobs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              {/* Gradient Blobs */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-r from-teal-300/30 to-blue-300/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl" />

              {/* Main Image */}
              <div className="relative z-10">
                <Image
                  src="/landing-1.svg"
                  alt="Travel Platform"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [20, 0, 20] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute bottom-10 -left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid Section - Updated Design */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Experience the Future of Travel
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Powered by cutting-edge AI and modern technology
            </p>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Feature Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-12 lg:col-span-8 relative group"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 to-blue-600 h-[400px]">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                <div className="relative h-full p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 bg-white/20 w-fit px-4 py-2 rounded-full mb-6">
                      <HiSparkles className="w-5 h-5 text-white" />
                      <span className="text-sm text-white font-medium">Featured</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">AI-Powered Trip Planning</h3>
                    <p className="text-white/90 text-lg max-w-lg">
                      Our advanced AI analyzes millions of travel experiences to create perfectly
                      tailored itineraries that match your preferences and travel style.
                    </p>
                  </div>
                  <Link
                    href="/features"
                    className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 transition px-6 py-3 rounded-full text-white font-medium backdrop-blur-sm group"
                  >
                    <span>Explore Features</span>
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Secondary Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-6"
            >
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                <div className="relative">
                  <MdTranslate className="w-10 h-10 text-white/90 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Real-time Translation</h3>
                  <p className="text-white/80">
                    Break language barriers instantly with AI translations in 100+ languages.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                <div className="relative">
                  <MdViewInAr className="w-10 h-10 text-white/90 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">AR Navigation</h3>
                  <p className="text-white/80">
                    Explore with augmented reality guidance and landmark recognition.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Additional Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="col-span-12 lg:col-span-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
              <div className="relative">
                <HiGlobe className="w-10 h-10 text-white/90 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Smart Recommendations</h3>
                <p className="text-white/80">
                  Get personalized suggestions based on your preferences and travel history.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="col-span-12 lg:col-span-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
              <div className="relative flex items-start space-x-8">
                <HiCube className="w-10 h-10 text-white/90 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Immersive Experiences</h3>
                  <p className="text-white/80">
                    Discover destinations through interactive 3D models and virtual tours before you
                    travel.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Comprehensive Travel & Safety Services
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Your safety and convenience are our top priorities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaPlane,
                title: 'Smart Trip Planning',
                description: 'AI-powered itinerary creation with real-time optimization',
                gradient: 'from-teal-500 to-blue-500',
              },
              {
                icon: FaShieldAlt,
                title: 'Emergency SOS',
                description:
                  'One-tap emergency assistance with location sharing and local authority contact',
                gradient: 'from-red-500 to-orange-500',
              },
              {
                icon: FaRegLifeRing,
                title: '24/7 Emergency Support',
                description: 'Immediate access to medical facilities, police, and embassy contacts',
                gradient: 'from-orange-500 to-amber-500',
              },
              {
                icon: MdTranslate,
                title: 'Real-time Translation',
                description: 'Break language barriers with AI-powered translations',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: HiCube,
                title: 'Digital Wallet',
                description: 'Secure payment solutions and emergency fund access worldwide',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: FaUserFriends,
                title: 'Safety Network',
                description: 'Connect with verified local emergency contacts and fellow travelers',
                gradient: 'from-blue-500 to-indigo-500',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${service.gradient} mb-6`}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the perfect plan for your travel needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden
                  ${plan.popular ? 'border-2 border-teal-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-teal-500 py-2 text-white text-center text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 mt-2">{plan.nickname}</p>
                    <div className="mt-6">
                      <span className="text-5xl font-bold">
                        {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        {feature.included ? (
                          <FaCheck className="text-teal-500 flex-shrink-0" />
                        ) : (
                          <FaTimes className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                        {feature.icon && <feature.icon className="text-teal-500 ml-auto" />}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className={`block w-full py-4 text-center rounded-xl font-medium transition
                      ${
                        plan.popular
                          ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="mt-4 text-xl text-gray-600">The developers behind TravelBuddy</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Rinto Joseph TR',
                role: 'Full Stack Developer',
                social: { github: '#', linkedin: '#' },
              },
              {
                name: 'Soorya Krishna P R',
                role: 'Full Stack Developer',
                social: { github: '#', linkedin: '#' },
              },
              {
                name: 'Alfrin Poulose',
                role: 'Full Stack Developer',
                social: { github: '#', linkedin: '#' },
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ')[0][0]}
                      {member.name.split(' ')[1][0]}
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-teal-600 mb-4">{member.role}</p>
                    <div className="flex justify-center space-x-4">
                      <a
                        href={member.social.github}
                        className="text-gray-600 hover:text-teal-500 transition"
                        aria-label="GitHub"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                      <a
                        href={member.social.linkedin}
                        className="text-gray-600 hover:text-teal-500 transition"
                        aria-label="LinkedIn"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <Link href="/" className="flex items-center mb-6">
                <span className="text-xl font-bold">TravelBuddy</span>
              </Link>
              <p className="text-gray-400">
                Your AI-powered travel companion with advanced safety features for worry-free
                adventures.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'API', 'Documentation'],
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Blog', 'Press'],
              },
              {
                title: 'Resources',
                links: ['Community', 'Help Center', 'Partners', 'Status'],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-6">{column.title}</h3>
                <ul className="space-y-4">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} TravelBuddy. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
