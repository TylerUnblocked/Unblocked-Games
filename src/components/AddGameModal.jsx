/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PlusCircle, X, Globe, Type, Layers, Palette, Eye } from "lucide-react";

const GRADIENT_OPTIONS = [
  { name: "Neon Sun", value: "from-amber-400 to-orange-500", text: "text-amber-400" },
  { name: "Cyberpunk", value: "from-pink-500 to-violet-600", text: "text-pink-400" },
  { name: "Emerald Glitch", value: "from-green-400 to-cyan-500", text: "text-emerald-400" },
  { name: "Blue Plasma", value: "from-blue-500 to-indigo-600", text: "text-blue-400" },
  { name: "Cosmic Nebula", value: "from-purple-500 to-pink-500", text: "text-purple-400" },
  { name: "Crimson Shift", value: "from-red-500 to-rose-700", text: "text-rose-400" },
];

export default function AddGameModal({ onClose, onAddGame }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [category, setCategory] = useState("Puzzles");
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_OPTIONS[0]);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!title.trim()) {
      setError("Please provide a title for the game.");
      return;
    }
    if (!iframeUrl.trim()) {
      setError("Please provide an iframe URL.");
      return;
    }

    // Try verifying it represents a link
    try {
      const url = new URL(iframeUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        setError("Please enter a valid HTTP/HTTPS URL address.");
        return;
      }
    } catch (_) {
      setError("Please enter a valid, complete URL (e.g. https://example.com).");
      return;
    }

    const newGame = {
      id: `user-game-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `A customized unblocked game loaded directly from ${new URL(iframeUrl).hostname}.`,
      iframeUrl: iframeUrl.trim(),
      category: category,
      iconName: "Globe",
      gradient: selectedGradient.value,
      rating: 5.0,
      playCount: 1,
      author: "Self-Added",
      isUserAdded: true,
    };

    onAddGame(newGame);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm select-none">
      <div
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="font-display font-bold text-base text-white">Import Unblocked Game</h3>
          </div>
          <button
            id="close-add-modal-button"
            onClick={onClose}
            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 font-mono text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Title field */}
          <div>
            <label className="text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-zinc-500" /> Title
            </label>
            <input
              id="game-title-input"
              type="text"
              required
              placeholder="e.g. My Secret Retro Game"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* iframe URL field */}
          <div>
            <label className="text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-zinc-500" /> Iframe URL
            </label>
            <input
              id="game-url-input"
              type="url"
              required
              placeholder="e.g. https://gabrielecirulli.github.io/2048/"
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-xs font-medium"
            />
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              * Must support HTTPS and allowing embedding in external frames (X-Frame-Options allowed/not denied by host).
            </p>
          </div>

          {/* Description field */}
          <div>
            <label className="text-zinc-400 font-medium mb-1.5 block">Description</label>
            <textarea
              id="game-desc-input"
              rows={2}
              placeholder="Add brief details about how to control or play this unblocked game."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Category selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-zinc-500" /> Category
              </label>
              <select
                id="game-cat-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Puzzles">Puzzles</option>
                <option value="Action">Action</option>
                <option value="Precision">Precision</option>
                <option value="Retro">Retro</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 font-medium mb-1.5 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-zinc-500" /> Arcade Card Glow
              </label>
              <div className="relative">
                <select
                  id="game-glow-select"
                  value={selectedGradient.name}
                  onChange={(e) => {
                    const matched = GRADIENT_OPTIONS.find((g) => g.name === e.target.value);
                    if (matched) setSelectedGradient(matched);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {GRADIENT_OPTIONS.map((g) => (
                    <option key={g.name} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card Preview */}
          <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-4">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2.5 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Cabinet Cover Preview
            </span>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedGradient.value} flex items-center justify-center text-white font-extrabold text-md shadow-[0_0_12px_rgba(0,0,0,0.4)]`}
              >
                {title ? title.substring(0, 2).toUpperCase() : "?"}
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white leading-tight">
                  {title || "Unlabelled Arcade Cabinet"}
                </h4>
                <p className="text-xs text-zinc-500">{category} • Web Iframe</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800 mt-4 h-12">
            <button
              id="cancel-add-button"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-add-button"
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all font-medium text-xs flex items-center gap-1.5 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_16px_rgba(79,70,229,0.5)] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Import into Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
