import React, { useState } from 'react';

// Loader Components
const PulseLoader = ({ size = 50, color = '#3b82f6' }) => (
  <div
    className="rounded-full animate-pulse"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}
  />
);

export const RippleLoader = ({ size = 60, color = '#3b82f6' }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <style>{`
      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
      }
    `}</style>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute inset-0 rounded-full border-4"
        style={{
          borderColor: color,
          animation: `ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite`,
          animationDelay: `${i * 0.6}s`
        }}
      />
    ))}
  </div>
);

export const DotsLoader = ({ size = 12, color = '#3b82f6', spacing = 8 }) => (
  <div className="flex items-center gap-2" style={{ gap: spacing }}>
    <style>{`
      @keyframes dotBounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `}</style>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          animation: 'dotBounce 1.4s infinite ease-in-out both',
          animationDelay: `${i * 0.16}s`
        }}
      />
    ))}
  </div>
);

const WaveLoader = ({ size = 40, color = '#3b82f6', bars = 5 }) => (
  <div className="flex items-end gap-1" style={{ height: size }}>
    <style>{`
      @keyframes wave {
        0%, 40%, 100% { transform: scaleY(0.4); }
        20% { transform: scaleY(1); }
      }
    `}</style>
    {[...Array(bars)].map((_, i) => (
      <div
        key={i}
        style={{
          width: size / 5,
          height: size,
          backgroundColor: color,
          animation: 'wave 1.2s infinite ease-in-out',
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
  </div>
);

const CircularProgressLoader = ({ size = 60, color = '#3b82f6', strokeWidth = 4 }) => (
  <div style={{ width: size, height: size }}>
    <style>{`
      @keyframes circularProgress {
        0% { stroke-dashoffset: 283; }
        100% { stroke-dashoffset: 0; }
      }
    `}</style>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="283"
        strokeDashoffset="283"
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{
          animation: 'circularProgress 2s ease-in-out infinite'
        }}
      />
    </svg>
  </div>
);

const ShimmerLoader = ({ width = 200, height = 20, color = '#e5e7eb' }) => (
  <div
    className="relative overflow-hidden rounded"
    style={{ width, height, backgroundColor: color }}
  >
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        animation: 'shimmer 1.5s infinite'
      }}
    />
  </div>
);

const TypingLoader = ({ size = 10, color = '#3b82f6' }) => (
  <div className="flex items-center gap-1">
    <style>{`
      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }
    `}</style>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          animation: 'typing 1.4s infinite ease-in-out',
          animationDelay: `${i * 0.2}s`
        }}
      />
    ))}
  </div>
);

const FlipLoader = ({ size = 50, color = '#3b82f6' }) => (
  <div style={{ width: size, height: size, perspective: 200 }}>
    <style>{`
      @keyframes flip {
        0%, 100% { transform: rotateY(0deg); }
        50% { transform: rotateY(180deg); }
      }
    `}</style>
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        animation: 'flip 2s infinite ease-in-out',
        transformStyle: 'preserve-3d'
      }}
    />
  </div>
);

const CubeGridLoader = ({ size = 60, color = '#3b82f6' }) => {
  const cubeSize = size / 3.5;
  return (
    <div
      className="grid grid-cols-3 gap-1"
      style={{ width: size, height: size }}
    >
      <style>{`
        @keyframes cubeScale {
          0%, 70%, 100% { transform: scale(1); }
          35% { transform: scale(0); }
        }
      `}</style>
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          style={{
            width: cubeSize,
            height: cubeSize,
            backgroundColor: color,
            animation: 'cubeScale 1.3s infinite ease-in-out',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

const RingLoader = ({ size = 60, color = '#3b82f6', strokeWidth = 4 }) => (
  <div className="animate-spin" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="70 200"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const ClockLoader = ({ size = 60, color = '#3b82f6' }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <style>{`
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    <div
      className="absolute inset-0 rounded-full border-4"
      style={{ borderColor: `${color}30` }}
    />
    <div
      className="absolute left-1/2 top-1/2 origin-top"
      style={{
        width: 3,
        height: size / 3,
        backgroundColor: color,
        transform: 'translateX(-50%) translateY(-100%)',
        animation: 'rotate 2s linear infinite'
      }}
    />
  </div>
);

const HeartbeatLoader = ({ size = 50, color = '#ef4444' }) => (
  <div
    className="rounded-full"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      animation: 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}
  >
    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
      }
    `}</style>
  </div>
);

const ZigzagLoader = ({ size = 50, color = '#3b82f6' }) => (
  <div className="relative" style={{ width: size * 2, height: size }}>
    <style>{`
      @keyframes zigzag {
        0% { transform: translate(0, 0); }
        25% { transform: translate(${size}px, 0); }
        50% { transform: translate(${size}px, ${size / 2}px); }
        75% { transform: translate(0, ${size / 2}px); }
        100% { transform: translate(0, 0); }
      }
    `}</style>
    <div
      className="absolute rounded-full"
      style={{
        width: size / 3,
        height: size / 3,
        backgroundColor: color,
        animation: 'zigzag 2s infinite ease-in-out'
      }}
    />
  </div>
);

const GearLoader = ({ size = 60, color = '#3b82f6' }) => (
  <div className="animate-spin" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M50,10 L55,25 L70,25 L58,35 L63,50 L50,40 L37,50 L42,35 L30,25 L45,25 Z"
        fill={color}
        transform="translate(0, 15)"
      />
    </svg>
  </div>
);

const FlowLoader = ({ size = 12, color = '#3b82f6', width = 100 }) => (
  <div className="relative" style={{ width, height: size }}>
    <style>{`
      @keyframes flow {
        0% { left: 0; }
        100% { left: calc(100% - ${size}px); }
      }
    `}</style>
    <div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        animation: 'flow 1.5s infinite ease-in-out'
      }}
    />
  </div>
);

const StretchLoader = ({ size = 50, color = '#3b82f6' }) => (
  <div className="flex items-center gap-2" style={{ height: size / 3 }}>
    <style>{`
      @keyframes stretch {
        0%, 100% { transform: scaleX(1); }
        50% { transform: scaleX(1.5); }
      }
    `}</style>
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          width: size / 3,
          height: size / 3,
          backgroundColor: color,
          animation: 'stretch 1s infinite ease-in-out',
          animationDelay: `${i * 0.5}s`
        }}
      />
    ))}
  </div>
);

