import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, Image, UploadCloud, X, AlertTriangle } from 'lucide-react'; // <-- 1. Added AlertTriangle
import { db } from '../lib/firebase'; // Import db from our firebase.js

const PhotoUploadSection = ({ tripId, userId, getTripsCollectionRef }) => {
    const [photos, setPhotos] = useState([]);
    const [isPhotoLoading, setIsPhotoLoading] = useState(true);
    const [isPhotoSaving, setIsPhotoSaving] = useState(false);
    const [photoError, setPhotoError] = useState(null);
    
    // State for the new file upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // 1. Get the imgbb API key from environment variables
    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

    // 2. Get reference to the 'photos' subcollection
    const getPhotosCollectionRef = useCallback(() => {
        if (!db || !userId) return null;
        const tripsColRef = getTripsCollectionRef();
        if (!tripsColRef) return null;
        return collection(tripsColRef, tripId, 'photos');
    }, [userId, getTripsCollectionRef]); // Removed db, appId from deps

    // 3. Listen for changes to photos in Firestore
    useEffect(() => {
        setIsPhotoLoading(true);
        const photosColRef = getPhotosCollectionRef();
        if (!photosColRef) {
            setIsPhotoLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(photosColRef, (snapshot) => {
            const fetchedPhotos = [];
            snapshot.forEach((doc) => {
                fetchedPhotos.push({ id: doc.id, ...doc.data() });
            });
            setPhotos(fetchedPhotos.sort((a, b) => b.createdAt - a.createdAt));
            setIsPhotoLoading(false);
        }, (err) => {
            console.error("Error fetching photos:", err);
            setPhotoError("Failed to load photos.");
            setIsPhotoLoading(false);
        });

        return () => unsubscribe();
    }, [getPhotosCollectionRef]);

    // 4. Handle file selection from the input
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setPhotoError(null);
        }
    };

    // 5. Clear the file selection
    const clearSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        // Reset the file input
        const fileInput = document.getElementById('photo-upload-input');
        if (fileInput) fileInput.value = null;
    };

    // 6. Handle the upload process
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setPhotoError("Please select a file first.");
            return;
        }
        if (!imgbbApiKey) {
            setPhotoError("ImgBB API Key is missing. Please check .env.local file.");
            console.error("VITE_IMGBB_API_KEY is not set.");
            return;
        }

        setIsPhotoSaving(true);
        setPhotoError(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            // --- Upload to imgbb ---
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error?.message || "Image upload failed.");
            }

            const newImageUrl = result.data.display_url;

            // --- Save URL to Firestore ---
            const photosColRef = getPhotosCollectionRef();
            if (photosColRef) {
                await addDoc(photosColRef, {
                    imageUrl: newImageUrl,
                    createdAt: Date.now(),
                    fileName: selectedFile.name,
                });
            }

            // Clear the selection
            clearSelection();

        } catch (err) {
            console.error("Upload failed:", err);
            setPhotoError(`Upload failed: ${err.message}`);
        } finally {
            setIsPhotoSaving(false);
        }
    };

    // 7. Handle deleting a photo
    const handleDeletePhoto = async (photoId) => {
        const photosColRef = getPhotosCollectionRef();
        if (!photosColRef) return;
        
        try {
            await deleteDoc(doc(photosColRef, photoId));
        } catch (err) {
            console.error("Error deleting photo:", err);
            setPhotoError("Failed to delete photo.");
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-blue-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                <Image className="w-6 h-6 mr-2" />
                Trip Photo Gallery
            </h3>

            {/* --- 2. ADDED PRIVACY WARNING --- */}
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                            <strong>Privacy Notice:</strong> All photos are uploaded to a public service (imgbb). Do not upload sensitive images.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- NEW FILE UPLOAD FORM --- */}
            <form onSubmit={handleUpload} className="mb-6 space-y-4">
                <div>
                    <label 
                        htmlFor="photo-upload-input" 
                        className="w-full cursor-pointer bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg p-6 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 transition"
                    >
                        <UploadCloud className="w-10 h-10 mb-2" />
                        <span className="font-semibold">{selectedFile ? "File selected:" : "Click to choose a file"}</span>
                        <span className="text-xs">{selectedFile ? selectedFile.name : "PNG, JPG, etc."}</span>
                    </label> 
                    <input 
                        id="photo-upload-input"
                        type="file" 
                        accept="image/png, image/jpeg, image/gif"
                        className="sr-only" // Hidden, controlled by the label
                        onChange={handleFileChange}
                        disabled={isPhotoSaving}
                    />
                </div>

                {/* --- IMAGE PREVIEW --- */}
                {previewUrl && (
                    <div className="relative group">
                        <img src={previewUrl} alt="Preview" className="w-full rounded-lg shadow-md" />
                        <button
                            type="button"
                            onClick={clearSelection}
                            disabled={isPhotoSaving}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                            aria-label="Clear selection"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                
                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition duration-150 transform hover:scale-[1.02] active:scale-100 flex items-center justify-center disabled:bg-orange-400"
                    disabled={!selectedFile || isPhotoSaving}
                >
                    {isPhotoSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <PlusCircle className="w-5 h-5 mr-1" />
                    )}
                    Upload Photo
                </button>
                {photoError && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{photoError}</p>}
            </form>
            
            {/* --- EXISTING PHOTO GALLERY --- */}
            <div>
                {isPhotoLoading ? (
                    <div className="flex justify-center"><Loader2 className="w-6 h-6 text-orange-500 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="relative group shadow-lg rounded-lg overflow-hidden">
                                <img 
                                    src={photo.imageUrl} 
                                    alt={photo.fileName || "Uploaded photo"} 
                                    className="w-full h-32 object-cover" 
                                    onError={(e) => e.target.src = 'https://placehold.co/400x300/f87171/white?text=Error'}
                                />
                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handleDeletePhoto(photo.id)}
                                        className="p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
                                        aria-label="Delete photo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!isPhotoLoading && photos.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No photos added yet.</p>
                )}
            </div>
        </div>
    );
};

export default PhotoUploadSection;

