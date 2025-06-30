"use client";
import { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { motion } from 'framer-motion';

const InteractiveCard = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  tiltEffect = true,
  glowEffect = false,
  onClick = null 
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Spring animations
  const [spring, api] = useSpring(() => ({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    config: { mass: 1, tension: 300, friction: 30 }
  }));

  // Gesture handling for 3D tilt effect
  const bind = useGesture({
    onHover: ({ hovering }) => {
      setIsHovered(hovering);
      if (hovering && hoverEffect) {
        api.start({
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.01)',
          boxShadow: glowEffect 
            ? '0 20px 40px rgba(190, 49, 68, 0.3)' 
            : '0 20px 40px rgba(0, 0, 0, 0.15)'
        });
      } else {
        api.start({
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        });
      }
    },
    onMove: ({ xy: [x, y], hovering }) => {
      if (hovering && tiltEffect && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        api.start({
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`,
        });
      }
    },
    onPointerDown: () => {
      setIsPressed(true);
      api.start({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.98)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
      });
    },
    onPointerUp: () => {
      setIsPressed(false);
      if (isHovered) {
        api.start({
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.01)',
          boxShadow: glowEffect 
            ? '0 20px 40px rgba(190, 49, 68, 0.3)' 
            : '0 20px 40px rgba(0, 0, 0, 0.15)'
        });
      } else {
        api.start({
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        });
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <animated.div
        ref={cardRef}
        style={spring}
        {...bind()}
        onClick={onClick}
        className={`
          relative bg-white rounded-2xl p-6 border border-[#f0e6e8] 
          cursor-pointer transition-all duration-300 ease-out
          ${glowEffect ? 'hover:shadow-[0_0_30px_rgba(190,49,68,0.3)]' : ''}
          ${className}
        `}
      >
        {/* Glow effect overlay */}
        {glowEffect && isHovered && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#be3144]/10 to-[#f05941]/10 opacity-50" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle border animation */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[#be3144] to-[#f05941] opacity-0 transition-opacity duration-300 pointer-events-none" 
             style={{ opacity: isHovered ? 0.1 : 0 }} />
      </animated.div>
    </motion.div>
  );
};

export default InteractiveCard; 