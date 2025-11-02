import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, Image } from 'lucide-react';
import { db } from '../lib/firebase'; // Import db from our new firebase.js

const PhotoUploadSection = ({ tripId, userId, getTripsCollectionRef }) => {
    const [photos, setPhotos] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isPhotoSaving, setIsPhotoSaving] = useState(false);
    const [photoError, setPhotoError] = useState(null);

    const getPhotosCollectionRef = useCallback(() => {
        if (!db || !userId) return null;
        const tripsColRef = getTripsCollectionRef();
        if (!tripsColRef) return null;
        return collection(tripsColRef, tripId, 'photos');
    }, [db, userId, tripId, getTripsCollectionRef]);

    useEffect(() => {
        const photosColRef = getPhotosCollectionRef();
        if (!photosColRef) return;

        const unsubscribe = onSnapshot(photosColRef, (snapshot) => {
            const fetchedPhotos = [];
            snapshot.forEach((doc) => {
                fetchedPhotos.push({ id: doc.id, ...doc.data() });
            });
            fetchedPhotos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setPhotos(fetchedPhotos);
        }, (err) => {
            console.error("Photos Subcollection Snapshot Error:", err);
            setPhotoError("Failed to load photos.");
        });

        return () => unsubscribe();
    }, [getPhotosCollectionRef]);

    const handleAddPhoto = async (e) => {
        e.preventDefault();
        if (!newImageUrl.trim() || !getPhotosCollectionRef()) return;
        setIsPhotoSaving(true);
        setPhotoError(null);
        try {
            await addDoc(getPhotosCollectionRef(), {
                url: newImageUrl.trim(),
                createdAt: Date.now(),
            });
            setNewImageUrl('');
        } catch (e) {
            console.error("Error adding photo URL: ", e);
            setPhotoError("Could not save photo link.");
        } finally {
            setIsPhotoSaving(false);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (!db) return;
        setPhotoError(null);
        try {
            const photosColRef = getPhotosCollectionRef();
            const photoDocRef = doc(photosColRef, photoId);
            await deleteDoc(photoDocRef);
        } catch (e) {
            console.error("Error deleting photo: ", e);
            setPhotoError("Could not delete photo.");
        }
    };

    const isUrlValid = (url) => url.startsWith('http');

    return (
        <div className="p-4 bg-white dark:bg-blue-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                <Image className="w-6 h-6 mr-2" />
                Trip Photo Gallery
            </h3>
            {photoError && <div className="p-2 mb-4 text-xs font-medium text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">{photoError}</div>}
            <form onSubmit={handleAddPhoto} className="space-y-3 mb-6">
                <label htmlFor={`photoUrl-${tripId}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">Paste Image URL</label>
                <div className="flex space-x-2">
                    <input
                        id={`photoUrl-${tripId}`}
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/your-photo.jpg"
                        required
                        className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-200"
                        disabled={isPhotoSaving}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center min-w-[100px]"
                        disabled={isPhotoSaving || !isUrlValid(newImageUrl)}
                    >
                        {isPhotoSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5 mr-1" />}
                        Add Photo
                    </button>
                </div>
            </form>
            {photos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center p-4 border rounded-xl dark:border-gray-700">No photos added yet.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map(photo => (
                        <div key={photo.id} className="relative group overflow-hidden rounded-lg shadow-md aspect-square">
                            <img
                                src={photo.url}
                                alt="Trip Photo"
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/CCCCCC/333333?text=Link+Error"; }} 
                            />
                            <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
                                aria-label="Delete photo"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoUploadSection;

