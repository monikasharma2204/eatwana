import React, { useState } from 'react';

// ============================================
// REUSABLE LOADER COMPONENTS
// ============================================

// Classic Spinner
export const Spinner = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-8 h-8 border-2', md: 'w-12 h-12 border-3', lg: 'w-16 h-16 border-4', xl: 'w-20 h-20 border-4' };
    const colors = {
        blue: 'border-blue-200 border-t-blue-500',
        purple: 'border-purple-200 border-t-purple-500',
        green: 'border-green-200 border-t-green-500',
        red: 'border-red-200 border-t-red-500',
        pink: 'border-pink-200 border-t-pink-500',
    };
    return <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}></div>;
};

// Double Ring Spinner
export const DoubleRing = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-20 h-20' };
    const colors = {
        blue: 'border-blue-200 border-t-blue-500',
        purple: 'border-purple-200 border-t-purple-500',
        green: 'border-green-200 border-t-green-500',
        red: 'border-red-200 border-t-red-500',
        pink: 'border-pink-200 border-t-pink-500',
    };
    return (
        <div className={`relative ${sizes[size]}`}>
            <div className={`absolute inset-0 border-4 ${colors[color]} rounded-full animate-spin`}></div>
            <div className={`absolute inset-2 border-4 ${colors[color]} rounded-full`} style={{ animation: 'spin 1s linear infinite reverse' }}></div>
        </div>
    );
};

