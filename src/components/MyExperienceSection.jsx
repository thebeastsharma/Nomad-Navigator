import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

const MyExperienceSection = ({ trip, onUpdateExperience }) => {
  // Local state to manage the textarea input
  const [experience, setExperience] = useState(trip.experience || '');
  // State to manage the saving process
  const [isSaving, setIsSaving] = useState(false);
  // State to show a "Saved!" confirmation
  const [justSaved, setJustSaved] = useState(false);

  // This effect ensures that if the 'trip' prop changes (e.g., user navigates
  // to a new details page), the textarea updates to that new trip's experience.
  useEffect(() => {
    setExperience(trip.experience || '');
  }, [trip]);

  // Handle the save button click
  const handleSave = async () => {
    if (!onUpdateExperience) return;

    setIsSaving(true);
    setJustSaved(false);

    try {
      // Call the function passed down from App.jsx
      await onUpdateExperience(trip.id, experience);
      // Show the "Saved!" confirmation
      setJustSaved(true);
      // Hide the confirmation after 2 seconds
      setTimeout(() => setJustSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save experience:", e);
      // We could add an error state here if we wanted
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-blue-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
        My Experience
      </h3>
      <div className="space-y-4">
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Write about your overall experience on this trip..."
          className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-orange-500 focus:border-orange-500 shadow-inner text-gray-700 dark:text-gray-200 dark:bg-gray-700 resize-y"
        />
        <div className="flex justify-end items-center">
          {justSaved && (
            <span className="text-green-600 dark:text-green-400 font-medium mr-4">
              Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="bg-orange-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition duration-150 transform hover:scale-[1.02] active:scale-100 flex items-center justify-center disabled:bg-orange-400 w-40"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-1" />
            )}
            Save Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyExperienceSection;


