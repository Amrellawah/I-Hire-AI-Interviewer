"use client";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

const ParticleSystem = ({ 
  particleCount = 50,
  colors = ['#be3144', '#f05941', '#8e575f'],
  size = { min: 2, max: 6 },
  speed = { min: 1, max: 3 },
  className = ""
}) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate random particles
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (size.max - size.min) + size.min,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * (speed.max - speed.min) + speed.min,
      direction: Math.random() * 360,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, [particleCount, colors, size, speed]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          particle={particle}
          mousePosition={mousePosition}
        />
      ))}
    </div>
  );
};

const Particle = ({ particle, mousePosition }) => {
  const [spring, api] = useSpring(() => ({
    x: particle.x,
    y: particle.y,
    opacity: particle.opacity,
    scale: 1,
    config: { mass: 1, tension: 300, friction: 30 }
  }));

  // Animate particle movement
  useEffect(() => {
    const animate = () => {
      // Calculate distance from mouse
      const dx = mousePosition.x - particle.x;
      const dy = mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Repel particles from mouse
      const repelStrength = 0.5;
      const repelDistance = 20;
      
      let newX = particle.x;
      let newY = particle.y;
      
      if (distance < repelDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (repelDistance - distance) / repelDistance * repelStrength;
        newX -= Math.cos(angle) * force;
        newY -= Math.sin(angle) * force;
      }
      
      // Add some natural movement
      newX += Math.sin(Date.now() * 0.001 + particle.id) * 0.1;
      newY += Math.cos(Date.now() * 0.001 + particle.id) * 0.1;
      
      // Keep particles within bounds
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));
      
      api.start({
        x: newX,
        y: newY,
        opacity: distance < repelDistance ? particle.opacity * 0.5 : particle.opacity,
        scale: distance < repelDistance ? 1.2 : 1,
      });
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [particle, mousePosition, api]);

  return (
    <animated.div
      style={{
        ...spring,
        position: 'absolute',
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
        borderRadius: '50%',
        filter: 'blur(1px)',
      }}
    />
  );
};

// Floating particles with different behaviors
export const FloatingParticles = ({ count = 20, className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-[#be3144]/30 to-[#f05941]/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Interactive particle trail
export const ParticleTrail = ({ className = "" }) => {
  const [trail, setTrail] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }];
        return newTrail.slice(-20); // Keep last 20 positions
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem; 