// Gradient Spinner
export const GradientSpinner = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-20 h-20' };
    const innerSizes = { sm: 'w-5 h-5 m-1.5', md: 'w-8 h-8 m-2', lg: 'w-11 h-11 m-2.5', xl: 'w-14 h-14 m-3' };
    const colors = {
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-pink-500',
        green: 'from-emerald-500 to-green-500',
        red: 'from-red-500 to-orange-500',
        pink: 'from-pink-500 to-rose-500',
    };
    return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-tr ${colors[color]} animate-spin`}>
            <div className={`${innerSizes[size]} bg-white rounded-full`}></div>
        </div>
    );
};

// Progress Bar
export const ProgressBar = ({ size = 'md', color = 'blue', type = 'pulse' }) => {
    const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3', xl: 'h-4' };
    const colors = {
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-pink-500',
        green: 'from-emerald-500 to-green-500',
        red: 'from-red-500 to-orange-500',
        pink: 'from-pink-500 to-rose-500',
    };

    return (
        <div className={`w-full bg-gray-200 rounded-full ${sizes[size]} overflow-hidden`}>
            {type === 'pulse' && (
                <div className={`h-full bg-gradient-to-r ${colors[color]} rounded-full animate-pulse`}></div>
            )}
            {type === 'indeterminate' && (
                <div className={`h-full w-1/3 bg-gradient-to-r ${colors[color]} rounded-full`} style={{ animation: 'slide 1.5s ease-in-out infinite' }}></div>
            )}
        </div>
    );
};

// Bouncing Balls
export const BouncingBalls = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4', xl: 'w-5 h-5' };
    const gaps = { sm: 'gap-1', md: 'gap-1.5', lg: 'gap-2', xl: 'gap-2.5' };
    const colors = {
        blue: ['bg-blue-500', 'bg-cyan-500', 'bg-teal-500'],
        purple: ['bg-purple-500', 'bg-pink-500', 'bg-blue-500'],
        green: ['bg-emerald-500', 'bg-green-500', 'bg-lime-500'],
        red: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'],
        pink: ['bg-pink-500', 'bg-rose-500', 'bg-purple-500'],
    };
    return (
        <div className={`flex ${gaps[size]}`}>
            <div className={`${sizes[size]} ${colors[color][0]} rounded-full`} style={{ animation: 'bounce 0.6s ease-in-out infinite' }}></div>
            <div className={`${sizes[size]} ${colors[color][1]} rounded-full`} style={{ animation: 'bounce 0.6s ease-in-out 0.2s infinite' }}></div>
            <div className={`${sizes[size]} ${colors[color][2]} rounded-full`} style={{ animation: 'bounce 0.6s ease-in-out 0.4s infinite' }}></div>
        </div>
    );
};

// Bouncing Bars
export const BouncingBars = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-1 h-6', md: 'w-1.5 h-8', lg: 'w-2 h-12', xl: 'w-3 h-16' };
    const colors = {
        blue: ['bg-blue-500', 'bg-cyan-500', 'bg-teal-500'],
        purple: ['bg-purple-500', 'bg-pink-500', 'bg-blue-500'],
        green: ['bg-emerald-500', 'bg-green-500', 'bg-lime-500'],
        red: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'],
        pink: ['bg-pink-500', 'bg-rose-500', 'bg-purple-500'],
    };
    return (
        <div className={`flex gap-1 items-end ${sizes[size]}`}>
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
                <div key={i} className={`${sizes[size].split(' ')[0]} ${colors[color][i % 3]} rounded-t`} style={{ animation: `grow 0.6s ease-in-out ${delay}s infinite` }}></div>
            ))}
        </div>
    );
};

// Pulse Circle
export const PulseCircle = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-20 h-20' };
    const colors = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-emerald-500',
        red: 'bg-red-500',
        pink: 'bg-pink-500',
    };
    return (
        <div className={`relative ${sizes[size]}`}>
            <div className={`absolute inset-0 ${colors[color]} rounded-full animate-ping opacity-75`}></div>
            <div className={`absolute inset-0 ${colors[color]} rounded-full`}></div>
        </div>
    );
};

// Blinking Dots
export const BlinkingDots = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4', xl: 'w-5 h-5' };
    const gaps = { sm: 'gap-1', md: 'gap-2', lg: 'gap-2.5', xl: 'gap-3' };
    const colors = {
        blue: ['bg-blue-500', 'bg-cyan-500', 'bg-teal-500'],
        purple: ['bg-purple-500', 'bg-pink-500', 'bg-blue-500'],
        green: ['bg-emerald-500', 'bg-green-500', 'bg-lime-500'],
        red: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'],
        pink: ['bg-pink-500', 'bg-rose-500', 'bg-purple-500'],
    };
    return (
        <div className={`flex ${gaps[size]}`}>
            <div className={`${sizes[size]} ${colors[color][0]} rounded-full`} style={{ animation: 'blink 1.4s ease-in-out infinite' }}></div>
            <div className={`${sizes[size]} ${colors[color][1]} rounded-full`} style={{ animation: 'blink 1.4s ease-in-out 0.2s infinite' }}></div>
            <div className={`${sizes[size]} ${colors[color][2]} rounded-full`} style={{ animation: 'blink 1.4s ease-in-out 0.4s infinite' }}></div>
        </div>
    );
};

// Chasing Dots
export const ChasingDots = ({ size = 'md', color = 'blue' }) => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-20 h-20' };
    const dotSizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4', xl: 'w-5 h-5' };
    const colors = {
        blue: ['bg-blue-500', 'bg-cyan-500', 'bg-teal-500'],
        purple: ['bg-purple-500', 'bg-pink-500', 'bg-blue-500'],
        green: ['bg-emerald-500', 'bg-green-500', 'bg-lime-500'],
        red: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'],
        pink: ['bg-pink-500', 'bg-rose-500', 'bg-purple-500'],
    };
    return (
        <div className={`relative ${sizes[size]}`}>
            <div className={`absolute top-0 left-1/2 ${dotSizes[size]} -ml-1.5 ${colors[color][0]} rounded-full`} style={{ animation: 'orbit 1.2s linear infinite' }}></div>
            <div className={`absolute top-0 left-1/2 ${dotSizes[size]} -ml-1.5 ${colors[color][1]} rounded-full`} style={{ animation: 'orbit 1.2s linear 0.4s infinite' }}></div>
            <div className={`absolute top-0 left-1/2 ${dotSizes[size]} -ml-1.5 ${colors[color][2]} rounded-full`} style={{ animation: 'orbit 1.2s linear 0.8s infinite' }}></div>
        </div>
    );
};

// ============================================
// DEMO COMPONENT
// ============================================

const Loader = () => {
    const [selectedLoader, setSelectedLoader] = useState('Spinner');
    const [size, setSize] = useState('md');
    const [color, setColor] = useState('blue');

    const loaders = [
        { name: 'Spinner', component: Spinner },
        { name: 'DoubleRing', component: DoubleRing },
        { name: 'GradientSpinner', component: GradientSpinner },
        { name: 'ProgressBar', component: ProgressBar },
        { name: 'BouncingBalls', component: BouncingBalls },
        { name: 'BouncingBars', component: BouncingBars },
        { name: 'PulseCircle', component: PulseCircle },
        { name: 'BlinkingDots', component: BlinkingDots },
        { name: 'ChasingDots', component: ChasingDots },
    ];

    const LoaderComponent = loaders.find(l => l.name === selectedLoader)?.component;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <style>{`
        @keyframes slide {
          0% { left: -33%; }
          100% { left: 100%; }
        }
        @keyframes grow {
          0%, 100% { height: 16px; }
          50% { height: 48px; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(28px); }
          100% { transform: rotate(360deg) translateX(28px); }
        }
      `}</style>

            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2 text-center">
                    Reusable Loading Components
                </h1>
                <p className="text-slate-300 text-center mb-8">
                    Export and use these loaders anywhere in your project
                </p>

                {/* Controls */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Loader Selection */}
                        <div>
                            <label className="text-white font-medium mb-2 block">Loader Type</label>
                            <select
                                value={selectedLoader}
                                onChange={(e) => setSelectedLoader(e.target.value)}
                                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {loaders.map(loader => (
                                    <option key={loader.name} value={loader.name}>{loader.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <label className="text-white font-medium mb-2 block">Size</label>
                            <div className="flex gap-2">
                                {['sm', 'md', 'lg', 'xl'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${size === s ? 'bg-blue-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        {s.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <label className="text-white font-medium mb-2 block">Color</label>
                            <div className="flex gap-2">
                                {['blue', 'purple', 'green', 'red', 'pink'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all capitalize ${color === c ? `bg-${c}-500 text-white` : 'bg-slate-700 text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 mb-8 flex flex-col items-center justify-center min-h-[300px]">
                    <h2 className="text-2xl font-bold text-white mb-8">Preview</h2>
                    {LoaderComponent && <LoaderComponent size={size} color={color} />}
                </div>

                {/* Usage Code */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Usage Code</h3>
                    <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                        <code className="text-green-400 text-sm">
                            {`// Import the component
import { ${selectedLoader} } from './LoadingComponents';

// Use it in your component
<${selectedLoader} size="${size}" color="${color}" />`}
                        </code>
                    </pre>
                </div>

                {/* All Loaders Grid */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">All Available Loaders</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loaders.map(({ name, component: Component }) => (
                            <div
                                key={name}
                                onClick={() => setSelectedLoader(name)}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center justify-center min-h-[150px] cursor-pointer hover:bg-white/20 transition-all"
                            >
                                <Component size="md" color={color} />
                                <p className="text-white mt-4 text-sm font-medium text-center">{name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;