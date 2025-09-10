import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';

const Home = () => {
  // Sample carousel data - replace these with your backend data
  const carouselItems = [
    {
      id: 1,
      title: 'Transform Your Learning Experience',
      description: 'Access high-quality courses from industry experts',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
      buttonText: 'Explore Courses',
      buttonLink: '#'
    },
    {
      id: 2,
      title: 'Learn at Your Own Pace',
      description: 'Study anytime, anywhere with our flexible learning platform',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
      buttonText: 'Start Learning',
      buttonLink: '#'
    },
    {
      id: 3,
      title: 'Expert-Led Courses',
      description: 'Learn from professionals with real-world experience',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
      buttonText: 'Meet Our Instructors',
      buttonLink: '#'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  // Auto slide images every 5 seconds
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Section */}
      <div 
        className="relative w-full h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Track */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item, index) => (
            <div 
              key={item.id}
              className="w-full flex-shrink-0 h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h1>
                  <p className="text-xl md:text-2xl mb-8">{item.description}</p>
                  <a 
                    href={item.buttonLink}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
                  >
                    {item.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
          aria-label="Next slide"
        >
          <FaChevronRight size={24} />
        </button>

      </div>

    {/* Features Section */}
<div className="py-24 bg-gray-100">
  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-16">
      Why Choose Our Platform?
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          icon: '🎓',
          title: 'Expert Instructors',
          description: 'Learn from industry professionals with years of real-world experience guiding you every step of the way.',
        },
        {
          icon: '⏱️',
          title: 'Flexible Learning',
          description: 'Study anytime, anywhere. Access materials 24/7 and learn at your own pace without any pressure.',
        },
        {
          icon: '📜',
          title: 'Certification',
          description: 'Get industry-recognized certificates after completing courses to boost your career and credibility.',
        },
      ].map((feature, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
        >
          <div className="text-5xl mb-5">{feature.icon}</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>


  
      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">Join thousands of students who are already advancing their careers with our courses.</p>
          <a 
            href="#" 
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300"
          >
            Get Started Now
          </a>
        </div>
      </div>
    

    </div>
  );
};

export default Home;
