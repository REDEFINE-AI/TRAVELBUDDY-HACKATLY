"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface OnboardingScreen {
  id: number;
  image: string;
  title: string;
  accentWords: string;
  description: string;
  buttonLabel: string;
}

const onboardingScreens: OnboardingScreen[] = [
  {
    id: 1,
    image: "/images/onboard1.svg",
    title: "Travel Smarter, Experience More",
    accentWords: "Experience More",
    description:
      "Reimagine your travel experience with our app. From personalized trip planning to unique features tailored to your preferences, we make every journey unforgettable.",
    buttonLabel: "Start Your Journey",
  },
  {
    id: 2,
    image: "/images/onboard2.svg",
    title: "Explore Your Way",
    accentWords: "Your Way",
    description:
      "Discover destinations like never before. Our app not only guides your trip but also helps you plan your journey to match your style and interests.",
    buttonLabel: "Keep going",
  },
  {
    id: 3,
    image: "/images/onboard3.svg",
    title: "Your Perfect Travel Companion",
    accentWords: "Travel Companion",
    description:
      "Experience a seamless blend of smart planning, immersive AR features, and real-time insights. We're here to make every trip your best one yet.",
    buttonLabel: "Let's begin",
  },
];

const Onboarding = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [dragStart, setDragStart] = useState<number>(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleDragStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleDragEnd = (e: React.TouchEvent) => {
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart - dragEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentScreen < onboardingScreens.length - 1) {
        handleNext();
      } else if (diff < 0 && currentScreen > 0) {
        setCurrentScreen(currentScreen - 1);
      }
    }
  };

  const renderTitle = (title: string, accentWords: string) => {
    const beforeAccent = title.replace(accentWords, "");
    return (
      <>
        <span className="text-gray-800">{beforeAccent}</span>
        <span className="text-orange-500">{accentWords}</span>
      </>
    );
  };

  return (
    <div
      className="relative h-screen w-screen bg-gradient-to-b from-teal-50 to-white overflow-hidden"
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      <AnimatePresence mode="wait">
        {onboardingScreens.map(
          (screen, index) =>
            index === currentScreen && (
              <motion.div
                key={screen.id}
                className="absolute inset-0 flex flex-col items-center justify-between"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Image Container */}
                <div className="relative w-full h-3/5">
                  <div className="absolute inset-0 bg-gradient-to-b from-teal-100/20 to-transparent rounded-b-[2rem]">
                    <motion.div
                      className="w-full h-full"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.7 }}
                    >
                      <Image
                        src={screen.image}
                        alt={`Onboarding ${screen.id}`}
                        className="rounded-b-[2rem]"
                        layout="fill"
                        objectFit="cover"
                        priority
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center px-4 text-center max-w-md">
                  <motion.h2
                    className="text-lg font-semibold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {renderTitle(screen.title, screen.accentWords)}
                  </motion.h2>
                  <motion.p
                    className="text-xs text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    {screen.description}
                  </motion.p>
                </div>

                {/* Progress and Button */}
                <div className="w-full px-4 mb-6 space-y-4">
                  {/* Progress Indicators */}
                  <div className="flex justify-center space-x-2">
                    {onboardingScreens.map((_, idx) => (
                      <motion.div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === currentScreen
                            ? "w-6 bg-teal-600"
                            : "w-1.5 bg-gray-300"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                      />
                    ))}
                  </div>

                  {/* Enhanced Button with Glow and Ripple */}
                  <motion.button
                    onClick={handleNext}
                    className="group relative w-full py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg
                             transition-all duration-300 ease-out
                             hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]
                             active:shadow-[0_0_10px_rgba(20,184,166,0.3)]
                             overflow-hidden
                             hs-button
                             [--ripple-duration:800ms]
                             before:absolute before:inset-0 before:bg-white/20
                             before:scale-0 before:opacity-0 before:transition
                             active:before:scale-100 active:before:opacity-100
                             after:absolute after:inset-0 after:bg-gradient-to-r after:from-teal-400/20 after:to-emerald-400/20
                             after:opacity-0 after:transition-opacity
                             hover:after:opacity-100"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{screen.buttonLabel}</span>
                  </motion.button>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
