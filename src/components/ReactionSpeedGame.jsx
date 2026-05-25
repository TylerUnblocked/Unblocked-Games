/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Zap, RotateCcw, Award, Play } from "lucide-react";

export default function ReactionSpeedGame() {
  const [gameState, setGameState] = useState("idle");
  const [reactionTime, setReactionTime] = useState(null);
  const [personalBest, setPersonalBest] = useState(() => {
    const saved = localStorage.getItem("arcade_pb_reaction");
    return saved ? parseInt(saved, 10) : 9999;
  });
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startTest = () => {
    setGameState("waiting");
    setReactionTime(null);

    const delay = Math.floor(Math.random() * 2500) + 1500; // 1.5 - 4 seconds delay
    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState("active");
    }, delay);
  };

  const handleTrigger = () => {
    if (gameState === "waiting") {
      // Too early!
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState("early");
    } else if (gameState === "active") {
      // Success!
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTimeRef.current);
      setReactionTime(elapsed);
      setGameState("result");

      // Check Personal Best
      if (elapsed < personalBest) {
        setPersonalBest(elapsed);
        localStorage.setItem("arcade_pb_reaction", elapsed.toString());
      }

      // Add to session history
      const grade = getGrade(elapsed);
      setHistory((prev) => [
        { id: Math.random().toString(), time: elapsed, grade },
        ...prev.slice(0, 4),
      ]);
    }
  };

  const getGrade = (ms) => {
    if (ms < 150) return "CYBER-REFLEXES (GODLIKE)";
    if (ms < 220) return "HYPER-DRIVE (FAST)";
    if (ms < 300) return "STANDARD NEURAL (GOOD)";
    if (ms < 450) return "SLUGGISH PACKET (AVERAGE)";
    return "BUFFERS OVERFLOWING (SLOW)";
  };

  const getRankColor = (grade) => {
    if (grade.includes("GODLIKE")) return "text-cyan-400 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]";
    if (grade.includes("FAST")) return "text-emerald-400 font-bold";
    if (grade.includes("GOOD")) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="flex flex-col h-full text-zinc-100 font-sans select-none">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-display font-bold tracking-tight text-white">
            Reaction Impulse Speedometer
          </h2>
        </div>
        <div className="flex gap-4 text-xs font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md">
          <span className="text-zinc-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            RECORD:{" "}
            <strong className="text-white">
              {personalBest === 9999 ? "N/A" : `${personalBest}ms`}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Clicking Screen */}
      <div className="flex-1 flex flex-col items-center">
        <button
          id="reaction-screen-button"
          onClick={gameState === "idle" || gameState === "result" || gameState === "early" ? startTest : handleTrigger}
          className={`relative w-full h-[240px] md:h-[300px] rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden cursor-pointer border ${
            gameState === "idle"
              ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 shrink-0"
              : gameState === "waiting"
              ? "bg-amber-950/20 border-amber-500/50 animate-pulse shrink-0"
              : gameState === "active"
              ? "bg-emerald-500/10 border-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] shrink-0"
              : gameState === "early"
              ? "bg-rose-950/20 border-rose-500/50 shrink-0"
              : "bg-zinc-900/80 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] shrink-0"
          }`}
        >
          {/* Decorative scanner line */}
          {gameState === "waiting" && (
            <div className="absolute inset-x-0 top-0 h-1 bg-amber-500/60 animate-[bounce_2s_infinite]" />
          )}
          {gameState === "active" && (
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400 animate-[bounce_1s_infinite]" />
          )}

          {gameState === "idle" && (
            <div className="flex flex-col items-center p-6 gap-3">
              <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 shadow-inner group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <p className="font-display font-medium text-white text-base">Press to Initiate Sequence</p>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Click now, wait for the screen to turn <span className="text-emerald-400">green</span>, then click as fast as humanly possible.
              </p>
            </div>
          )}

          {gameState === "waiting" && (
            <div className="flex flex-col items-center p-6 gap-2">
              <div className="w-12 h-12 rounded-full border border-dashed border-amber-500/60 animate-spin flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-amber-500/40" />
              </div>
              <p className="font-mono text-xs text-amber-500 uppercase tracking-widest mt-2">
                Awaiting Synapse Fire...
              </p>
              <p className="font-display font-medium text-lg text-white">Don't click yet!</p>
            </div>
          )}

          {gameState === "active" && (
            <div className="flex flex-col items-center p-6 gap-2">
              <div className="text-4xl animate-bounce">⚡</div>
              <p className="font-display font-extrabold text-2xl tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                SLAM CLIENT!
              </p>
              <p className="font-mono text-xs text-emerald-400">CLICK RIGHT NOW</p>
            </div>
          )}

          {gameState === "early" && (
            <div className="flex flex-col items-center p-6 gap-3">
              <div className="text-3xl">⚠️</div>
              <p className="font-display font-bold text-lg text-rose-400">Premature Neural Discharge!</p>
              <p className="text-xs text-zinc-400 max-w-xs">
                You clicked before the flash target. Steady your neuro-triggers.
              </p>
              <div className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 px-3 rounded-lg font-medium border border-zinc-700 mt-2">
                <RotateCcw className="w-3.5 h-3.5" /> Retry Sync
              </div>
            </div>
          )}

          {gameState === "result" && (
            <div className="flex flex-col items-center p-6 gap-2">
              <div className="font-mono text-xs text-cyan-400 uppercase tracking-wider">RESPONSE LATENCY</div>
              <div className="font-display font-black text-5xl text-white my-1">
                {reactionTime}<span className="text-xl font-normal text-zinc-400">ms</span>
              </div>
              <div className="mt-1">
                <span className={`text-sm ${getRankColor(getGrade(reactionTime || 0))}`}>
                  {getGrade(reactionTime || 0)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 px-3 rounded-lg font-medium border border-zinc-700 mt-4">
                <RotateCcw className="w-3.5 h-3.5" /> Challenge Again
              </div>
            </div>
          )}
        </button>

        {/* Action Logs */}
        <div className="w-full mt-4 flex-1 flex flex-col min-h-0 bg-zinc-950/40 border border-zinc-900 rounded-lg p-3">
          <p className="text-xs font-mono text-zinc-400 tracking-wider mb-2 uppercase border-b border-zinc-900 pb-1 flex justify-between">
            <span>📡 Last 5 Impulse Runs</span>
            <span>Status: Operational</span>
          </p>
          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-xs py-10 font-mono">
              [No historic logs yet. Press start to log synapse runs.]
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
              {history.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-1 px-2 rounded bg-zinc-900/40 border border-zinc-900 hover:bg-zinc-900/80 transition-colors"
                >
                  <span className="text-zinc-500">RUN #{history.length - index}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-right">{record.time}ms</span>
                    <span className={`text-[10px] ${getRankColor(record.grade)}`}>{record.grade.split(" ")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
