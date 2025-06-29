"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ModernCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Add hover detection for interactive elements
    const handleElementHover = (e) => {
      const target = e.target;
      const isInteractive = target.tagName === 'A' || 
                           target.tagName === 'BUTTON' || 
                           target.closest('button') || 
                           target.closest('a') ||
                           target.closest('[data-interactive]') ||
                           target.style.cursor === 'pointer';
      
      setIsHovering(isInteractive);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleElementHover);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleElementHover);
      document.body.style.cursor = 'auto';
    };
  }, [isHovering]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Minimal cursor dot only */}
      <motion.div
        className="fixed w-2 h-2 bg-[#f05941] rounded-full pointer-events-none z-[9999]"
        style={{
          left: mousePosition.x - 1,
          top: mousePosition.y - 1,
        }}
        animate={{
          scale: isHovering ? 0.7 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Cursor trail effect */}
      <CursorTrail mousePosition={mousePosition} />
    </>
  );
};

// Cursor trail component
const CursorTrail = ({ mousePosition }) => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const newPoint = { x: mousePosition.x, y: mousePosition.y, id: Date.now() };
    setTrail(prev => [...prev, newPoint].slice(-6)); // Keep last 6 points
  }, [mousePosition]);

  return (
    <>
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed w-1 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-full pointer-events-none z-[9998]"
          style={{
            left: point.x - 0.5,
            top: point.y - 0.5,
          }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

// Text cursor effect
export const TextCursor = ({ children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      {isHovered && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#be3144] to-[#f05941]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default ModernCursor; 