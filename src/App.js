import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [habits, setHabits] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [editIndex, setEditIndex] = useState(null);
  const [editInput, setEditInput] = useState("");

  const categories = ["Work", "Health", "Fitness", "Personal", "Other"];

  // Load habits from localStorage on component mount
  useEffect(() => {
    try {
      const storedHabits = JSON.parse(localStorage.getItem("habits")) || [];
      console.log("Loaded habits from localStorage:", storedHabits);
      setHabits(storedHabits);
    } catch (error) {
      console.error("Failed to load habits from localStorage:", error);
      setHabits([]);
    }
  }, []);

  useEffect(() => {
    try {
      console.log("Saving habits to localStorage:", habits);
      localStorage.setItem("habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Failed to save habits to localStorage:", error);
    }
  }, [habits]);

  const handleAddHabit = () => {
    if (input.trim() === "") return;
    const newHabit = {
      id: uuidv4(),
      name: input,
      completed: false,
      category: selectedCategory,
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
    setInput(""); // Clear input field
  };

  const toggleCompletion = (id) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleDelete = (id) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  const handleEdit = (id) => {
    setEditIndex(id);
    const habitToEdit = habits.find((habit) => habit.id === id);
    setEditInput(habitToEdit.name);
  };

  const saveEdit = () => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === editIndex ? { ...habit, name: editInput } : habit
      )
    );
    setEditIndex(null);
    setEditInput("");
  };

  const groupedHabits = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Habit Tracker</h1>
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a new habit"
          className="border border-gray-300 px-4 py-2 rounded mr-2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded mr-2"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddHabit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Habit
        </button>
      </div>
      <div className="w-full max-w-md">
        {Object.keys(groupedHabits).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{category}</h2>
            <ul>
              {groupedHabits[category].map((habit) => (
                <li
                  key={habit.id}
                  className={`p-2 rounded border border-gray-200 flex justify-between items-center mb-2 ${
                    habit.completed
                      ? "bg-green-100 line-through"
                      : "bg-gray-100"
                  }`}
                >
                  {editIndex === habit.id ? (
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded"
                    />
                  ) : (
                    <span
                      onClick={() => toggleCompletion(habit.id)}
                      className="cursor-pointer"
                    >
                      {habit.name}
                    </span>
                  )}
                  <div className="flex gap-2">
                    {editIndex === habit.id ? (
                      <button
                        onClick={saveEdit}
                        className="text-green-500 hover:underline"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(habit.id)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(habit.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
