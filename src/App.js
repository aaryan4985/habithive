import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  CheckCircle,
  Zap,
  Target as TargetIcon,
  Moon,
  Sun,
  Brain,
  Gift,
  Rocket,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Improved AI Habit Suggestions
const AI_HABIT_SUGGESTIONS = [
  {
    id: 1,
    name: "Mindful Meditation",
    category: "Mindfulness",
    description: "10-minute daily meditation practice",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Skill Growth",
    category: "Learning",
    description: "Learn something new for 1 hour",
    difficulty: "Medium",
  },
  {
    id: 3,
    name: "Fitness Challenge",
    category: "Fitness",
    description: "30-minute workout or 10,000 steps",
    difficulty: "Hard",
  },
];

// Updated Achievements
const ACHIEVEMENTS = [
  {
    id: "streak_master",
    name: "Streak Master",
    description: "Maintain a 30-day streak on any habit",
    icon: <TargetIcon />,
    requiredStreak: 30,
  },
  {
    id: "multi_habit_hero",
    name: "Multi-Habit Hero",
    description: "Complete 5 different habits consistently",
    icon: <Rocket />,
    requiredHabitCount: 5,
  },
];

// Enhanced Categories
const CATEGORIES = [
  { name: "Work", icon: <Zap /> },
  { name: "Health", icon: <Brain /> },
  { name: "Fitness", icon: <Rocket /> },
  { name: "Personal", icon: <Gift /> },
  { name: "Learning", icon: <Sun /> },
  { name: "Mindfulness", icon: <Moon /> },
];

const App = () => {
  // State Management
  const [habits, setHabits] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [darkMode, setDarkMode] = useState(false);
  const [aiSuggestionOpen, setAiSuggestionOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);

  // Achievement Tracking
  const checkAchievements = useCallback(() => {
    const newAchievements = ACHIEVEMENTS.filter((achievement) => {
      // Streak Master
      if (
        achievement.id === "streak_master" &&
        habits.some((h) => h.streak.longest >= achievement.requiredStreak)
      ) {
        return true;
      }

      // Multi-Habit Hero
      if (
        achievement.id === "multi_habit_hero" &&
        habits.filter((h) => h.streak.current > 0).length >=
          achievement.requiredHabitCount
      ) {
        return true;
      }

      return false;
    });

    setAchievements(newAchievements);
  }, [habits]);

  useEffect(() => {
    checkAchievements();
  }, [habits, checkAchievements]);

  // Create Habit
  const createHabit = () => {
    if (!input.trim()) return;

    const newHabit = {
      id: uuidv4(),
      name: input,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
      completions: [],
      streak: {
        current: 0,
        longest: 0,
      },
      totalPoints: 0,
    };

    setHabits((prev) => [...prev, newHabit]);
    setInput("");
  };

  // Add AI Habit Suggestion
  const addAIHabitSuggestion = (suggestion) => {
    const newHabit = {
      id: uuidv4(),
      name: suggestion.name,
      category: suggestion.category,
      createdAt: new Date().toISOString(),
      completions: [],
      streak: {
        current: 0,
        longest: 0,
      },
      totalPoints: 0,
    };

    setHabits((prev) => [...prev, newHabit]);
    setAiSuggestionOpen(false);
  };

  // Complete Habit
  const completeHabit = (habitId) => {
    const today = new Date().toISOString().split("T")[0];

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          return {
            ...habit,
            completions: [...habit.completions, { date: today, points: 10 }],
            streak: {
              ...habit.streak,
              current: habit.streak.current + 1,
              longest: Math.max(habit.streak.current + 1, habit.streak.longest),
            },
            totalPoints: habit.totalPoints + 10,
          };
        }
        return habit;
      })
    );
  };

  // Render Habit Card
  const renderHabitCard = (habit) => {
    return (
      <div
        key={habit.id}
        className={`
          ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}
          border rounded-lg p-4 mb-4 
          shadow-md flex justify-between items-center
          transition-all duration-300 
          hover:shadow-lg
        `}
      >
        <div>
          <h3
            className={`font-bold text-lg ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            {habit.name}
          </h3>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Streak: {habit.streak.current} 🔥 | Points: {habit.totalPoints}
          </div>
        </div>
        <button
          onClick={() => completeHabit(habit.id)}
          className={`
            p-2 rounded-full 
            ${
              darkMode
                ? "bg-green-800 text-white hover:bg-green-700"
                : "bg-green-500 text-white hover:bg-green-600"
            }
          `}
        >
          <CheckCircle />
        </button>
      </div>
    );
  };

  return (
    <div
      className={`
        min-h-screen transition-colors duration-300
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
      `}
    >
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            HabitHive
          </h1>
          <div className="flex space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`
                p-2 rounded-full
                ${
                  darkMode
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }
              `}
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>

            {/* AI Suggestion Modal Trigger */}
            <button
              onClick={() => setAiSuggestionOpen(true)}
              className={`
                p-2 rounded-full
                ${
                  darkMode
                    ? "bg-purple-800 text-white hover:bg-purple-700"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }
              `}
            >
              <Brain />
            </button>
          </div>
        </div>

        {/* AI Habit Suggestions Modal */}
        {aiSuggestionOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`
              p-6 rounded-lg max-w-md w-full
              ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}
            `}
            >
              <h2 className="text-2xl font-bold mb-4">AI Habit Suggestions</h2>
              {AI_HABIT_SUGGESTIONS.map((suggestion) => (
                <div
                  key={suggestion.name}
                  className={`
                    mb-4 p-4 rounded-lg cursor-pointer
                    ${
                      darkMode
                        ? "hover:bg-gray-700 bg-gray-900"
                        : "hover:bg-gray-100 bg-white"
                    } border
                  `}
                  onClick={() => addAIHabitSuggestion(suggestion)}
                >
                  <h3 className="font-bold">{suggestion.name}</h3>
                  <p className="text-sm text-gray-600">
                    {suggestion.description}
                  </p>
                </div>
              ))}
              <button
                onClick={() => setAiSuggestionOpen(false)}
                className={`
                  mt-4 p-2 rounded-lg w-full
                  ${
                    darkMode
                      ? "bg-red-700 text-white hover:bg-red-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }
                `}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
            <div className="flex space-x-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`
                    p-4 rounded-lg flex items-center
                    ${
                      darkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-yellow-100"
                    }
                  `}
                >
                  {achievement.icon}
                  <div className="ml-4">
                    <h3 className="font-bold">{achievement.name}</h3>
                    <p className="text-sm">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habit Creation Section */}
        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Create a new habit..."
            className={`
              flex-grow p-3 rounded-lg border
              ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"
              }
            `}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`
              p-3 rounded-lg border
              ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"
              }
            `}
          >
            {CATEGORIES.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            onClick={createHabit}
            className={`
              p-3 rounded-lg
              ${
                darkMode
                  ? "bg-blue-800 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }
            `}
          >
            <Plus />
          </button>
        </div>

        {/* Habits List */}
        <div className="space-y-4">{habits.map(renderHabitCard)}</div>
      </div>
    </div>
  );
};

export default App;
