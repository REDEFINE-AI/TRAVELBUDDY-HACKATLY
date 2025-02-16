'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlane, FaShieldAlt, FaRegLifeRing, FaUserFriends, FaBars, FaTimes, FaCheck } from 'react-icons/fa'; // Importing icons
import { motion, useScroll, useTransform } from 'framer-motion'; // Importing animation library
import { MdTranslate, MdTravelExplore, MdViewInAr } from 'react-icons/md';

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
      { text: 'Offline Access', included: false },
    ],
    ctaText: 'Start Exploring',
    popular: false
  },
  {
    name: 'Wanderlust Buddy',
    nickname: 'Your Perfect Travel Partner',
    price: 4.99,
    features: [
      { text: '50 AI Translations per month', included: true, icon: MdTranslate },
      { text: '7 AI Trip Generations', included: true, icon: MdTravelExplore },
      { text: '15 AR Landmark Explorations', included: true, icon: MdViewInAr },
      { text: 'Advanced Trip Planning', included: true },
      { text: 'Community Access', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Offline Access', included: false },
    ],
    ctaText: 'Choose Your Buddy',
    popular: true
  },
  {
    name: 'Globetrotter Buddy',
    nickname: 'Ultimate Travel Companion',
    price: 19.99,
    features: [
      { text: 'Unlimited AI Translations', included: true, icon: MdTranslate },
      { text: 'Unlimited Trip Generations', included: true, icon: MdTravelExplore },
      { text: 'Unlimited AR Explorations', included: true, icon: MdViewInAr },
      { text: 'Premium Trip Planning', included: true },
      { text: 'Priority Community Access', included: true },
      { text: '24/7 Priority Support', included: true },
      { text: 'Offline Access', included: true },
    ],
    ctaText: 'Go Ultimate',
    popular: false
  }
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold text-gray-900">TravelBuddy</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-teal-600 transition">Features</Link>
              <Link href="#services" className="text-gray-700 hover:text-teal-600 transition">Services</Link>
              <Link href="#pricing" className="text-gray-700 hover:text-teal-600 transition">Pricing</Link>
              <Link href="/login" className="text-gray-700 hover:text-teal-600 transition">Login</Link>
              <Link href="/signup" className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
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
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 bg-clip-text text-transparent">
                Your AI-Powered Travel Companion
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Experience seamless travel planning with cutting-edge AI technology.
                Let us handle the details while you focus on creating memories.
              </p>
              <div className="mt-8 flex space-x-4">
                <Link href="/signup" className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-4 rounded-full hover:shadow-xl transition transform hover:-translate-y-1">
                  Start Your Journey
                </Link>
                <Link href="#demo" className="border-2 border-teal-500 text-teal-500 px-8 py-4 rounded-full hover:bg-teal-50 transition">
                  Watch Demo
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Image
                src="/images/hero-illustration.svg"
                alt="Travel Illustration"
                width={600}
                height={500}
                className="relative z-10"
              />
              {/* Add decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 bg-clip-text text-transparent">
              Powerful Features for Modern Travelers
            </h2>
            <p className="mt-4 text-xl text-gray-600">Experience travel like never before with our cutting-edge technology</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaPlane,
                title: "Smart AI Translation",
                description: "Break language barriers instantly with our advanced AI translation system that works offline.",
                color: "from-blue-400 to-blue-600"
              },
              {
                icon: FaUserFriends,
                title: "Personalized Trips",
                description: "Get AI-powered trip suggestions perfectly tailored to your preferences and travel style.",
                color: "from-teal-400 to-teal-600"
              },
              {
                icon: FaShieldAlt,
                title: "AR Exploration",
                description: "Discover landmarks and hidden gems through immersive augmented reality experiences.",
                color: "from-indigo-400 to-indigo-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative bg-white rounded-2xl shadow-xl p-8 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${feature.color}`} />
                <feature.icon className="text-4xl mb-6 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent" />
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Services</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold">Trip Planning</h3>
            <p className="text-gray-600">Expert trip planning tailored to your needs.</p>
          </motion.div>
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold">Travel Insurance</h3>
            <p className="text-gray-600">Comprehensive travel insurance for peace of mind.</p>
          </motion.div>
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock support for all your travel needs.</p>
          </motion.div>
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold">Local Guides</h3>
            <p className="text-gray-600">Connect with local guides for an authentic experience.</p>
          </motion.div>
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
            <p className="mt-4 text-xl text-gray-600">Choose the perfect plan for your travel needs</p>
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
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className="text-gray-500">/month</span>
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
                      ${plan.popular 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
            <p className="mt-4 text-xl text-gray-600">The passionate people behind TravelBuddy</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                image: "/team/sarah.jpg",
                social: { twitter: "#", linkedin: "#" }
              },
              {
                name: "Mike Chen",
                role: "Head of AI",
                image: "/team/mike.jpg",
                social: { twitter: "#", linkedin: "#" }
              },
              {
                name: "Emma Davis",
                role: "Lead Designer",
                image: "/team/emma.jpg",
                social: { twitter: "#", linkedin: "#" }
              },
              {
                name: "Alex Kumar",
                role: "Tech Lead",
                image: "/team/alex.jpg",
                social: { twitter: "#", linkedin: "#" }
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-teal-600 mb-4">{member.role}</p>
                  <div className="flex space-x-4">
                    {Object.entries(member.social).map(([platform, link]) => (
                      <a
                        key={platform}
                        href={link}
                        className="text-gray-400 hover:text-teal-500 transition"
                      >
                        <i className={`fab fa-${platform}`}></i>
                      </a>
                    ))}
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
                <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                <span className="ml-2 text-xl font-bold">TravelBuddy</span>
              </Link>
              <p className="text-gray-400">Your AI-powered travel companion for seamless adventures around the world.</p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API", "Documentation"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog", "Press"]
              },
              {
                title: "Resources",
                links: ["Community", "Help Center", "Partners", "Status"]
              }
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
            <p className="text-gray-400">© {new Date().getFullYear()} TravelBuddy. All rights reserved.</p>
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