'use client';

import { useState } from 'react';

export default function InteractiveCtaSection({ children }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`group relative flex min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-2xl items-start justify-end px-6 pb-12 @[480px]:px-12 transition-all duration-700 ease-in-out hover:shadow-2xl overflow-hidden ${hover ? 'bg-[position:center_25%]' : 'bg-[position:center]'}`}
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.75) 100%), url("https://cdn.usegalileo.ai/sdxl10/62fa9ebf-da30-45ad-9bc2-64988fd8ea1e.png")',
        backgroundSize: 'cover',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-700"></div>
      
      {/* Subtle animated particles */}
      {hover && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                width: `${Math.random() * 10 + 3}px`,
                height: `${Math.random() * 10 + 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 8 + 4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
      
      {/* CSS for particle animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.4;
          }
          80% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-120px) translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 40 + 10}px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}