"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

const FloatingActionButton = ({ 
  icon, 
  onClick, 
  className = "",
  size = "large",
  color = "primary",
  pulse = false,
  tooltip = null 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Spring animation for the button
  const [spring, api] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    config: { tension: 300, friction: 20 }
  }));

  // Handle hover
  const handleHover = (hovering) => {
    setIsHovered(hovering);
    api.start({
      scale: hovering ? 1.1 : 1,
      rotate: hovering ? 5 : 0,
    });
  };

  // Handle press
  const handlePress = (pressing) => {
    setIsPressed(pressing);
    api.start({
      scale: pressing ? 0.95 : (isHovered ? 1.1 : 1),
    });
  };

  // Size classes
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16'
  };

  // Color classes
  const colorClasses = {
    primary: 'bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54]',
    secondary: 'bg-gradient-to-r from-[#8e575f] to-[#a67c8e] hover:from-[#a67c8e] hover:to-[#c49ba8]',
    success: 'bg-gradient-to-r from-[#10b981] to-[#34d399] hover:from-[#34d399] hover:to-[#6ee7b7]',
    warning: 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fcd34d]'
  };

  return (
    <div className="relative">
      <motion.button
        style={spring}
        onHoverStart={() => handleHover(true)}
        onHoverEnd={() => handleHover(false)}
        onTapStart={() => handlePress(true)}
        onTapEnd={() => handlePress(false)}
        onClick={onClick}
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          ${className}
          relative rounded-full shadow-lg hover:shadow-xl 
          transition-all duration-300 ease-out
          flex items-center justify-center
          text-white font-bold
          focus:outline-none focus:ring-4 focus:ring-[#be3144]/30
        `}
      >
        {/* Pulse effect */}
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Icon */}
        <div className="relative z-10 text-xl">
          {icon}
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white opacity-0"
          animate={{
            opacity: isHovered ? 0.2 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[#191011] text-white text-sm rounded-lg whitespace-nowrap z-50"
          >
            {tooltip}
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#191011]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButton; 