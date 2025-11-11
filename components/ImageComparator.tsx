
import React, { useState, useRef, useEffect } from 'react';

interface ImageComparatorProps {
  originalImage: string;
  generatedImage: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, generatedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
    
  useEffect(() => {
    const updateImageHeight = () => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            // Assuming a 4:3 aspect ratio for calculation, adjust if needed
            setImageHeight(width * 0.75);
        }
    };
    
    updateImageHeight();
    window.addEventListener('resize', updateImageHeight);
    return () => window.removeEventListener('resize', updateImageHeight);
  }, []);


  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-2xl" style={{ height: `${imageHeight}px` }}>
      <img
        src={`data:image/png;base64,${originalImage}`}
        alt="Original Room"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={`data:image/png;base64,${generatedImage}`}
          alt="Generated Design"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center">
        <div
          className="absolute top-0 h-full w-1 bg-white cursor-ew-resize shadow-md"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="w-full h-full opacity-0 cursor-ew-resize"
          aria-label="Compare slider"
        />
      </div>
       <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded">ORIGINAL</div>
       <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded">AI DESIGN</div>
    </div>
  );
};
