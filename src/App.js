import React, { useState, useEffect } from "react";

const App = () => {
  const [habits, setHabits] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [editIndex, setEditIndex] = useState(null);
  const [editInput, setEditInput] = useState("");

  const categories = ["Work", "Health", "Fitness", "Personal", "Other"];

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habits"));
    if (storedHabits) {
      setHabits(storedHabits);
    }
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);

  const handleAddHabit = () => {
    if (input.trim() === "") return;
    const newHabit = {
      name: input,
      completed: false,
      category: selectedCategory,
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
    setInput("");
  };

  const toggleCompletion = (index) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, i) =>
        i === index ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleDelete = (indexToRemove) => {
    setHabits((prevHabits) => prevHabits.filter((_, index) => index !== indexToRemove));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditInput(habits[index].name);
  };

  const saveEdit = () => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, index) =>
        index === editIndex ? { ...habit, name: editInput } : habit
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
              {groupedHabits[category].map((habit, index) => (
                <li
                  key={index}
                  className={`p-2 rounded border border-gray-200 flex justify-between items-center mb-2 ${
                    habit.completed ? "bg-green-100 line-through" : "bg-gray-100"
                  }`}
                >
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded"
                    />
                  ) : (
                    <span
                      onClick={() => toggleCompletion(index)}
                      className="cursor-pointer"
                    >
                      {habit.name}
                    </span>
                  )}
                  <div className="flex gap-2">
                    {editIndex === index ? (
                      <button
                        onClick={saveEdit}
                        className="text-green-500 hover:underline"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
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
