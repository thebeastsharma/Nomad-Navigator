import React from 'react';
import AddTripForm from '../components/AddTripForm';
import TripCard from '../components/TripCard';
import { Plane, Loader2, LogOut } from 'lucide-react'; // <-- ADDED LogOut

const TripsListPage = React.memo(({
    userEmail, // <-- CHANGED from userId
    newTripName,
    setNewTripName,
    handleAddTrip,
    isSaving,
    isAuthReady,
    loading,
    trips,
    handleDeleteTrip,
    onSelectTrip,
    onLogout // <-- ADDED onLogout prop
}) => (
    <>
        <header className="text-center py-6 relative">
            {/* --- LOGOUT BUTTON ADDED --- */}
            <button
                onClick={onLogout}
                className="absolute top-1/2 -translate-y-1/2 left-0 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                aria-label="Log Out"
            >
                <LogOut className="w-6 h-6" />
            </button>
            {/* --- END LOGOUT BUTTON --- */}

            {/* --- IMAGE BANNER REMOVED --- */}

            {/* FIX: Added px-16 here to prevent overlap with side buttons */}
            <h1 className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 flex items-center justify-center space-x-2 px-16">
                <Plane className="w-10 h-10" />
                <span>NOMAD NAVIGATOR</span>
            </h1>
        </header>

        {/* User Email Display -- CHANGED */}
        <div className="mb-4 text-center">
            <span className="text-xs font-mono p-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md">
                Logged in as: {userEmail || '...'}
            </span>
        </div>
        
        <AddTripForm 
            newTripName={newTripName}
            setNewTripName={setNewTripName}
            handleAddTrip={handleAddTrip}
            isSaving={isSaving}
            isAuthReady={isAuthReady} // <-- FIX: Added this missing prop
        />
        
        <div className="space-y-4 mt-8">
            {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 text-orange-500 animate-spin" /></div>}
            
            {!loading && trips.length === 0 && isAuthReady && (
                <div className="text-center p-6 bg-white dark:bg-blue-900 rounded-lg shadow border-t-4 border-orange-500">
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">No trips yet!</h3>
                    <p className="text-gray-600 dark:text-gray-400">Create your first travel log to get started.</p>
                </div>
            )}
            
            {trips.map(trip => (
                <TripCard 
                    key={trip.id}
                    trip={trip}
                    onSelectTrip={() => onSelectTrip(trip.id)}
                    handleDeleteTrip={() => handleDeleteTrip(trip.id)}
                />
            ))}
        </div>
    </>
));
TripsListPage.displayName = 'TripsListPage';

export default TripsListPage;

