/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Search,
  Plus,
  X,
  Sparkles,
  Terminal,
  Clock
} from "lucide-react";
import defaultGames from "./games.json";
import GameCard from "./components/GameCard";
import GameConsole from "./components/GameConsole";
import AddGameModal from "./components/AddGameModal";

export default function App() {
  // --- STATE ---
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGame, setActiveGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Live Digital Clock Simulation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Load user added games from localStorage
    const savedUserGames = localStorage.getItem("unblocked_user_added_games");
    const userGames = savedUserGames ? JSON.parse(savedUserGames) : [];

    // Combine static games with custom user games
    // Force unique items from user added lists
    const combinedGamesList = [...defaultGames];
    userGames.forEach((ug) => {
      if (!combinedGamesList.some((g) => g.id === ug.id)) {
        combinedGamesList.push(ug);
      }
    });

    setGames(combinedGamesList);

    // 2. Load favorites list
    const savedFavorites = localStorage.getItem("unblocked_favorites_list");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // --- HANDLERS ---
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation(); // Avoid triggering card click
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("unblocked_favorites_list", JSON.stringify(updated));
  };

  const handleAddNewGame = (newGame) => {
    const updatedGames = [...games, newGame];
    setGames(updatedGames);

    // Save custom games independently for persistent exports
    const savedUserGames = localStorage.getItem("unblocked_user_added_games");
    const userGames = savedUserGames ? JSON.parse(savedUserGames) : [];
    userGames.push(newGame);
    localStorage.setItem("unblocked_user_added_games", JSON.stringify(userGames));

    setSelectedCategory("User-Added");
    setIsAddModalOpen(false);
  };

  const handleRateGame = (id, newStars) => {
    // Dynamically calculate average rating matching local sessions
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === id) {
          const prevPlayCount = game.playCount || 10;
          const weightedRating = (game.rating * prevPlayCount + newStars) / (prevPlayCount + 1);
          return {
            ...game,
            rating: parseFloat(weightedRating.toFixed(2)),
          };
        }
        return game;
      })
    );
  };

  const handleLaunchGame = (game) => {
    // Increment local play count on launch
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, playCount: g.playCount + 1 } : g))
    );
    setActiveGame(game);
  };

  const handleRemoveUserGame = (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this custom game link from your station?")) return;

    const filteredGames = games.filter((g) => g.id !== id);
    setGames(filteredGames);

    const savedUserGames = localStorage.getItem("unblocked_user_added_games");
    if (savedUserGames) {
      const userGames = JSON.parse(savedUserGames);
      const updatedUserGames = userGames.filter((ug) => ug.id !== id);
      localStorage.setItem("unblocked_user_added_games", JSON.stringify(updatedUserGames));
    }

    if (favorites.includes(id)) {
      const updatedFavs = favorites.filter((favId) => favId !== id);
      setFavorites(updatedFavs);
      localStorage.setItem("unblocked_favorites_list", JSON.stringify(updatedFavs));
    }
  };

  // --- FILTERING ---
  const filteredAndSearchedGames = games.filter((game) => {
    // Category check
    let matchesCategory = true;
    if (selectedCategory === "Favorites") {
      matchesCategory = favorites.includes(game.id);
    } else if (selectedCategory === "User-Added") {
      matchesCategory = !!game.isUserAdded;
    } else if (selectedCategory === "Built-In") {
      matchesCategory = !!game.isBuiltIn;
    } else if (selectedCategory !== "All") {
      matchesCategory = game.category.toLowerCase() === selectedCategory.toLowerCase();
    }

    // Search query check
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      game.title.toLowerCase().includes(cleanSearch) ||
      game.description.toLowerCase().includes(cleanSearch) ||
      game.category.toLowerCase().includes(cleanSearch);

    return matchesCategory && matchesSearch;
  });

  // Category counts helpers
  const getCategoryCount = (cat) => {
    if (cat === "All") return games.length;
    if (cat === "Favorites") return favorites.length;
    if (cat === "User-Added") return games.filter((g) => g.isUserAdded).length;
    if (cat === "Built-In") return games.filter((g) => g.isBuiltIn).length;
    return games.filter((g) => g.category.toLowerCase() === cat.toLowerCase()).length;
  };

  const categories = [
    "All",
    "Favorites",
    "Puzzles",
    "Action",
    "Precision",
    "Retro",
    "Built-In",
    "User-Added",
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col relative overflow-x-hidden md:overflow-hidden md:h-screen">
      {/* Immersive Glow Grid Background */}
      <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-indigo-950/20 via-zinc-950/0 to-transparent pointer-events-none" />

      {/* Primary Top Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0">
            <Gamepad2 className="w-5 h-5 animate-[bounce_3s_infinite]" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              UNBLOCKED GAMES <span className="text-xs bg-fuchsia-600 text-white font-mono px-1.5 py-0.5 rounded tracking-normal">HUB</span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono flex items-center gap-1">
              <Terminal className="w-3 h-3 text-zinc-600" /> STABLE CABINET SIMULATION v1.2
            </p>
          </div>
        </div>

        {/* Console Stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-lg text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Games Loaded: <strong>{games.length}</strong></span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-lg text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
            <span>{currentTime || "00:00:00"}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      {activeGame ? (
        // Active play session screen takes over the focus workspace
        <main className="flex-1 flex flex-col min-h-0 z-10">
          <GameConsole
            game={activeGame}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onClose={() => setActiveGame(null)}
            onRateGame={handleRateGame}
          />
        </main>
      ) : (
        // Lobby view displaying game cards & categories search
        <main className="flex-1 flex flex-col min-h-0 z-10 px-6 py-5 overflow-y-auto">
          {/* Hero Banner Grid (Short overview of the unblocked platform) */}
          <section className="mb-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/20 border border-zinc-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-base text-white">Your Personal Safe-Haven Arcade</h2>
              <p className="text-xs text-zinc-400 max-w-xl mt-1 leading-relaxed">
                Enjoy zero-lag unblocked gaming directly within clean environments. Packaged with multiple offline-ready visual tests alongside high-performance cloud iframe embeds.
              </p>
            </div>
            <button
              id="header-import-button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white rounded-xl transition-all font-medium text-xs flex items-center justify-center gap-1.5 border border-zinc-700 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" /> Import Iframe Link
            </button>
          </section>

          {/* Filters, Categories & Search */}
          <section className="border-b border-zinc-900 pb-5 mb-6 flex flex-col gap-4">
            {/* Search Input and Add Command Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-600 pointer-events-none" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search catalog by title, details, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-900 hover:border-zinc-800 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all text-sm font-sans"
                />
                {searchTerm && (
                  <button
                    id="clear-search-button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3.5 top-2.5 p-0.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all cursor-pointer"
                  >
                     <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills Slider */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mr-[-24px] pr-[24px]">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    id={`cat-pill-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold"
                        : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded-full font-sans ${
                      isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-zinc-900 text-zinc-650 text-zinc-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Grid Layout of Cards */}
          <section className="flex-1 pb-10 min-h-0">
            {filteredAndSearchedGames.length === 0 ? (
              // Empty Search Result Panel
              <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/20 border border-zinc-900 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-zinc-900/60 flex items-center justify-center text-zinc-600 mb-4 border border-zinc-800">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-medium text-white text-base">Cabinet Grid Empty</h3>
                <p className="text-zinc-500 text-xs max-w-xs mt-1 leading-relaxed">
                  No matching unblocked titles were found for your query. Try clearing filters or importing a new iframe web link.
                </p>
                <div className="flex gap-2 mt-5">
                  {(searchTerm || selectedCategory !== "All") && (
                    <button
                      id="reset-filters-button"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                      className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono font-bold rounded-lg transition-all cursor-pointer"
                    >
                      RESET FILTERS
                    </button>
                  )}
                  <button
                    id="empty-import-button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-lg transition-all cursor-pointer"
                  >
                    IMPORT CUSTOM GAME
                  </button>
                </div>
              </div>
            ) : (
              // Real Grid Layout
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredAndSearchedGames.map((game) => (
                  <div key={game.id} className="relative">
                    <GameCard
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onLaunch={handleLaunchGame}
                    />
                    {game.isUserAdded && (
                      <button
                        id={`delete-user-game-${game.id}`}
                        onClick={(e) => handleRemoveUserGame(game.id, e)}
                        className="absolute bottom-[13px] left-[13px] text-[10px] font-mono font-bold text-rose-500 hover:text-rose-400 flex items-center gap-0.5 bg-zinc-950/90 py-1.5 px-2.5 rounded-md border border-zinc-900 hover:border-rose-500/20 cursor-pointer z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                        title="Delete this added game from terminal"
                      >
                        REMOVE LINK
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* Import Custom Game Slideover Modal Overlay */}
      {isAddModalOpen && (
        <AddGameModal
          onClose={() => setIsAddModalOpen(false)}
          onAddGame={handleAddNewGame}
        />
      )}
    </div>
  );
}
