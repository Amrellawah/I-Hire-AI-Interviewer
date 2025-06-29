"use client";
import { useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { useGesture } from '@use-gesture/react';
import gsap from 'gsap';

const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = "", 
  backgroundImage = null,
  overlay = false 
}) => {
  const sectionRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Parallax effect
  const [spring, api] = useSpring(() => ({
    transform: 'translateY(0px)',
    config: { mass: 1, tension: 280, friction: 120 }
  }));

  // Gesture handling for mobile
  const bind = useGesture({
    onScroll: ({ offset: [, y] }) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        api.start({ transform: `translateY(${rate}px)` });
      }
    },
  });

  // GSAP animation for entrance
  useEffect(() => {
    if (inView && sectionRef.current) {
      gsap.fromTo(sectionRef.current,
        {
          opacity: 0,
          y: 100,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.2,
        }
      );
    }
  }, [inView]);

  return (
    <animated.section
      ref={(el) => {
        ref(el);
        sectionRef.current = el;
      }}
      style={spring}
      {...bind()}
      className={`relative overflow-hidden ${className}`}
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </animated.section>
  );
};

export default ParallaxSection; 