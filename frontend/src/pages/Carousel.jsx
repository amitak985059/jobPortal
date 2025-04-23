import React, { useEffect, useRef, useState } from 'react';


const images = [
  'https://images.unsplash.com/photo-1630958234938-4f6a4a9dbf3a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1622675235457-38708d51d6d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1626910771652-bcf463ae516b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

const Carousel = () => {
  const [index, setIndex] = useState(1); // start at first real image (after the clone)
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef();

  const imageList = [images[images.length - 1], ...images, images[0]]; // [cloneLast, ...realImages, cloneFirst]

  const slideTo = (newIndex) => {
    setIndex(newIndex);
    setTransition(true);
  };

  const nextSlide = () => {
    slideTo(index + 1);
  };

  const prevSlide = () => {
    slideTo(index - 1);
  };

  // Auto-slide
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  });

  // Smooth reset without flicker
  useEffect(() => {
    if (index === imageList.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 700);
    }
    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(imageList.length - 2);
      }, 700);
    }
  }, [index]);

  return (
    <div className="relative w-[85%]  h-[450px] overflow-hidden bg-black rounded-2xl shadow-lg mx-auto">
      <div
        className={`flex transition-transform ease-in-out duration-700 ${!transition && 'transition-none'}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {imageList.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i}`}
            className="w-full h-[450px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
