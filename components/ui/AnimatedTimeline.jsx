"use client";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedTimeline = ({ items = [] }) => {
  const timelineRef = useRef(null);

  return (
    <div ref={timelineRef} className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#be3144] via-[#f05941] to-[#be3144] transform -translate-x-1/2" />
      
      <div className="space-y-12">
        {items.map((item, index) => (
          <TimelineItem 
            key={index} 
            item={item} 
            index={index} 
            isEven={index % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
};

const TimelineItem = ({ item, index, isEven }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        ease: 'easeOut'
      }}
      className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 z-10" />
      
      {/* Content */}
      <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.2 + 0.3,
            ease: 'easeOut'
          }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#f0e6e8] hover:shadow-xl transition-all duration-300 group"
        >
          {/* Date */}
          <div className="text-sm font-semibold text-[#be3144] mb-2">
            {item.date}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-[#191011] mb-3 group-hover:text-[#be3144] transition-colors duration-300">
            {item.title}
          </h3>
          
          {/* Description */}
          <p className="text-[#8e575f] leading-relaxed mb-4">
            {item.description}
          </p>
          
          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#be3144]/10 to-[#f05941]/10 text-[#be3144] rounded-full border border-[#be3144]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Icon or image */}
          {item.icon && (
            <div className="mt-4 w-12 h-12 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-lg flex items-center justify-center text-white">
              {item.icon}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedTimeline; 