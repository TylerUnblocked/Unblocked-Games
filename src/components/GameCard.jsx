/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Grid,
  Hexagon,
  Layers,
  TrendingUp,
  Bird,
  Zap,
  BrainCircuit,
  Globe,
  Heart,
  Play,
  Star,
  Tv,
  Bomb,
  Rocket,
  Gamepad,
  Cpu
} from "lucide-react";

// Safe static icon map to prevent dynamic lookup issues
const IconMap = {
  Grid: Grid,
  Hexagon: Hexagon,
  Layers: Layers,
  TrendingUp: TrendingUp,
  Bird: Bird,
  Zap: Zap,
  BrainCircuit: BrainCircuit,
  Globe: Globe,
  Bomb: Bomb,
  Rocket: Rocket,
  Gamepad: Gamepad,
  Cpu: Cpu,
};

export default function GameCard({ game, isFavorite, onToggleFavorite, onLaunch }) {
  // Safe icon lookup falling back to Globe icon
  const GameIcon = IconMap[game.iconName] || Globe;

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onLaunch(game)}
      className="group relative bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] flex flex-col h-full cursor-pointer select-none"
    >
      {/* Thumbnail Gradient Cover */}
      <div className={`h-32 w-full bg-gradient-to-br ${game.gradient} relative flex items-center justify-center overflow-hidden`}>
        {/* Abstract scanlines pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

        {/* Big icon floating on gradient */}
        <div className="relative transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]">
          <GameIcon className="w-12 h-12 text-white opacity-95" />
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-${game.id}`}
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all border outline-none ${
            isFavorite
              ? "bg-rose-500/10 border-rose-500/40 text-rose-500 hover:bg-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              : "bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-950/80"
          }`}
          title={isFavorite ? "Remove Favorite" : "Add to Favorites"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current scale-105" : ""}`} />
        </button>

        {/* Category tag bubble */}
        <span className="absolute bottom-2.5 left-2.5 text-[10px] uppercase font-mono tracking-wider bg-zinc-950/60 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-800/40">
          {game.category}
        </span>
      </div>

      {/* Content Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-display font-bold text-sm text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-1 leading-tight">
              {game.title}
            </h3>
            {game.isUserAdded && (
              <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1 rounded uppercase font-mono">
                My Link
              </span>
            )}
            {game.isBuiltIn && (
              <span className="text-[9px] bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 px-1 rounded uppercase font-mono">
                Native
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {game.description}
          </p>
        </div>

        {/* Stats & Actions Row */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-900 font-mono text-[11px] text-zinc-500 mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <strong className="text-zinc-300 font-bold">{game.rating.toFixed(1)}</strong>
            </span>
            <span>•</span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Tv className="w-3 h-3 text-zinc-600" />
              {game.playCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-400 group-hover:text-indigo-300 font-bold transition-transform group-hover:translate-x-0.5">
            LAUNCH <Play className="w-3 h-3 fill-current animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