const RotateLoader = ({ size = 60, color = '#3b82f6' }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <style>{`
      @keyframes orbit {
        0% { transform: rotate(0deg) translateX(${size / 3}px) rotate(0deg); }
        100% { transform: rotate(360deg) translateX(${size / 3}px) rotate(-360deg); }
      }
    `}</style>
    <div
      className="absolute left-1/2 top-1/2 rounded-full"
      style={{
        width: size / 4,
        height: size / 4,
        backgroundColor: color,
        marginLeft: -size / 8,
        marginTop: -size / 8,
        animation: 'orbit 1.5s linear infinite'
      }}
    />
  </div>
);

const BounceLoader = ({ size = 50, color = '#3b82f6' }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <style>{`
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-${size / 2}px); }
      }
    `}</style>
    <div
      className="absolute bottom-0 rounded-full"
      style={{
        width: size / 2,
        height: size / 2,
        backgroundColor: color,
        animation: 'bounce 0.8s infinite ease-in-out'
      }}
    />
  </div>
);

const SlideLoader = ({ size = 50, color = '#3b82f6', width = 100 }) => (
  <div className="relative" style={{ width, height: size / 3 }}>
    <style>{`
      @keyframes slide {
        0%, 100% { left: 0; }
        50% { left: calc(100% - ${size}px); }
      }
    `}</style>
    <div
      className="absolute"
      style={{
        width: size,
        height: size / 3,
        backgroundColor: color,
        animation: 'slide 1.5s infinite ease-in-out'
      }}
    />
  </div>
);

// Demo Component
export default function LoaderShowcase() {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedSize, setSelectedSize] = useState(50);

  const loaders = [
    { name: 'Pulse Loader', component: PulseLoader },
    { name: 'Ripple Loader', component: RippleLoader },
    { name: 'Dots Loader', component: DotsLoader },
    { name: 'Wave Loader', component: WaveLoader },
    { name: 'Circular Progress', component: CircularProgressLoader },
    { name: 'Shimmer Loader', component: ShimmerLoader, customProps: { width: 200, height: 20 } },
    { name: 'Typing Loader', component: TypingLoader },
    { name: 'Flip Loader', component: FlipLoader },
    { name: 'Cube Grid', component: CubeGridLoader },
    { name: 'Ring Loader', component: RingLoader },
    { name: 'Clock Loader', component: ClockLoader },
    { name: 'Heartbeat Loader', component: HeartbeatLoader },
    { name: 'Zigzag Loader', component: ZigzagLoader },
    { name: 'Gear Loader', component: GearLoader },
    { name: 'Flow Loader', component: FlowLoader, customProps: { width: 100 } },
    { name: 'Stretch Loader', component: StretchLoader },
    { name: 'Rotate Loader', component: RotateLoader },
    { name: 'Bounce Loader', component: BounceLoader },
    { name: 'Slide Loader', component: SlideLoader, customProps: { width: 100 } }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">React Loader Components</h1>
        <p className="text-gray-600 mb-8">Customizable loaders with size and color props</p>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Customize Loaders</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <label className="font-medium text-gray-700">Color:</label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="font-medium text-gray-700">Size:</label>
              <input
                type="range"
                min="20"
                max="100"
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">{selectedSize}px</span>
            </div>
          </div>
        </div>

        {/* Loaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loaders.map(({ name, component: LoaderComponent, customProps }) => (
            <div key={name} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
              <div className="flex-1 flex items-center justify-center mb-4">
                <LoaderComponent
                  size={selectedSize}
                  color={selectedColor}
                  {...(customProps || {})}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <code className="text-xs text-gray-500 mt-2 bg-gray-100 px-2 py-1 rounded">
                &lt;{name.replace(' ', '')} size={selectedSize} color="{selectedColor}" /&gt;
              </code>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Usage Instructions</h2>
          <div className="space-y-4 text-gray-700">
            <p>All loaders accept the following props:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><code className="bg-gray-100 px-2 py-1 rounded">size</code> - Number (default: 50) - Controls the loader size in pixels</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">color</code> - String (default: '#3b82f6') - Any valid CSS color</li>
            </ul>
            <p className="mt-4">Some loaders have additional props:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>ShimmerLoader:</strong> <code className="bg-gray-100 px-2 py-1 rounded">width</code>, <code className="bg-gray-100 px-2 py-1 rounded">height</code></li>
              <li><strong>WaveLoader:</strong> <code className="bg-gray-100 px-2 py-1 rounded">bars</code> - Number of bars</li>
              <li><strong>DotsLoader:</strong> <code className="bg-gray-100 px-2 py-1 rounded">spacing</code> - Gap between dots</li>
              <li><strong>FlowLoader, SlideLoader:</strong> <code className="bg-gray-100 px-2 py-1 rounded">width</code> - Track width</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}