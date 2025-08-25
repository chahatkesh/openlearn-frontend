/**
 * Boring Avatars Service
 * Generates beautiful, consistent avatars locally without external API calls
 * Based on the Boring Avatars concept by @boringdesigners
 */
import React from 'react';
import { hashCode, getColors, generateInitials } from './boringAvatarsUtils';

/**
 * Generate Bauhaus-style avatar (geometric shapes)
 */
export const BauhausAvatar = ({ seed, size = 64, palette = 'default' }) => {
  const { background, accent, secondary } = getColors(seed, palette);
  const hash = hashCode(seed);
  
  const shapes = [];
  const numShapes = 3 + (hash % 3);
  
  for (let i = 0; i < numShapes; i++) {
    const shapeHash = hashCode(seed + i);
    const shapeType = shapeHash % 3; // 0: circle, 1: rect, 2: triangle
    const x = (shapeHash % 60) + 10;
    const y = ((shapeHash >> 8) % 60) + 10;
    const shapeSize = 20 + (shapeHash % 30);
    const color = i === 0 ? accent : i === 1 ? secondary : background;
    
    let shape;
    if (shapeType === 0) {
      shape = <circle key={i} cx={x} cy={y} r={shapeSize / 2} fill={color} />;
    } else if (shapeType === 1) {
      shape = <rect key={i} x={x} y={y} width={shapeSize} height={shapeSize} fill={color} />;
    } else {
      const points = `${x},${y + shapeSize} ${x + shapeSize / 2},${y} ${x + shapeSize},${y + shapeSize}`;
      shape = <polygon key={i} points={points} fill={color} />;
    }
    
    shapes.push(shape);
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: '50%' }}>
      <rect width="100" height="100" fill={background} />
      {shapes}
    </svg>
  );
};

/**
 * Generate Beam-style avatar (colorful beams)
 */
export const BeamAvatar = ({ seed, size = 64, palette = 'default' }) => {
  const { background, accent, secondary } = getColors(seed, palette);
  const hash = hashCode(seed);
  
  const beams = [];
  const numBeams = 4 + (hash % 4);
  
  for (let i = 0; i < numBeams; i++) {
    const beamHash = hashCode(seed + i);
    const x = (beamHash % 80) + 10;
    const width = 10 + (beamHash % 20);
    const height = 60 + (beamHash % 40);
    const color = i % 2 === 0 ? accent : secondary;
    
    beams.push(
      <rect
        key={i}
        x={x}
        y={50 - height / 2}
        width={width}
        height={height}
        fill={color}
        rx={width / 2}
      />
    );
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: '50%' }}>
      <rect width="100" height="100" fill={background} rx="50" />
      {beams}
    </svg>
  );
};

/**
 * Generate Marble-style avatar (organic shapes)
 */
export const MarbleAvatar = ({ seed, size = 64, palette = 'default' }) => {
  const { background, accent, secondary } = getColors(seed, palette);
  const hash = hashCode(seed);
  
  const shapes = [];
  const numShapes = 2 + (hash % 3);
  
  for (let i = 0; i < numShapes; i++) {
    const shapeHash = hashCode(seed + i);
    const cx = 30 + (shapeHash % 40);
    const cy = 30 + ((shapeHash >> 8) % 40);
    const rx = 15 + (shapeHash % 25);
    const ry = 15 + ((shapeHash >> 16) % 25);
    const rotation = shapeHash % 360;
    const color = i === 0 ? accent : secondary;
    
    shapes.push(
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={color}
        transform={`rotate(${rotation} ${cx} ${cy})`}
        opacity={0.8}
      />
    );
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: '50%' }}>
      <defs>
        <radialGradient id={`gradient-${hash}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={background} />
          <stop offset="100%" stopColor={accent} stopOpacity={0.3} />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#gradient-${hash})`} rx="50" />
      {shapes}
    </svg>
  );
};

/**
 * Generate initials-based avatar with beautiful gradients
 */
export const InitialsAvatar = ({ seed, name, size = 64, palette = 'default' }) => {
  const { background, accent } = getColors(seed, palette);
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'AN';
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: '50%' }}>
      <defs>
        <linearGradient id={`initials-gradient-${hashCode(seed)}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={background} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#initials-gradient-${hashCode(seed)})`} rx="50" />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
};

/**
 * Main Avatar component with multiple style options
 */
export const BoringAvatar = ({ 
  user, 
  style = 'bauhaus', 
  size = 64, 
  palette = 'default',
  className = ''
}) => {
  const seed = user?.email || user?.name || user?.id || 'anonymous';
  const name = user?.name || user?.email || 'Anonymous';
  
  const avatarProps = { seed, size, palette };
  
  let AvatarComponent;
  switch (style) {
    case 'beam':
      AvatarComponent = BeamAvatar;
      break;
    case 'marble':
      AvatarComponent = MarbleAvatar;
      break;
    case 'initials':
      AvatarComponent = InitialsAvatar;
      avatarProps.name = name;
      break;
    case 'bauhaus':
    default:
      AvatarComponent = BauhausAvatar;
      break;
  }
  
  return (
    <div className={className} style={{ width: size, height: size }}>
      <AvatarComponent {...avatarProps} />
    </div>
  );
};

export default BoringAvatar;
