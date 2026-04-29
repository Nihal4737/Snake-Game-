/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00f3ff 1px, transparent 1px),
            linear-gradient(to bottom, #ff00ea 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(3)',
          transformOrigin: 'top center'
        }}
      />

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg/40 via-dark-bg/80 to-dark-bg z-0 pointer-events-none" />

      <div className="z-10 flex flex-col xl:flex-row items-center xl:items-start gap-12 w-full max-w-6xl justify-center">
        {/* Game section */}
        <div className="flex-1 flex justify-center">
          <SnakeGame />
        </div>

        {/* Music section */}
        <div className="xl:w-96 flex flex-col gap-6">
          <MusicPlayer />
          
          <div className="glass-panel p-6 rounded-xl border border-neon-cyan/20">
            <h3 className="font-sans text-neon-cyan tracking-widest uppercase text-sm mb-4">System Status</h3>
            <ul className="font-mono text-xs text-gray-400 space-y-2">
              <li className="flex justify-between">
                <span>Audio Engine</span>
                <span className="text-neon-green">ONLINE</span>
              </li>
              <li className="flex justify-between">
                <span>Game State</span>
                <span className="text-neon-cyan">ACTIVE</span>
              </li>
              <li className="flex justify-between">
                <span>Grid Integrity</span>
                <span className="text-neon-pink">100%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
