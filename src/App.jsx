import React, { useState, useEffect, useCallback } from 'react';
// Firebase logic from our lib
import { db, auth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './lib/firebase';
// Theme logic from our lib
import { getInitialTheme, toggleTheme } from './lib/theme';
// Firestore functions
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // <-- 1. ADDED updateDoc
// Icons
import { Loader2, Moon, Sun } from 'lucide-react';
// Pages
import TripsListPage from './pages/TripsListPage.jsx';
import TripDetailsPage from './pages/TripDetailsPage';
import AuthPage from './pages/AuthPage.jsx';

const App = () => {
  // Read .env variables
  const appId = import.meta.env.VITE_APP_ID || 'default-app-id';
  
  // Firebase state
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // App state
  const [currentPage, setCurrentPage] = useState('TripsList');
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [trips, setTrips] = useState([]);
  const [newTripName, setNewTripName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Sync DOM on first load
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Stable toggle handler
  const handleToggleDarkMode = useCallback(() => {
    const newIsDark = toggleTheme();
    setIsDarkMode(newIsDark);
  }, []);
  
  // 1. Authenticate
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);
      } else {
        setUserId(null); // User is logged out
        setUserEmail(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Stable helper to get collection ref
  const getTripsCollectionRef = useCallback(() => {
    if (!db || !userId) return null;
    return collection(db, 'artifacts', appId, 'users', userId, 'travel_trips');
  }, [userId, appId]);

  // 3. Fetch Trips
  useEffect(() => {
    // Only fetch if we are authenticated AND have a user
    if (!isAuthReady || !userId) {
      setTrips([]); // Clear trips if logged out
      setLoading(false);
      return;
    }

    const tripsColRef = getTripsCollectionRef();
    if (!tripsColRef) return;

    setLoading(true);
    const unsubscribeSnapshot = onSnapshot(tripsColRef, (snapshot) => {
      const fetchedTrips = [];
      snapshot.forEach((doc) => {
        fetchedTrips.push({ id: doc.id, ...doc.data() });
      });
      fetchedTrips.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setTrips(fetchedTrips);
      setLoading(false);
    }, (snapError) => {
      console.error("Firestore Snapshot Error:", snapError);
      setError("Failed to load trips.");
      setLoading(false);
    });
    return () => unsubscribeSnapshot();
  }, [isAuthReady, userId, getTripsCollectionRef]); // Re-run when auth state or user ID changes

  // 4. Add Trip (Stable)
  const handleAddTrip = useCallback(async (e) => {
    e.preventDefault();
    if (!newTripName.trim() || !getTripsCollectionRef()) return;
    setIsSaving(true);
    setError(null);
    try {
      await addDoc(getTripsCollectionRef(), {
        name: newTripName.trim(),
        createdAt: Date.now(),
        imageUrl: null, 
        experience: "", // <-- 2. ADDED experience field
      });
      setNewTripName('');
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsSaving(false);
    }
  }, [newTripName, getTripsCollectionRef]);

  // 5. Delete Trip (Stable)
  const handleDeleteTrip = useCallback(async (id) => {
    if (!db) return;
    setError(null);
    try {
      const tripDocRef = doc(getTripsCollectionRef(), id);
      await deleteDoc(tripDocRef);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }, [getTripsCollectionRef]);

  // 6. NEW: Update Trip Experience (Stable)
  const handleUpdateExperience = useCallback(async (tripId, newExperience) => {
    if (!getTripsCollectionRef) return;
    
    try {
      const tripDocRef = doc(getTripsCollectionRef(), tripId);
      await updateDoc(tripDocRef, {
        experience: newExperience
      });
    } catch (e) {
      console.error("Error updating experience: ", e);
      setError("Failed to save experience.");
    }
  }, [getTripsCollectionRef]);


  // 7. Navigation Callbacks (Stable)
  const onSelectTrip = useCallback((id) => {
    setSelectedTripId(id);
    setCurrentPage('TripDetails');
  }, []);

  const onBack = useCallback(() => {
    setCurrentPage('TripsList');
  }, []);

  // 8. Auth Callbacks (Stable)
  const onLogout = useCallback(async () => {
    try {
      await signOut(auth);
      // Auth state change will handle the rest
    } catch (e) {
      console.error("Logout Error:", e);
      setError("Failed to log out.");
    }
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      console.error("Google Sign-In Error:", e);
      setError("Failed to sign in with Google.");
    }
  }, []);

  const handleEmailLogin = useCallback(async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error("Email Sign-In Error:", e);
      setError("Failed to sign in. Check email or password.");
    }
  }, []);

  const handleEmailSignUp = useCallback(async (email, password) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error("Email Sign-Up Error:", e);
      setError("Failed to create account. " + e.message);
    }
  }, []);


  // --- Main Render Logic ---
  const renderContent = () => {
    if (!isAuthReady) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>;
    }

    if (!userId) {
        return <AuthPage 
          onGoogleSignIn={handleGoogleSignIn}
          onEmailLogin={handleEmailLogin}
          onEmailSignUp={handleEmailSignUp}
        />;
    }
    
    if (currentPage === 'TripsList') {
        return (
            <TripsListPage
                userEmail={userEmail}
                newTripName={newTripName}
                setNewTripName={setNewTripName}
                handleAddTrip={handleAddTrip}
                isSaving={isSaving}
                isAuthReady={isAuthReady}
                loading={loading}
                trips={trips}
                handleDeleteTrip={handleDeleteTrip}
                onSelectTrip={onSelectTrip}
                onLogout={onLogout}
            />
        );
    }

    if (currentPage === 'TripDetails' && selectedTripId) {
        const trip = trips.find(t => t.id === selectedTripId);
        if (trip) {
            return (
                <TripDetailsPage 
                    trip={trip} 
                    onBack={onBack}
                    db={db}
                    userId={userId}
                    getTripsCollectionRef={getTripsCollectionRef}
                    onUpdateExperience={handleUpdateExperience} // <-- 3. PASSING THE PROP
                />
            );
        }
    }
    
    // Default to list page
    return <div className="p-8 text-center text-red-500">Error: Page not found.</div>;
  };

  return (
    // This div applies the full-screen background image
    <div className="min-h-screen p-4 sm:p-8 font-sans flex justify-center bg-[url('/background.png')] bg-cover bg-center bg-fixed">
      <div className="w-full max-w-xl relative">
        <header className="relative w-full z-10">
            <button
                onClick={handleToggleDarkMode}
                className="absolute top-0 right-0 p-2 rounded-full border-2 border-orange-500 dark:border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition shadow-md"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
        </header>

        {error && <div className="p-3 mb-4 text-sm font-medium text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">{error}</div>}

        {renderContent()}
      </div>
    </div>
  );
};

export default App;

