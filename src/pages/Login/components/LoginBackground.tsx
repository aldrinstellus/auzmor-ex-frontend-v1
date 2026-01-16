import { FC } from 'react';

// 12 unique avatar photos - using diverse professional headshots
const uniqueAvatars = [
  { id: 1, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', name: 'Sarah Chen' },
  { id: 2, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', name: 'Marcus Johnson' },
  { id: 3, src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', name: 'Emily Davis' },
  { id: 4, src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', name: 'David Kim' },
  { id: 5, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', name: 'Sophia Martinez' },
  { id: 6, src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', name: 'James Wilson' },
  { id: 7, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face', name: 'Olivia Brown' },
  { id: 8, src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', name: 'Michael Lee' },
  { id: 9, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', name: 'Ava Thompson' },
  { id: 10, src: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face', name: 'Robert Garcia' },
  { id: 11, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face', name: 'Isabella Wang' },
  { id: 12, src: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face', name: 'Daniel Park' },
];

// Fixed positions for avatar cards to match original layout
const avatarPositions = [
  { top: '8%', left: '15%', rotate: -5 },
  { top: '5%', left: '55%', rotate: 3 },
  { top: '22%', left: '35%', rotate: -2 },
  { top: '20%', left: '75%', rotate: 4 },
  { top: '38%', left: '12%', rotate: 2 },
  { top: '42%', left: '52%', rotate: -3 },
  { top: '55%', left: '30%', rotate: 5 },
  { top: '58%', left: '70%', rotate: -4 },
  { top: '72%', left: '18%', rotate: -1 },
  { top: '75%', left: '55%', rotate: 3 },
  { top: '88%', left: '38%', rotate: -2 },
  { top: '85%', left: '78%', rotate: 1 },
];

interface LoginBackgroundProps {
  className?: string;
}

const LoginBackground: FC<LoginBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Green gradient background matching original */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)',
        }}
      />

      {/* Decorative shapes - subtle rectangles like original */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[5%] left-[20%] w-32 h-40 bg-white/10 rounded-2xl rotate-6" />
        <div className="absolute top-[15%] right-[15%] w-28 h-36 bg-white/10 rounded-2xl -rotate-3" />
        <div className="absolute bottom-[20%] left-[10%] w-24 h-32 bg-white/10 rounded-2xl rotate-12" />
        <div className="absolute bottom-[10%] right-[25%] w-20 h-28 bg-white/10 rounded-2xl -rotate-6" />
      </div>

      {/* Welcome text */}
      <div className="absolute left-8 top-1/3 transform -translate-y-1/2 z-10">
        <h1 className="text-white text-5xl xl:text-6xl font-bold leading-tight">
          Welcome to
          <br />
          Auzmor Office
        </h1>
      </div>

      {/* Unique Avatar Cards */}
      {uniqueAvatars.map((avatar, index) => {
        const position = avatarPositions[index];
        return (
          <div
            key={avatar.id}
            className="absolute transition-transform duration-300 hover:scale-105"
            style={{
              top: position.top,
              left: position.left,
              transform: `rotate(${position.rotate}deg)`,
              zIndex: index + 1,
            }}
          >
            <div
              className="bg-white rounded-xl p-1.5 shadow-xl"
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={avatar.src}
                alt={avatar.name}
                className="w-20 h-24 xl:w-24 xl:h-28 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoginBackground;
