'use client';

import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { MdTranslate, MdTravelExplore, MdViewInAr } from 'react-icons/md';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Explorer Buddy',
    nickname: 'Start Your Journey',
    price: 0,
    description: 'Perfect for beginning adventurers',
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
    popular: false,
    color: 'teal'
  },
  {
    name: 'Wanderlust Buddy',
    nickname: 'Your Perfect Travel Partner',
    price: 4.99,
    description: 'For the passionate traveler in you',
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
    popular: true,
    color: 'teal'
  },
  {
    name: 'Globetrotter Buddy',
    nickname: 'Ultimate Travel Companion',
    price: 19.99,
    description: 'For the serious adventure seeker',
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
    popular: false,
    color: 'teal'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-blue-900 bg-clip-text text-transparent mb-6">
            Find Your Perfect Travel Buddy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the companion that matches your adventure style and unlock a world of possibilities
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden
                ${plan.popular ? 'border-2 border-teal-500 lg:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-teal-500 py-2 px-4 text-white text-center text-sm font-medium">
                  Most Popular Choice
                </div>
              )}

              <div className={`p-6 ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 font-medium text-sm">
                    {plan.nickname}
                  </p>
                </div>
                
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3 p-2"
                    >
                      {feature.included ? (
                        <FaCheck className="text-teal-500 flex-shrink-0" />
                      ) : (
                        <FaTimes className="text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`${feature.included ? 'text-gray-700' : 'text-gray-400'} text-sm`}>
                        {feature.text}
                      </span>
                      {feature.icon && <feature.icon className="text-teal-500 ml-auto" />}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full py-4 px-6 text-center rounded-xl font-medium transition-all
                    ${plan.popular
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: 'Smart AI Translation',
              description: 'Break language barriers instantly with our advanced AI translation system that works offline.',
              icon: MdTranslate
            },
            {
              title: 'Personalized Trips',
              description: 'Get AI-powered trip suggestions perfectly tailored to your preferences and travel style.',
              icon: MdTravelExplore
            },
            {
              title: 'AR Exploration',
              description: 'Discover landmarks and hidden gems through immersive augmented reality experiences.',
              icon: MdViewInAr
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-teal-50 mb-6">
                  <feature.icon className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade my plan anytime?',
                a: 'Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                q: 'Do unused features roll over to the next month?',
                a: 'No, features reset at the beginning of each billing cycle to ensure consistent service quality.'
              },
              {
                q: 'Is there a long-term commitment?',
                a: 'No, all plans are month-to-month and you can cancel anytime.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
