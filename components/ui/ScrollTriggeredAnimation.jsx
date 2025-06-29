"use client";
import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollTriggeredAnimation = ({ 
  children, 
  animation = "fadeInUp",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = "",
  triggerOnce = true,
  stagger = 0
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold, triggerOnce });
  const controls = useAnimation();

  // Animation variants
  const variants = {
    fadeInUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    fadeInDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 }
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotateIn: {
      hidden: { opacity: 0, rotate: -180, scale: 0.8 },
      visible: { opacity: 1, rotate: 0, scale: 1 }
    },
    slideInUp: {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0 }
    },
    slideInDown: {
      hidden: { opacity: 0, y: -100 },
      visible: { opacity: 1, y: 0 }
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -100 },
      visible: { opacity: 1, x: 0 }
    },
    slideInRight: {
      hidden: { opacity: 0, x: 100 },
      visible: { opacity: 1, x: 0 }
    },
    bounceIn: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100
        }
      }
    },
    flipIn: {
      hidden: { opacity: 0, rotateY: 90 },
      visible: { 
        opacity: 1, 
        rotateY: 0,
        transition: {
          type: "spring",
          damping: 15,
          stiffness: 100
        }
      }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // GSAP ScrollTrigger for more complex animations
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    // Create GSAP animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          // Additional GSAP effects can be added here
          gsap.to(element, {
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              // Callback after animation
            }
          });
        }
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[animation] || variants.fadeInUp}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        stagger
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered animation wrapper for multiple children
export const StaggeredAnimation = ({ 
  children, 
  staggerDelay = 0.1,
  animation = "fadeInUp",
  className = ""
}) => {
  return (
    <div className={className}>
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <ScrollTriggeredAnimation
            key={index}
            animation={animation}
            delay={index * staggerDelay}
          >
            {child}
          </ScrollTriggeredAnimation>
        )) : 
        <ScrollTriggeredAnimation animation={animation}>
          {children}
        </ScrollTriggeredAnimation>
      }
    </div>
  );
};

export default ScrollTriggeredAnimation; 