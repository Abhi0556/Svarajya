'use client';

import { useRouter } from 'next/navigation';
import { MODULE_ORDER } from '@/config/modules.config';
import { getRajyaScoreLabel } from '@/config/rajya.config';

export default function RajyaMapPage() {
  const router = useRouter();
  const stabilityScore = 42; // TODO: derive from calculationEngine

  const { label, color } = getRajyaScoreLabel(stabilityScore);

  return (
    <div className="min-h-screen bg-[var(--color-rajya-bg)] p-4 pb-24">
      {/* Header */}
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-amber-400/60 uppercase mb-1">
          Your Kingdom
        </p>
        <h1 className="text-2xl font-bold text-amber-300 font-cinzel">Rajya Naksha</h1>
        <p className="text-sm text-white/50 mt-1">Svarajya Map</p>

        {/* Stability Score */}
        <div className="mt-4 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
          <div className="text-3xl font-bold" style={{ color }}>
            {stabilityScore}
          </div>
          <div className="text-left">
            <div className="text-xs text-white/40 uppercase tracking-wider">Stability</div>
            <div className="text-sm font-semibold" style={{ color }}>{label}</div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {MODULE_ORDER.map((module) => (
          <button
            key={module.key}
            onClick={() => router.push(module.route)}
            className={`
              relative flex flex-col items-start gap-2 p-4 rounded-2xl border text-left
              transition-all duration-200 active:scale-95
              ${module.isImplemented
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                : 'bg-white/[0.02] border-white/5 opacity-60 cursor-not-allowed'
              }
            `}
            disabled={!module.isImplemented}
          >
            <span className="text-2xl">{module.icon}</span>
            <div>
              <div className="text-xs font-bold text-white/80 leading-tight">{module.hindiName}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{module.name}</div>
            </div>
            {!module.isImplemented && (
              <span className="absolute top-2 right-2 text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            )}
            {module.isImplemented && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
                style={{ backgroundColor: module.color, opacity: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
