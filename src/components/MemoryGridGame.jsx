/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Brain, Trophy, Play, RotateCcw } from "lucide-react";

export default function MemoryGridGame() {
  const [grid, setGrid] = useState(Array.from({ length: 9 }, (_, i) => i));
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("arcade_hs_memory");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameState, setGameState] = useState("idle");
  const [activeButton, setActiveButton] = useState(null);

  const audioCtxRef = useRef(null);

  // Play a simple synthesized audio tone
  const playBeep = (index) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqs = [220, 247, 262, 294, 330, 349, 392, 440, 494];
      osc.frequency.setValueAtTime(freqs[index % freqs.length], ctx.currentTime);
      osc.type = "sine";

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted, ignore silently
    }
  };

  const startGame = () => {
    setScore(0);
    setGameState("pattern");
    setPlayerSequence([]);
    const initialSeq = [Math.floor(Math.random() * 9)];
    setSequence(initialSeq);
  };

  // Handle showing the sequence is finished
  useEffect(() => {
    if (gameState !== "pattern" || sequence.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      const activeIdx = sequence[index];
      setActiveButton(activeIdx);
      playBeep(activeIdx);

      setTimeout(() => {
        setActiveButton(null);
      }, 350);

      index++;
      if (index >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setGameState("player");
          setPlayerSequence([]);
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [gameState, sequence]);

  const handleTileClick = (index) => {
    if (gameState !== "player") return;

    setActiveButton(index);
    playBeep(index);
    setTimeout(() => {
      setActiveButton(null);
    }, 200);

    const checkSeq = [...playerSequence, index];
    setPlayerSequence(checkSeq);

    // Verify current tap
    const step = checkSeq.length - 1;
    if (checkSeq[step] !== sequence[step]) {
      // GAME OVER
      setGameState("gameover");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("arcade_hs_memory", score.toString());
      }
      return;
    }

    // Sequence completed successfully
    if (checkSeq.length === sequence.length) {
      setScore((s) => s + 1);
      setGameState("pattern");
      // Add next random step
      setTimeout(() => {
        setSequence((prev) => [...prev, Math.floor(Math.random() * 9)]);
      }, 600);
    }
  };

  // Color mapping per grid block for a neon palette style
  const neonGlows = [
    "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]",
    "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.7)]",
    "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.7)]",
    "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.7)]",
    "bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.7)]",
    "bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.7)]",
    "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.7)]",
    "bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.7)]",
    "bg-pink-500 shadow-[0_0_15px_rgba(244,63,94,0.7)]",
  ];

  return (
    <div className="flex flex-col h-full text-zinc-100 font-sans select-none">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-fuchsia-400" />
          <h2 className="text-lg font-display font-bold tracking-tight text-white">
            Retro Neural Memory Matrix
          </h2>
        </div>
        <div className="flex gap-4 text-xs font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md">
          <span className="text-zinc-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            HI-SCORE: <strong className="text-white">{highScore}</strong>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">
            SCORE: <strong className="text-fuchsia-400">{score}</strong>
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {gameState === "idle" && (
          <div className="text-center p-6 flex flex-col items-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-fuchsia-950/40 border border-fuchsia-800/60 flex items-center justify-center text-fuchsia-400 mb-4 animate-pulse">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-md font-display font-bold text-white mb-2">Engage Neuro-Receptors</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Watch the electronic grid illuminate and replicate the identical sequence. The sequence gets one unit larger every round!
            </p>
            <button
              id="start-memory-button"
              onClick={startGame}
              className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium text-sm transition-all hover:shadow-[0_0_12px_rgba(217,70,239,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Initialize Test
            </button>
          </div>
        )}

        {(gameState === "pattern" || gameState === "player") && (
          <div className="flex flex-col items-center">
            {/* Round display text */}
            <div className="mb-4 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                {gameState === "pattern" ? (
                  <span className="text-fuchsia-400 animate-pulse">■ COMPUTER RECORDING PATTERN...</span>
                ) : (
                  <span className="text-emerald-400">⚡ REPLICATE PATTERN NOW ({playerSequence.length}/{sequence.length})</span>
                )}
              </span>
            </div>

            {/* 3x3 matrix board */}
            <div className="grid grid-cols-3 gap-3.5 w-[210px] sm:w-[250px] p-2 bg-zinc-950/60 border border-zinc-900 rounded-xl">
              {grid.map((index) => {
                const isActive = activeButton === index;
                return (
                  <button
                    key={index}
                    id={`tile-${index}`}
                    disabled={gameState !== "player"}
                    onClick={() => handleTileClick(index)}
                    className={`aspect-square rounded-lg border transition-all duration-155 relative cursor-pointer outline-none ${
                      isActive
                        ? `${neonGlows[index]} border-white scale-95`
                        : "bg-zinc-900 border-zinc-800 active:bg-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="text-center p-6 flex flex-col items-center max-w-sm">
            <div className="text-3xl mb-3">💥</div>
            <h3 className="text-md font-display font-extrabold text-rose-500 tracking-wider uppercase">
              Synapse Matrix Fractured!
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mt-1 mb-5">
              Sequence mismatch detected. Your neural capacity collapsed at round {score}.
            </p>

            <div className="flex flex-col gap-2 w-full p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl mb-6">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-500">SEQUENCE SCORE</span>
                <span className="text-white font-bold">{score}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-500">PERSONAL RECORD</span>
                <span className="text-white font-bold">{highScore}</span>
              </div>
            </div>

            <button
              id="restart-memory-button"
              onClick={startGame}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-medium text-sm transition-all border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Re-sync Neural Net
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
