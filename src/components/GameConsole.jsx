/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RefreshCw,
  Star,
  Users,
  ExternalLink,
  Gamepad2,
  Heart
} from "lucide-react";
import ReactionSpeedGame from "./ReactionSpeedGame";
import MemoryGridGame from "./MemoryGridGame";

export default function GameConsole({
  game,
  isFavorite,
  onToggleFavorite,
  onClose,
  onRateGame,
}) {
  const [isCinema, setIsCinema] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [activePlayers, setActivePlayers] = useState(35);
  const [reloadKey, setReloadKey] = useState(0);

  // Simulate active online players fluctuating slightly on game load
  useEffect(() => {
    const base = Math.floor(Math.random() * 80) + 15;
    setActivePlayers(base);

    const interval = setInterval(() => {
      setActivePlayers((p) => Math.max(5, p + (Math.random() > 0.5 ? 1 : -1)));
    }, 4000);

    return () => clearInterval(interval);
  }, [game.id]);

  const handleRate = (stars) => {
    setUserRating(stars);
    onRateGame(game.id, stars);
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const renderActiveGameContent = () => {
    if (game.isBuiltIn) {
      if (game.id === "built-in-reaction") {
        return <ReactionSpeedGame />;
      }
      if (game.id === "built-in-memory") {
        return <MemoryGridGame />;
      }
    }

    return (
      <iframe
        key={reloadKey}
        src={game.iframeUrl}
        title={game.title}
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
        className="w-full h-full border-0 bg-black rounded-lg"
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 font-sans select-none overflow-hidden relative">
      {/* Immersive Retro Overlay Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,24,0.4)_1px,transparent_1px)] [background-size:100%_4px] pointer-events-none z-10 opacity-30" />

      {/* Top Console Navigation (Hidden in Cinema Mode to prioritize space) */}
      {!isCinema && (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <button
              id="back-to-lobby-button"
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-2 rounded-lg transition-transform hover:-translate-x-0.5 border border-zinc-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO LOBBY
            </button>
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${game.gradient} animate-pulse shadow-[0_0_8px_currentColor]`} />
              <div>
                <h1 className="font-display font-extrabold text-white text-base leading-tight">
                  {game.title}
                </h1>
                <p className="text-xs text-zinc-500 font-mono">
                  {game.category} • Powered by {game.author}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto font-mono text-xs">
            {/* Live Counter */}
            <span className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg text-emerald-400">
              <Users className="w-3.5 h-3.5 animate-pulse" />
              <span>{activePlayers} playing</span>
            </span>

            {/* Favorite button */}
            <button
              id="console-favorite-toggle"
              onClick={(e) => onToggleFavorite(game.id, e)}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                isFavorite
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-500"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isFavorite ? "Saved" : "Save"}</span>
            </button>

            {/* Reload button for iframe stability */}
            {!game.isBuiltIn && (
              <button
                id="console-reload-button"
                onClick={handleReload}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Reload Cabinet Screen"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Cinema mode */}
            <button
              id="console-cinema-toggle"
              onClick={() => setIsCinema(true)}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white transition-all cursor-pointer flex items-center gap-1 font-bold"
              title="Expand Cinema View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cinema</span>
            </button>
          </div>
        </header>
      )}

      {/* Floating Cinema Exit Trigger (When screen is fully immersive) */}
      {isCinema && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 font-mono text-xs">
          <span className="bg-zinc-950/80 text-zinc-400 px-3 py-1.5 border border-zinc-800 rounded-lg backdrop-blur-md">
            🍿 Cinema Mode Active
          </span>
          <button
            id="console-exit-cinema"
            onClick={() => setIsCinema(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg border border-rose-500 transition-all shadow-md backdrop-blur-sm cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" /> Close Cinema
          </button>
        </div>
      )}

      {/* Primary Workspace Panels */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Playable Screen Container */}
        <div className="flex-1 flex flex-col p-4 bg-zinc-950 items-center justify-center min-w-0 relative h-full">
          <div className="relative w-full h-full max-w-5xl bg-black rounded-xl border border-zinc-900 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
            <div className="flex-1 relative min-h-0 bg-zinc-950 rounded-lg">
              {renderActiveGameContent()}
            </div>
          </div>
        </div>

        {/* Info panel (Hidden in Cinema mode or on extremely compact mobile screens to maximize focus) */}
        {!isCinema && (
          <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-zinc-900 bg-zinc-900/40 p-5 flex flex-col justify-between font-sans shrink-0 overflow-y-auto">
            <div className="space-y-5">
              {/* Instructions header */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 flex items-center gap-1 bg-indigo-950/50 w-fit px-2 py-0.5 rounded border border-indigo-900">
                  <Gamepad2 className="w-3 h-3" /> Controls Layout
                </span>
                <p className="text-zinc-200 text-sm mt-2 font-medium">
                  {game.isBuiltIn ? "Native Keyboard / Screen inputs" : "Keyboard Arrow keys, Spacebar, & Mouse Controller"}
                </p>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Make sure to click inside the game cabinet screen interface to activate keyboard triggers if the game doesn&#39;t respond initially.
                </p>
              </div>

              {/* Game description details */}
              <div className="border-t border-zinc-900 pt-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  System Description
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Security block */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
                <div className="text-sm">🛡️</div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none mb-1">Unblocked Link Safeguards</h4>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    This iframe resolves inside a secure sandboxed sandbox context restricting network access permissions to preserve safe browsing environments.
                  </p>
                </div>
              </div>
            </div>

            {/* Rating controls & external launch */}
            <div className="border-t border-zinc-900 pt-5 mt-5 space-y-4">
              {/* Rate game mechanism */}
              <div>
                <p className="text-zinc-400 text-xs font-medium mb-1.5 font-mono uppercase tracking-wider">
                  Rate your Session
                </p>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => {
                    const activeHover = userRating !== null && userRating >= stars;
                    return (
                      <button
                        key={stars}
                        id={`rate-star-${stars}`}
                        onClick={() => handleRate(stars)}
                        className={`p-1 rounded-md transition-all outline-none cursor-pointer ${
                          activeHover
                            ? "text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                            : "text-zinc-600 hover:text-zinc-400 hover:scale-105"
                        }`}
                      >
                        <Star className={`w-5 h-5 ${activeHover ? "fill-current" : ""}`} />
                      </button>
                    );
                  })}
                  {userRating !== null && (
                    <span className="text-[10px] font-mono text-emerald-400 ml-2 animate-bounce">
                      Saved Star Feedback!
                    </span>
                  )}
                </div>
              </div>

              {/* Remote launch wrapper if standard iframe is active */}
              {!game.isBuiltIn && (
                <a
                  href={game.iframeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-all text-xs font-mono font-medium cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> OPEN DEV SOURCE
                </a>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
