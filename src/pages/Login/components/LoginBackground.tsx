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

// Fixed positions for avatar cards
const avatarPositions = [
  { top: '5%', left: '12%', rotate: -5 },
  { top: '3%', left: '52%', rotate: 3 },
  { top: '18%', left: '32%', rotate: -2 },
  { top: '16%', left: '72%', rotate: 4 },
  { top: '35%', left: '8%', rotate: 2 },
  { top: '38%', left: '48%', rotate: -3 },
  { top: '52%', left: '28%', rotate: 5 },
  { top: '55%', left: '68%', rotate: -4 },
  { top: '70%', left: '15%', rotate: -1 },
  { top: '72%', left: '52%', rotate: 3 },
  { top: '85%', left: '35%', rotate: -2 },
  { top: '82%', left: '75%', rotate: 1 },
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

  // GSAP floating animation for each avatar
  useEffect(() => {
    avatarRefs.current.forEach((avatarEl, index) => {
      if (!avatarEl) return;

      // Initial entrance animation
      gsap.fromTo(
        avatarEl,
        {
          scale: 0,
          opacity: 0,
          rotation: (Math.random() - 0.5) * 30
        },
        {
          scale: 1,
          opacity: 1,
          rotation: avatarPositions[index].rotate,
          duration: 0.6,
          delay: index * 0.08,
          ease: 'back.out(1.7)'
        }
      );

      // Continuous floating animation
      const floatAnimation = () => {
        const randomX = (Math.random() - 0.5) * 60;
        const randomY = (Math.random() - 0.5) * 40;
        const randomRotation = avatarPositions[index].rotate + (Math.random() - 0.5) * 8;
        const duration = 3 + Math.random() * 3;

        const tween = gsap.to(avatarEl, {
          x: randomX,
          y: randomY,
          rotation: randomRotation,
          duration,
          ease: 'sine.inOut',
          onComplete: floatAnimation,
        });
        animationsRef.current.push(tween);
      };

      // Start floating with staggered delay
      setTimeout(floatAnimation, 800 + index * 150);
    });

    return () => {
      animationsRef.current.forEach(anim => anim.kill());
    };
  }, []);

  // Random chat bubbles appearing
  useEffect(() => {
    const showRandomBubble = () => {
      const randomAvatarIndex = Math.floor(Math.random() * uniqueAvatars.length);
      const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      const newBubbleId = bubbleIdRef.current++;

      setChatBubbles(prev => {
        // Only allow max 3 bubbles at a time
        const filtered = prev.length >= 3 ? prev.slice(1) : prev;
        return [...filtered, { id: newBubbleId, avatarIndex: randomAvatarIndex, message: randomMessage }];
      });

      // Remove bubble after delay
      setTimeout(() => {
        setChatBubbles(prev => prev.filter(b => b.id !== newBubbleId));
      }, 2500 + Math.random() * 1500);
    };

    // Show initial bubbles
    setTimeout(showRandomBubble, 1000);
    setTimeout(showRandomBubble, 2000);

    // Continue showing bubbles at intervals
    const interval = setInterval(showRandomBubble, 2000 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Green gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)',
        }}
      />

      {/* Subtle floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-white/10"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Animated Avatar Cards */}
      {uniqueAvatars.map((avatar, index) => {
        const position = avatarPositions[index];
        const bubble = chatBubbles.find(b => b.avatarIndex === index);

        return (
          <div
            key={avatar.id}
            ref={el => avatarRefs.current[index] = el}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              zIndex: 10 + index,
            }}
          >
            {/* Chat Bubble */}
            <AnimatePresence>
              {bubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                >
                  <div
                    className="px-3 py-2 rounded-2xl text-sm font-medium text-white/90 backdrop-blur-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {bubble.message}
                    {/* Bubble tail */}
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '8px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar Card */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="relative"
            >
              {/* Glow effect */}
              <div
                className="absolute -inset-2 rounded-2xl opacity-0 hover:opacity-40 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                }}
              />

              {/* Card */}
              <div
                className="bg-white rounded-xl p-1.5 shadow-xl relative"
                style={{
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-20 h-24 xl:w-24 xl:h-28 object-cover rounded-lg"
                  loading="lazy"
                />

                {/* Online indicator */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                  style={{
                    boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default LoginBackground;
