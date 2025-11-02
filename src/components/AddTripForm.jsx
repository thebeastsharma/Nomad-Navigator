import React from 'react';
import { Loader2, PlusCircle } from 'lucide-react';

// Memoized component to prevent unnecessary re-renders of the form
const AddTripForm = React.memo(({ newTripName, setNewTripName, handleAddTrip, isSaving, isAuthReady }) => (
    <form onSubmit={handleAddTrip} className="bg-white dark:bg-blue-900 p-6 rounded-2xl shadow-xl mb-8 border border-gray-100 dark:border-gray-700 space-y-4">
        <div>
            <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trip Name
            </label>
            <input
                id="tripName"
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="e.g., Himalyan Backpacking Adventure"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-orange-500 focus:border-orange-500 shadow-inner text-gray-700 dark:text-gray-200 dark:bg-gray-700"
                disabled={isSaving || !isAuthReady}
            />
        </div>
        
        <button
            type="submit"
            className="w-full bg-orange-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition duration-150 transform hover:scale-[1.02] active:scale-100 flex items-center justify-center disabled:bg-orange-400"
            disabled={isSaving || !newTripName.trim() || !isAuthReady}
        >
            {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <PlusCircle className="w-5 h-5 mr-1" />
            )}
            Add Trip
        </button>
    </form>
));
AddTripForm.displayName = 'AddTripForm'; // for debugging

export default AddTripForm;

