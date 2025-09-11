'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Lottie from 'lottie-react';
import faqAnimation from '../../public/animations/faq1.json';
import { motion, AnimatePresence } from 'framer-motion';

// FAQ Data Array
const faqs = [
  {
    question: 'What types of courses do you offer?',
    answer:
      'We offer a wide range of courses including Coding Bootcamps, Online Degrees, Certification Programs, and Expert-led Workshops covering technologies like Web Development, Data Science, AI, Cloud Computing, and more.',
  },
  {
    question: 'Can I learn at my own pace?',
    answer:
      'Absolutely! Our platform is designed for flexible learning. You can access course materials anytime, study at your own speed, and revisit lessons whenever you need.',
  },
  {
    question: 'Do you provide certification after course completion?',
    answer:
      'Yes, upon successful completion of your course, you will receive industry-recognized certifications that can be added to your resume and LinkedIn profile.',
  },
  {
    question: 'Are your courses accredited?',
    answer:
      'Some of our Online Degrees and Certification Programs are accredited by recognized educational institutions and industry bodies, giving your learning an extra professional boost.',
  },
  {
    question: 'What makes your platform different from others?',
    answer:
      'Our platform offers hands-on projects, industry-recognized certifications, expert mentorship, flexible learning, and a global community — making it ideal for real-world career growth.',
  },
];


const Question = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-100 w-full min-h-[600px] py-10 px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-10 font-poppins">
      
     <motion.div
  initial={{ x: -50, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="w-full md:w-1/2"
>
  <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-wide">
    Frequently Asked Questions
  </h2>
  <p className="text-gray-600 mb-12 text-lg max-w-xl">
    Discover everything you need to know about our industry-leading EdTech platform. Empower your learning journey with confidence.
  </p>

  <div className="space-y-6">
    <AnimatePresence initial={false}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all overflow-hidden"
          >
            <button
              className="w-full px-8 py-5 flex justify-between items-center text-left focus:outline-none hover:bg-gray-50 transition"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-indigo-700 font-semibold text-lg">
                {faq.question}
              </span>
              {isOpen ? (
                <ChevronUp className="text-indigo-500 w-6 h-6" />
              ) : (
                <ChevronDown className="text-indigo-500 w-6 h-6" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="px-8 pb-6 text-gray-700 text-base leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
</motion.div>

      {/* Right Side - Lottie Animation */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex justify-center items-center"
      >
        <div className="max-w-md w-full">
          <Lottie animationData={faqAnimation} loop={true} className="w-full h-auto" />
        </div>
      </motion.div>

    </section>
  );
};

export default Question;
