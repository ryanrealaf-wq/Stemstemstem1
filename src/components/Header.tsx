/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Sparkles,
  Layers,
  Cpu,
  Download,
  Music2,
  Volume2,
  VolumeX,
  Smartphone,
} from 'lucide-react';
import { SongPipelineResult } from '../types';
import { isAndroidPlatform } from '../lib/androidBridge';

interface HeaderProps {
  pipelineResult: SongPipelineResult | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playSynthMidi: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onTogglePlaySynthMidi: () => void;
  onOpenExport: () => void;
  onSelectTrackModal: () => void;
  onOpenAndroidPackage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pipelineResult,
  isPlaying,
  currentTime,
  duration,
  playSynthMidi,
  onTogglePlay,
  onStop,
  onTogglePlaySynthMidi,
  onOpenExport,
  onSelectTrackModal,
  onOpenAndroidPackage,
}) => {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(isAndroidPlatform());
  }, []);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const metadata = pipelineResult?.metadata;

  return (
    <header className="sticky top-0 z-40 bg-[#101217]/95 backdrop-blur-md border-b border-[#292D38] px-4 py-2.5 sm:px-6 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 bg-black border-2 border-[#DC2626] rounded flex items-center justify-center shadow-crimson-glow">
              <svg className="w-5 h-5 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M2 10h3l2-6 4 16 4-12 2 6h5" />
                <path d="M12 18v3" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-mono font-black text-base leading-tight uppercase tracking-wider">
                  StemFlow <span className="text-[#DC2626]">AI</span>
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 border border-[#DC2626]/50 text-red-300 uppercase">
                  BWB 001
                </span>
                {isAndroid && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center gap-1 uppercase">
                    <Smartphone className="w-2.5 h-2.5" />
                    Android API
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span>Audio DSP & Neural Separation</span>
              </p>
            </div>
          </div>

          {/* Quick Action buttons on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenAndroidPackage}
              className="px-2.5 py-1 rounded bg-[#DC2626] hover:bg-red-700 text-[10px] font-mono font-bold text-white shadow-crimson-glow transition uppercase tracking-wider flex items-center gap-1"
              title="Download Android APK"
            >
              <Smartphone className="w-3 h-3 text-white" />
              APK 4.4M
            </button>
            <button
              onClick={onSelectTrackModal}
              className="px-2.5 py-1 rounded bg-[#1A1D26] text-[10px] font-mono text-zinc-300 border border-[#292D38] hover:bg-zinc-800 transition uppercase tracking-wider"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Center Transport & Track Telemetry */}
        <div className="flex items-center gap-3 sm:gap-5">
          {metadata && (
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Loaded Audio</span>
              <span className="text-xs text-cyan-400 font-mono italic truncate max-w-[180px]">
                {metadata.title}.wav
              </span>
            </div>
          )}

          {metadata && <div className="hidden lg:block h-6 w-px bg-[#292D38]" />}

          {/* Tempo Badge */}
          {metadata && (
            <div className="hidden sm:flex flex-col items-center px-1">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Tempo</span>
              <span className="text-sm font-bold text-white tabular-nums font-mono">
                {metadata.bpm.toFixed(1)} <span className="text-[9px] text-zinc-500 uppercase">BPM</span>
              </span>
            </div>
          )}

          {metadata && <div className="hidden sm:block h-6 w-px bg-[#292D38]" />}

          {/* Transport Controls */}
          <div className="flex items-center gap-2 bg-[#07080A] px-3 py-1 rounded border border-[#292D38]">
            <button
              onClick={onStop}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#1A1D26] transition"
              title="Stop & Reset to 0:00"
            >
              <Square className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              disabled={!pipelineResult}
              className={`w-7 h-7 rounded flex items-center justify-center transition font-bold ${
                isPlaying
                  ? 'bg-[#10B981] text-black hover:bg-emerald-400 shadow-sm'
                  : 'bg-[#DC2626] text-white hover:bg-red-600 shadow-crimson-glow'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <div className="px-2 text-center min-w-[70px]">
              <span className="font-mono text-xs font-bold text-[#DC2626] tabular-nums block">
                {formatTime(currentTime)}
              </span>
              <span className="text-[9px] text-zinc-500 block font-mono">
                / {formatTime(duration)}
              </span>
            </div>

            <div className="h-4 w-px bg-[#292D38]" />

            {/* Synthesizer vs Audio Stems Toggle */}
            <button
              onClick={onTogglePlaySynthMidi}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition ${
                playSynthMidi
                  ? 'bg-cyan-950/40 text-[#06B6D4] border border-[#06B6D4]/50'
                  : 'bg-[#1A1D26] text-zinc-400 hover:text-zinc-200 border border-[#292D38]'
              }`}
              title="Toggle MIDI Synthesizer vs Separated Stem Audio"
            >
              <Music2 className="w-3 h-3 text-[#06B6D4]" />
              <span className="hidden sm:inline">{playSynthMidi ? 'Synth On' : 'Stems Only'}</span>
            </button>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenAndroidPackage}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#DC2626] hover:bg-red-700 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-crimson-glow transition"
            title="Download complete Android APK (4.42 MB) & Native API"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android APK</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-red-200 border border-white/20">
              4.4M
            </span>
          </button>

          <button
            onClick={onSelectTrackModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1A1D26] text-xs font-mono uppercase tracking-wider text-zinc-300 border border-[#292D38] hover:bg-zinc-800 hover:text-white transition"
          >
            <Cpu className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Ingest Audio</span>
          </button>

          <button
            onClick={onOpenExport}
            disabled={!pipelineResult}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-gradient-to-r from-[#DC2626] to-red-900 hover:from-red-600 hover:to-red-950 text-xs font-mono uppercase tracking-wider font-bold text-white border border-red-500/40 shadow-crimson-glow transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Bundle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
