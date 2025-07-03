"use client";
import { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

const AnimatedBackground = ({ children, isMobile = false }) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Spring animation for the main container
  const containerSpring = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 300, friction: 30 }
  });

  // Particle animation
  useEffect(() => {
    if (!containerRef.current) return;

    const particles = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-gradient-to-r from-[#be3144]/20 to-[#f05941]/20 rounded-full';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    particlesRef.current = particles;

    // Animate particles
    const animateParticles = () => {
      particles.forEach((particle, index) => {
        gsap.to(particle, {
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          opacity: Math.random() * 0.5 + 0.1,
          duration: Math.random() * 10 + 10,
          ease: 'none',
          repeat: -1,
          yoyo: true,
          delay: index * 0.1,
        });
      });
    };

    animateParticles();

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  // Gradient animation
  useEffect(() => {
    if (!containerRef.current) return;

    const gradient = gsap.to(containerRef.current, {
      background: 'linear-gradient(45deg, #fef6f6 0%, #fff9f9 25%, #fef6f6 50%, #fff9f9 75%, #fef6f6 100%)',
      duration: 8,
      ease: 'none',
      repeat: -1,
    });

    return () => gradient.kill();
  }, []);

  return (
    <animated.div
      ref={(el) => {
        ref(el);
        containerRef.current = el;
      }}
      style={containerSpring}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fef6f6] via-[#fff9f9] to-[#fef6f6] opacity-80" />
      {/* Floating geometric shapes - hide or reduce on mobile */}
      {!isMobile && <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#be3144]/10 to-[#f05941]/10 rounded-full blur-xl animate-pulse" />}
      {!isMobile && <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#f05941]/10 to-[#be3144]/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />}
      {!isMobile && <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-[#be3144]/5 to-[#f05941]/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </animated.div>
  );
};

export default AnimatedBackground; 