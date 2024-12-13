import { useState } from "react";

function App() {
  // State to manage habits
  const [habits, setHabits] = useState([]);
  const [habitInput, setHabitInput] = useState("");

  // Function to handle form submission
  const handleAddHabit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (habitInput.trim() === "") return; // Ignore empty input

    // Add the new habit to the list
    setHabits([...habits, habitInput]);
    setHabitInput(""); // Clear the input field
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">HabitHive</h1>

        {/* Form to add a new habit */}
        <form onSubmit={handleAddHabit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter a new habit..."
            value={habitInput}
            onChange={(e) => setHabitInput(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 flex-grow"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add
          </button>
        </form>

        {/* Display the list of habits */}
        <ul className="space-y-2">
          {habits.map((habit, index) => (
            <li
              key={index}
              className="bg-gray-100 p-2 rounded border border-gray-200"
            >
              {habit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
