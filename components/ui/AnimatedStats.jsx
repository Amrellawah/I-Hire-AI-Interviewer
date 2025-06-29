"use client";
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const spring = useSpring({
    number: inView ? end : 0,
    from: { number: 0 },
    config: { duration },
    onChange: (result) => {
      setCount(Math.floor(result.value.number));
    },
  });

  return (
    <animated.span ref={ref}>
      {count}{suffix}
    </animated.span>
  );
};

const AnimatedStats = ({ stats = [] }) => {
  const containerRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={(el) => {
        ref(el);
        containerRef.current = el;
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: 'easeOut'
            }}
            className="text-center group"
          >
            <div className="relative">
              {/* Animated background circle */}
              <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-[#be3144]/10 to-[#f05941]/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              {/* Icon container */}
              <div className="relative w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                {stat.icon && (
                  <div className="text-white text-2xl">
                    {stat.icon}
                  </div>
                )}
              </div>
            </div>
            
            {/* Number */}
            <div className="text-4xl md:text-5xl font-bold text-[#191011] mb-2 group-hover:text-[#be3144] transition-colors duration-300">
              <AnimatedCounter 
                end={stat.value} 
                suffix={stat.suffix || ""}
                duration={2000}
              />
            </div>
            
            {/* Label */}
            <div className="text-lg text-[#8e575f] font-medium group-hover:text-[#be3144] transition-colors duration-300">
              {stat.label}
            </div>
            
            {/* Description */}
            {stat.description && (
              <div className="text-sm text-[#8e575f]/70 mt-2">
                {stat.description}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnimatedStats; 