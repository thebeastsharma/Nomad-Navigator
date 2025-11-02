import React, { useState } from 'react';
import { Map, Trash2, Check, X } from 'lucide-react';

const TripCard = ({ trip, onSelectTrip, handleDeleteTrip }) => {
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    return (
      // FIX: Changed to flex-col on mobile, md:flex-row on medium screens
      <div className="bg-white dark:bg-blue-900 rounded-xl shadow-lg transition duration-300 hover:shadow-xl transform border-l-4 border-orange-500 overflow-hidden flex flex-col md:flex-row">
        <div 
            // FIX: This container must also stack vertically on mobile
            className="flex flex-col md:flex-row cursor-pointer w-full"
            onClick={() => onSelectTrip(trip.id)}
        >
            {/* FIX: Removed w-full. 
              Set h-24 for stacked mobile view and md:h-32 for desktop.
            */}
            <div className={`flex-shrink-0 md:w-32 h-24 md:h-32 bg-orange-50 dark:bg-orange-950/50 w-full md:w-auto`}>
                <div className="flex items-center justify-center w-full h-full text-orange-600 dark:text-orange-300 flex-col">
                    <Map className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">View Details</span>
                </div>
            </div>

            {/* FIX: Added w-full so this section stacks correctly on mobile */}
            <div className="p-4 flex-grow flex justify-between items-center w-full">
                <div className="flex flex-col">
                    <span className="font-bold text-xl text-gray-800 dark:text-gray-100 line-clamp-1">{trip.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created: {new Date(trip.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex space-x-2 items-center" onClick={(e) => e.stopPropagation()}>
                    {confirmingDelete ? (
                        <div className="flex space-x-2 bg-red-100 dark:bg-red-900 p-2 rounded-lg items-center ml-2">
                            <span className="text-sm text-red-700 dark:text-red-200 font-medium hidden sm:inline">Confirm Delete?</span>
                            <button
                                onClick={() => handleDeleteTrip(trip.id)}
                                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-full transition"
                                aria-label="Confirm deletion"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setConfirmingDelete(false)}
                                className="p-2 text-red-600 hover:bg-red-200 dark:hover:bg-red-800 rounded-full transition"
                                aria-label="Cancel deletion"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-700 rounded-full transition ml-2"
                            aria-label={`Delete trip ${trip.name}`}
                            onClick={() => setConfirmingDelete(true)}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
};

export default TripCard;


