import React from 'react';
import PhotoUploadSection from '../components/PhotoUploadSection';
import DailyEntrySection from '../components/DailyEntrySection';
import { ChevronLeft } from 'lucide-react';

const TripDetailsPage = ({ trip, onBack, db, userId, getTripsCollectionRef }) => (
    <div className="p-0">
        <header className="py-6 border-b border-gray-200 dark:border-gray-700 mb-6 flex items-center justify-between">
            <button
                onClick={onBack}
                className="flex items-center text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-800 dark:hover:text-orange-300 transition"
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Trips
            </button>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 ml-4 line-clamp-1">{trip.name}</h2>
        </header>
        <div className="space-y-6">
            <PhotoUploadSection tripId={trip.id} db={db} userId={userId} getTripsCollectionRef={getTripsCollectionRef} />
            <DailyEntrySection tripId={trip.id} db={db} userId={userId} getTripsCollectionRef={getTripsCollectionRef} />
        </div>
    </div>
);

export default TripDetailsPage;

