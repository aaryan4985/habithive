import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Zap,
  Target,
  Award,
  TrendingUp,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  BarChart2,
  Calendar,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Color themes for different categories
const CATEGORY_THEMES = {
  Work: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
    icon: "text-blue-500",
  },
  Health: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
    icon: "text-green-500",
  },
  Fitness: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
    icon: "text-red-500",
  },
  Personal: {
    bg: "bg-purple-50",
    border: "border-purple-300",
    text: "text-purple-700",
    icon: "text-purple-500",
  },
  Learning: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-700",
    icon: "text-yellow-500",
  },
  Finance: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
    icon: "text-green-500",
  },
  Other: {
    bg: "bg-gray-50",
    border: "border-gray-300",
    text: "text-gray-700",
    icon: "text-gray-500",
  },
};

const App = () => {
  // Extended state management
  const [habits, setHabits] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [editingHabit, setEditingHabit] = useState(null);
  const [filter, setFilter] = useState({
    category: null,
    status: null,
    sortBy: "newest",
  });

  // Extended categories
  const categories = [
    "Work",
    "Health",
    "Fitness",
    "Personal",
    "Learning",
    "Finance",
    "Creativity",
    "Mindfulness",
    "Other",
  ];

  // Advanced habit difficulty levels
  const difficultyLevels = [
    { name: "Easy", points: 10, color: "bg-green-200" },
    { name: "Medium", points: 25, color: "bg-yellow-200" },
    { name: "Hard", points: 50, color: "bg-red-200" },
  ];

  // Load habits from localStorage
  useEffect(() => {
    try {
      const storedHabits = JSON.parse(
        localStorage.getItem("advancedHabits") || "[]"
      );
      setHabits(storedHabits);
    } catch (error) {
      console.error("Failed to load habits:", error);
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("advancedHabits", JSON.stringify(habits));
    } catch (error) {
      console.error("Failed to save habits:", error);
    }
  }, [habits]);

  // Advanced habit creation
  const createHabit = () => {
    if (!input.trim()) return;

    const newHabit = {
      id: uuidv4(),
      name: input,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
      difficulty: difficultyLevels[1], // Default to medium
      completions: [],
      streak: {
        current: 0,
        longest: 0,
      },
      totalPoints: 0,
      goals: {
        daily: 1,
        weekly: 5,
        monthly: 20,
      },
      notes: [],
      archived: false,
    };

    setHabits((prev) => [...prev, newHabit]);
    setInput("");
  };

  // Complex habit completion logic
  const toggleHabitCompletion = (habitId) => {
    const today = new Date().toISOString().split("T")[0];

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const wasCompletedToday = habit.completions.some(
            (c) => c.date === today
          );

          if (wasCompletedToday) {
            // Undo completion
            return {
              ...habit,
              completions: habit.completions.filter((c) => c.date !== today),
              streak: {
                ...habit.streak,
                current: Math.max(0, habit.streak.current - 1),
              },
              totalPoints: Math.max(
                0,
                habit.totalPoints - habit.difficulty.points
              ),
            };
          }

          // Complete habit
          const newCompletions = [
            ...habit.completions,
            {
              date: today,
              points: habit.difficulty.points,
            },
          ];

          const newStreak = habit.streak.current + 1;

          return {
            ...habit,
            completions: newCompletions,
            streak: {
              current: newStreak,
              longest: Math.max(newStreak, habit.streak.longest),
            },
            totalPoints: habit.totalPoints + habit.difficulty.points,
          };
        }
        return habit;
      })
    );
  };

  // Advanced filtering and sorting
  const filteredHabits = useMemo(() => {
    return habits
      .filter((habit) => {
        // Category filter
        if (filter.category && habit.category !== filter.category) return false;

        // Status filter
        if (filter.status === "completed" && habit.completions.length === 0)
          return false;
        if (filter.status === "pending" && habit.completions.length > 0)
          return false;

        return true;
      })
      .sort((a, b) => {
        switch (filter.sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "streak":
            return b.streak.current - a.streak.current;
          case "points":
            return b.totalPoints - a.totalPoints;
          default:
            return 0;
        }
      });
  }, [habits, filter]);

  // Habit rendering with advanced UI
  const renderHabitCard = (habit) => {
    const theme = CATEGORY_THEMES[habit.category] || CATEGORY_THEMES.Other;
    const today = new Date().toISOString().split("T")[0];
    const completedToday = habit.completions.some((c) => c.date === today);

    return (
      <div
        key={habit.id}
        className={`
          ${theme.bg} border-l-4 ${theme.border} 
          rounded-lg p-4 mb-4 shadow-md 
          transform transition-all duration-300 
          hover:scale-[1.02] hover:shadow-lg
        `}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`${theme.icon}`}>
              <Target size={24} />
            </div>
            <div>
              <h3 className={`font-bold ${theme.text}`}>{habit.name}</h3>
              <div className="text-sm text-gray-600 flex space-x-2">
                <span>Streak: {habit.streak.current} 🔥</span>
                <span>Points: {habit.totalPoints}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${habit.difficulty.color}`}
                >
                  {habit.difficulty.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleHabitCompletion(habit.id)}
              className={`
                p-2 rounded-full transition-colors
                ${
                  completedToday
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-green-100"
                }
              `}
            >
              {completedToday ? <CheckCircle /> : <Plus />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          HabitHive
        </h1>

        {/* Habit Creation Section */}
        <div className="mb-8 flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Create a new habit..."
            className="flex-grow p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border-2 border-blue-200 rounded-lg"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={createHabit}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus />
          </button>
        </div>

        {/* Filtering and Sorting */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex space-x-2">
            {/* Category Filter */}
            <select
              value={filter.category || ""}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  category: e.target.value || null,
                }))
              }
              className="p-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filter.status || ""}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  status: e.target.value || null,
                }))
              }
              className="p-2 border rounded"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Sort By */}
            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  sortBy: e.target.value,
                }))
              }
              className="p-2 border rounded"
            >
              <option value="newest">Newest</option>
              <option value="streak">Highest Streak</option>
              <option value="points">Most Points</option>
            </select>
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-4">{filteredHabits.map(renderHabitCard)}</div>
      </div>
    </div>
  );
};

export default App;
