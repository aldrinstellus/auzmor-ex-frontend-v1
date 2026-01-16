import { FC, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

// 12 unique avatar photos - using diverse professional headshots
const uniqueAvatars = [
  { id: 1, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', name: 'Sarah' },
  { id: 2, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', name: 'Marcus' },
  { id: 3, src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', name: 'Emily' },
  { id: 4, src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', name: 'David' },
  { id: 5, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', name: 'Sophia' },
  { id: 6, src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', name: 'James' },
  { id: 7, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face', name: 'Olivia' },
  { id: 8, src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', name: 'Michael' },
  { id: 9, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', name: 'Ava' },
  { id: 10, src: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face', name: 'Robert' },
  { id: 11, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face', name: 'Isabella' },
  { id: 12, src: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face', name: 'Daniel' },
];

// Chat messages for the bubbles
const chatMessages = [
  "Great meeting today! 🎉",
  "Love the new design!",
  "Thanks for the help!",
  "See you at standup",
  "Awesome work! 👏",
  "Quick sync later?",
  "Just shipped it! 🚀",
  "Happy Friday! 🎊",
  "Nice job on that!",
  "Coffee break? ☕",
  "Let's collaborate!",
  "You're amazing! ⭐",
];

// Avatar positions mapped to geographic locations on world map
const avatarPositions = [
  // North America - USA (Main/Hero avatar - largest and most prominent)
  { top: '25%', left: '15%', rotate: -2, scale: 1.15, zIndex: 15, depth: 'front', region: 'USA' },
  // North America - Canada
  { top: '8%', left: '25%', rotate: 5, scale: 0.7, zIndex: 1, depth: 'back', region: 'Canada' },
  // South America - Brazil
  { top: '58%', left: '28%', rotate: -4, scale: 0.9, zIndex: 8, depth: 'middle', region: 'Brazil' },
  // Europe - UK
  { top: '18%', left: '42%', rotate: 4, scale: 0.85, zIndex: 5, depth: 'middle', region: 'UK' },
  // Europe - Germany/Central
  { top: '22%', left: '50%', rotate: -2, scale: 0.78, zIndex: 3, depth: 'back', region: 'Europe' },
  // Africa - Nigeria/Central
  { top: '48%', left: '48%', rotate: 3, scale: 0.88, zIndex: 6, depth: 'middle', region: 'Africa' },
  // Middle East - Dubai
  { top: '35%', left: '58%', rotate: -5, scale: 0.82, zIndex: 4, depth: 'middle', region: 'Dubai' },
  // India
  { top: '38%', left: '68%', rotate: 2, scale: 1, zIndex: 10, depth: 'front', region: 'India' },
  // China/East Asia
  { top: '28%', left: '78%', rotate: -3, scale: 0.9, zIndex: 7, depth: 'middle', region: 'China' },
  // Japan
  { top: '25%', left: '88%', rotate: 4, scale: 0.75, zIndex: 2, depth: 'back', region: 'Japan' },
  // Southeast Asia - Singapore
  { top: '50%', left: '75%', rotate: -2, scale: 0.85, zIndex: 5, depth: 'middle', region: 'Singapore' },
  // Australia
  { top: '68%', left: '85%', rotate: 3, scale: 0.92, zIndex: 9, depth: 'front', region: 'Australia' },
];

interface ChatBubble {
  id: number;
  avatarIndex: number;
  message: string;
}

interface LoginBackgroundProps {
  className?: string;
}

const LoginBackground: FC<LoginBackgroundProps> = ({ className = '' }) => {
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationsRef = useRef<gsap.core.Tween[]>([]);
  const [chatBubbles, setChatBubbles] = useState<ChatBubble[]>([]);
  const bubbleIdRef = useRef(0);

  // GSAP floating animation for each avatar with 3D depth
  useEffect(() => {
    avatarRefs.current.forEach((avatarEl, index) => {
      if (!avatarEl) return;

      const position = avatarPositions[index];
      const depthMultiplier = position.depth === 'back' ? 0.5 : position.depth === 'middle' ? 0.75 : 1;

      // Initial entrance animation with 3D effect
      gsap.fromTo(
        avatarEl,
        {
          scale: 0,
          opacity: 0,
          rotationY: -90,
          rotationX: 20,
        },
        {
          scale: position.scale,
          opacity: position.depth === 'back' ? 0.6 : position.depth === 'middle' ? 0.85 : 1,
          rotationY: 0,
          rotationX: 0,
          rotation: position.rotate,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'back.out(1.4)',
        }
      );

      // Continuous floating animation with depth-based movement
      const floatAnimation = () => {
        const randomX = (Math.random() - 0.5) * 80 * depthMultiplier;
        const randomY = (Math.random() - 0.5) * 60 * depthMultiplier;
        const randomRotation = position.rotate + (Math.random() - 0.5) * 12;
        const randomRotationY = (Math.random() - 0.5) * 15 * depthMultiplier;
        const duration = 4 + Math.random() * 4;

        const tween = gsap.to(avatarEl, {
          x: randomX,
          y: randomY,
          rotation: randomRotation,
          rotationY: randomRotationY,
          duration,
          ease: 'sine.inOut',
          onComplete: floatAnimation,
        });
        animationsRef.current.push(tween);
      };

      // Start floating with staggered delay
      setTimeout(floatAnimation, 1000 + index * 200);
    });

    return () => {
      animationsRef.current.forEach(anim => anim.kill());
    };
  }, []);

  // Random chat bubbles appearing
  useEffect(() => {
    const showRandomBubble = () => {
      // Prefer front/middle layer avatars for bubbles
      const frontMiddleIndices = avatarPositions
        .map((p, i) => ({ depth: p.depth, index: i }))
        .filter(p => p.depth !== 'back')
        .map(p => p.index);

      const randomAvatarIndex = frontMiddleIndices[Math.floor(Math.random() * frontMiddleIndices.length)];
      const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      const newBubbleId = bubbleIdRef.current++;

      setChatBubbles(prev => {
        const filtered = prev.length >= 3 ? prev.slice(1) : prev;
        return [...filtered, { id: newBubbleId, avatarIndex: randomAvatarIndex, message: randomMessage }];
      });

      // Remove bubble after delay
      setTimeout(() => {
        setChatBubbles(prev => prev.filter(b => b.id !== newBubbleId));
      }, 3000 + Math.random() * 2000);
    };

    // Show initial bubbles
    setTimeout(showRandomBubble, 1200);
    setTimeout(showRandomBubble, 2400);

    // Continue showing bubbles at intervals
    const interval = setInterval(showRandomBubble, 2500 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Gradient background with depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 40%, #115e59 70%, #134e4a 100%)',
        }}
      />

      {/* World Map - Using external SVG image for accurate outline */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{ zIndex: 1 }}
      >
        {/* World map outline using img with filter - proportional, full view */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
          alt=""
          className="absolute pointer-events-none select-none"
          style={{
            width: '100%',
            height: 'auto',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.22,
            filter: 'brightness(0) invert(1)',
          }}
        />

        {/* Overlay SVG for animated elements */}
        <svg
          viewBox="0 0 1000 500"
          className="absolute w-[130%] h-[130%]"
          style={{ left: '-15%', top: '-15%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Animated pulse circles on major cities/regions */}
          {[
            { cx: 200, cy: 180, delay: 0 },     // North America
            { cx: 280, cy: 350, delay: 0.5 },   // South America
            { cx: 480, cy: 160, delay: 0.3 },   // Europe
            { cx: 520, cy: 300, delay: 1 },     // Africa
            { cx: 700, cy: 200, delay: 0.8 },   // Middle East
            { cx: 780, cy: 220, delay: 1.2 },   // India
            { cx: 850, cy: 200, delay: 1.5 },   // China
            { cx: 920, cy: 180, delay: 1.8 },   // Japan
            { cx: 880, cy: 380, delay: 2.2 },   // Australia
            { cx: 850, cy: 280, delay: 2 },     // Southeast Asia
          ].map((city, i) => (
            <g key={i}>
              {/* Base dot */}
              <motion.circle
                cx={city.cx}
                cy={city.cy}
                r="4"
                fill="white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ delay: city.delay + 1, duration: 0.5 }}
              />
              {/* Pulse ring 1 */}
              <motion.circle
                cx={city.cx}
                cy={city.cy}
                r="4"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 3, 4],
                  opacity: [0.6, 0.2, 0],
                }}
                transition={{
                  duration: 3,
                  delay: city.delay + 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              {/* Pulse ring 2 - offset */}
              <motion.circle
                cx={city.cx}
                cy={city.cy}
                r="4"
                fill="none"
                stroke="white"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 2.5, 3.5],
                  opacity: [0.4, 0.1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: city.delay + 2.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            </g>
          ))}

          {/* Connection arc lines between regions */}
          {[
            { x1: 200, y1: 180, x2: 480, y2: 160 },   // NA to Europe
            { x1: 480, y1: 160, x2: 780, y2: 220 },   // Europe to India
            { x1: 780, y1: 220, x2: 850, y2: 200 },   // India to China
            { x1: 850, y1: 200, x2: 920, y2: 180 },   // China to Japan
            { x1: 920, y1: 180, x2: 880, y2: 380 },   // Japan to Australia
            { x1: 280, y1: 350, x2: 520, y2: 300 },   // SA to Africa
            { x1: 700, y1: 200, x2: 850, y2: 280 },   // ME to SEA
            { x1: 200, y1: 180, x2: 280, y2: 350 },   // NA to SA
          ].map((line, i) => (
            <motion.path
              key={`arc-${i}`}
              d={`M${line.x1},${line.y1} Q${(line.x1 + line.x2) / 2},${Math.min(line.y1, line.y2) - 40} ${line.x2},${line.y2}`}
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="4,4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.35 }}
              transition={{
                duration: 2.5,
                delay: 2 + i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Animated gradient overlay for depth */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ zIndex: 2 }}
      />

      {/* Connection lines between avatars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Animated connection lines */}
        {[
          { x1: '15%', y1: '15%', x2: '45%', y2: '25%' },
          { x1: '45%', y1: '25%', x2: '75%', y2: '40%' },
          { x1: '30%', y1: '40%', x2: '60%', y2: '55%' },
          { x1: '20%', y1: '55%', x2: '45%', y2: '70%' },
          { x1: '65%', y1: '15%', x2: '75%', y2: '40%' },
          { x1: '45%', y1: '70%', x2: '70%', y2: '75%' },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 6,
              delay: i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Floating particles with depth */}
      {[...Array(25)].map((_, i) => {
        const depth = i % 3; // 0 = back, 1 = middle, 2 = front
        const size = depth === 0 ? 4 : depth === 1 ? 6 : 8;
        const opacity = depth === 0 ? 0.1 : depth === 1 ? 0.2 : 0.3;

        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: 'white',
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              zIndex: depth,
            }}
            animate={{
              y: [0, -30 - depth * 10, 0],
              x: [0, (Math.random() - 0.5) * 20, 0],
              opacity: [opacity * 0.5, opacity, opacity * 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* 3D Container for avatars */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(5deg)',
        }}
      >
        {/* Animated Avatar Cards */}
        {uniqueAvatars.map((avatar, index) => {
          const position = avatarPositions[index];
          const bubble = chatBubbles.find(b => b.avatarIndex === index);
          const baseSize = position.depth === 'back' ? 60 : position.depth === 'middle' ? 70 : 80;

          return (
            <div
              key={avatar.id}
              ref={el => avatarRefs.current[index] = el}
              className="absolute"
              style={{
                top: position.top,
                left: position.left,
                zIndex: position.zIndex,
                transformStyle: 'preserve-3d',
                filter: position.depth === 'back' ? 'blur(1px)' : 'none',
              }}
            >
              {/* Chat Bubble */}
              <AnimatePresence>
                {bubble && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 15, rotateX: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: -15, rotateX: 20 }}
                    transition={{ duration: 0.4, ease: 'backOut' }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    style={{ zIndex: 100 }}
                  >
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-teal-900"
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.5)',
                      }}
                    >
                      {bubble.message}
                      {/* Bubble tail */}
                      <div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Avatar Card with 3D effect */}
              <motion.div
                whileHover={{
                  scale: 1.1,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card shadow for 3D depth */}
                <div
                  className="absolute rounded-lg"
                  style={{
                    width: baseSize + 8,
                    height: baseSize + 20,
                    background: 'rgba(0,0,0,0.2)',
                    filter: 'blur(8px)',
                    transform: 'translateZ(-20px) translateY(5px)',
                    top: 0,
                    left: -4,
                  }}
                />

                {/* Main Card */}
                <div
                  className="bg-white rounded-lg overflow-hidden"
                  style={{
                    width: baseSize,
                    height: baseSize + 12,
                    boxShadow: position.depth === 'front'
                      ? '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.8)'
                      : '0 10px 25px rgba(0,0,0,0.2)',
                    transform: 'translateZ(0)',
                  }}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Online indicator */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(74, 222, 128, 0.7)',
                      '0 0 0 6px rgba(74, 222, 128, 0)',
                      '0 0 0 0 rgba(74, 222, 128, 0.7)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-1 -right-1 bg-green-400 rounded-full border-2 border-white"
                  style={{
                    width: position.depth === 'front' ? 14 : 10,
                    height: position.depth === 'front' ? 14 : 10,
                    transform: 'translateZ(10px)',
                  }}
                />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }}
      />
    </div>
  );
};

export default LoginBackground;
