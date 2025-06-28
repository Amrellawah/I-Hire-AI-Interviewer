'use client';

import { useState, useEffect } from 'react';

export default function InteractiveCtaSection({ children }) {
  const [hover, setHover] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering for dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pre-generate stable particle data
  const particles = [
    { id: 1, size: 8, top: 20, left: 15, duration: 6, delay: 0.5, direction: 'left' },
    { id: 2, size: 5, top: 45, left: 80, duration: 8, delay: 1.2, direction: 'right' },
    { id: 3, size: 12, top: 70, left: 25, duration: 7, delay: 0.8, direction: 'left' },
    { id: 4, size: 6, top: 30, left: 60, duration: 9, delay: 1.5, direction: 'right' },
    { id: 5, size: 10, top: 85, left: 45, duration: 5, delay: 0.3, direction: 'left' },
    { id: 6, size: 7, top: 15, left: 75, duration: 8, delay: 1.0, direction: 'right' },
    { id: 7, size: 9, top: 55, left: 10, duration: 6, delay: 0.7, direction: 'left' },
    { id: 8, size: 4, top: 90, left: 85, duration: 7, delay: 1.3, direction: 'right' },
    { id: 9, size: 11, top: 25, left: 35, duration: 8, delay: 0.9, direction: 'left' },
    { id: 10, size: 6, top: 65, left: 70, duration: 6, delay: 1.1, direction: 'right' },
    { id: 11, size: 8, top: 40, left: 50, duration: 7, delay: 0.4, direction: 'left' },
    { id: 12, size: 5, top: 80, left: 20, duration: 9, delay: 1.6, direction: 'right' }
  ];

  return (
    <div
      className="group relative flex min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-2xl items-start justify-end px-6 pb-12 @[480px]:px-12 transition-all duration-700 ease-in-out hover:shadow-2xl overflow-hidden"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.75) 100%), url("https://cdn.usegalileo.ai/sdxl10/62fa9ebf-da30-45ad-9bc2-64988fd8ea1e.png")',
        backgroundSize: 'cover',
        backgroundPosition: hover ? 'center 25%' : 'center'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-700"></div>
      
      {/* Subtle animated particles - only render on client */}
      {isClient && hover && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div 
              key={particle.id}
              className="absolute rounded-full bg-white/20"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animation: `float-${particle.direction} ${particle.duration}s linear infinite`,
                animationDelay: `${particle.delay}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
      
      {/* CSS for particle animations - stable keyframes */}
      <style jsx>{`
        @keyframes float-left {
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
            transform: translateY(-120px) translateX(-30px) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes float-right {
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
            transform: translateY(-120px) translateX(30px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}