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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* App-like Header with Safe Area */}
      <div className="safe-area-top  text-white">
        <div className="pt-4 pb-4 px-4">
          
        </div>
      </div>

      {/* Main Content with Proper Spacing */}
      <div className="px-4 py-6">
        {/* Intro Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Find Your Perfect Travel Buddy
          </h2>
          <p className="text-base text-gray-600">
            Choose the companion that matches your adventure style
          </p>
        </div>

        {/* Pricing Cards with Improved Mobile Spacing */}
        <div className="space-y-4 mb-12">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-md border overflow-hidden
                ${plan.popular ? 'border-teal-500' : 'border-gray-100'}`}
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

        {/* Features Section */}
        <div className="pt-8 pb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose Travel Buddy?
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Smart AI Translation',
                description: 'Break language barriers instantly with our advanced AI translation',
                icon: MdTranslate
              },
              {
                title: 'Personalized Trips',
                description: 'Get AI-powered trip suggestions tailored to your preferences',
                icon: MdTravelExplore
              },
              {
                title: 'AR Exploration',
                description: 'Discover landmarks and hidden gems through augmented reality',
                icon: MdViewInAr
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-teal-50">
                    <feature.icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section with Updated Styling */}
        <div className="pt-8 pb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Common Questions
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
        </div>
      </div>
    </div>
  );
}
