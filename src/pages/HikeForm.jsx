import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrganizeHikePage({ hikes, setHikes }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    region: "Mount Lebanon",
    difficulty: "Moderate",
    distanceKm: "",
    date: "",
    maxParticipants: "",
    description: ""
  });

  const [error, setError] = useState("");

  // Helper to get today's date in YYYY-MM-DD format for HTML min attribute
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Pre-populate form if editing an existing hike
  useEffect(() => {
    if (isEditing && hikes) {
      const existingHike = hikes.find((h) => h.id === id);
      if (existingHike) {
        setFormData(existingHike);
      }
    }
  }, [id, isEditing, hikes]);

  const handleChange = (e) => {
    if (error) setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { title, region, difficulty, distanceKm, date, maxParticipants, description } = formData;

    // Validation checks
    if (!title.trim() || !distanceKm || !date || !maxParticipants || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(distanceKm) <= 0) {
      setError("Distance must be greater than 0 km.");
      return;
    }

    if (Number(maxParticipants) <= 0) {
      setError("Maximum participants must be at least 1.");
      return;
    }

    // Past date validation check
    if (date < getTodayDate()) {
      setError("Hike date cannot be in the past.");
      return;
    }

    if (isEditing) {
      // Update existing hike in mock state array
      if (typeof setHikes === "function") {
        setHikes(hikes.map((h) => (h.id === id ? { ...formData, id } : h)));
      }
    } else {
      // Create a new hike object with a mock unique ID
      const newHike = {
        ...formData,
        id: Date.now().toString(),
        organizer: "Current User"
      };
      if (typeof setHikes === "function") {
        setHikes((prev) => [newHike, ...(prev || [])]);
      }
    }

    navigate("/hikes"); // Adjust this route to match your team's list view path if needed
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {isEditing ? "Edit Group Hike" : "Organize a New Hike"}
      </h2>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hike Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="e.g., Bkassine Pine Forest Trail"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Region
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option>North Lebanon</option>
              <option>Mount Lebanon</option>
              <option>Bekaa</option>
              <option>South Lebanon</option>
              <option>Akkar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
              <option>Expert</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              name="distanceKm"
              value={formData.distanceKm}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            {/* min attribute locks out past dates on calendar UI */}
            <input
              type="date"
              name="date"
              min={getTodayDate()}
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Hikers
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trail Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Describe meeting points, terrain, and things to bring..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md cursor-pointer"
        >
          {isEditing ? "Update Hike Details" : "Publish Hike Listing"}
        </button>
      </form>
    </div>
  );
}