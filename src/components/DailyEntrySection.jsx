import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, BookOpen, DollarSign, Calendar, Tag } from 'lucide-react';
import { db } from '../lib/firebase';
import { CURRENCIES, EXPENSE_CATEGORIES } from '../constants';

const DailyEntrySection = ({ tripId, userId, getTripsCollectionRef }) => {
    const [dailyEntries, setDailyEntries] = useState([]);
    const [isEntrySaving, setIsEntrySaving] = useState(false);
    const [entryError, setEntryError] = useState(null);

    const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().substring(0, 10));
    const [newEntryNotes, setNewEntryNotes] = useState('');
    const [newEntryExpense, setNewEntryExpense] = useState('');
    const [newEntryCurrency, setNewEntryCurrency] = useState(CURRENCIES[0]);
    const [newEntryCategory, setNewEntryCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    const getDailyEntriesCollectionRef = useCallback(() => {
        if (!db || !userId) return null;
        const tripsColRef = getTripsCollectionRef();
        if (!tripsColRef) return null;
        return collection(tripsColRef, tripId, 'daily_entries');
    }, [db, userId, tripId, getTripsCollectionRef]);

    useEffect(() => {
        const entriesColRef = getDailyEntriesCollectionRef();
        if (!entriesColRef) return;

        const unsubscribe = onSnapshot(entriesColRef, (snapshot) => {
            const fetchedEntries = [];
            let total = 0;
            snapshot.forEach((doc) => {
                const data = doc.data();
                const expense = parseFloat(data.expense || 0);
                fetchedEntries.push({ id: doc.id, ...data, expense });
                total += expense;
            });
            fetchedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
            setDailyEntries(fetchedEntries);
            setTotalExpenses(total);
        }, (err) => {
            console.error("Subcollection Snapshot Error:", err);
            setEntryError("Failed to load daily entries.");
        });

        return () => unsubscribe();
    }, [getDailyEntriesCollectionRef]);

    const handleAddEntry = async (e) => {
        e.preventDefault();
        if (!newEntryDate || !newEntryNotes.trim() || !getDailyEntriesCollectionRef()) return;
        const expenseValue = parseFloat(newEntryExpense || 0);
        if (isNaN(expenseValue) || expenseValue < 0) {
            setEntryError("Invalid expense amount.");
            return;
        }
        setIsEntrySaving(true);
        setEntryError(null);
        try {
            await addDoc(getDailyEntriesCollectionRef(), {
                date: newEntryDate,
                notes: newEntryNotes.trim(),
                expense: expenseValue,
                currency: newEntryCurrency,
                category: newEntryCategory,
                createdAt: Date.now(),
            });
            setNewEntryDate(new Date().toISOString().substring(0, 10));
            setNewEntryNotes('');
            setNewEntryExpense('');
            setNewEntryCurrency(CURRENCIES[0]);
            setNewEntryCategory(EXPENSE_CATEGORIES[0]);
        } catch (e) {
            console.error("Error adding daily entry: ", e);
            setEntryError("Could not save daily entry.");
        } finally {
            setIsEntrySaving(false);
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (!db) return;
        setEntryError(null);
        try {
            const entriesColRef = getDailyEntriesCollectionRef();
            const entryDocRef = doc(entriesColRef, entryId);
            await deleteDoc(entryDocRef);
        } catch (e) {
            console.error("Error deleting daily entry: ", e);
            setEntryError("Could not delete entry.");
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-blue-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                Daily Log & Budget
            </h3>
            <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center"><DollarSign className="w-4 h-4 mr-1" />TOTAL TRIP EXPENSES:</span>
                <span className="text-xl font-extrabold text-blue-800 dark:text-blue-200">{totalExpenses.toFixed(2)}</span>
            </div>
            {entryError && <div className="p-2 mb-4 text-xs font-medium text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">{entryError}</div>}
            
            <form onSubmit={handleAddEntry} className="space-y-3 p-4 border border-gray-300 dark:border-gray-700 rounded-xl mb-6 bg-gray-50 dark:bg-gray-700">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">New Entry</h4>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label htmlFor={`date-${tripId}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input id={`date-${tripId}`} type="date" value={newEntryDate} onChange={(e) => setNewEntryDate(e.target.value)} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-gray-200" />
                    </div>
                    <div>
                        <label htmlFor={`expense-${tripId}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">Expense</label>
                        <input id={`expense-${tripId}`} type="number" step="0.01" min="0" value={newEntryExpense} onChange={(e) => setNewEntryExpense(e.target.value)} placeholder="0.00" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-gray-200" />
                    </div>
                    <div>
                        <label htmlFor={`currency-${tripId}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">Currency</label>
                        <select id={`currency-${tripId}`} value={newEntryCurrency} onChange={(e) => setNewEntryCurrency(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-gray-200">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor={`category-${tripId}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select id={`category-${tripId}`} value={newEntryCategory} onChange={(e) => setNewEntryCategory(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-gray-200">
                            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor={`notes-${tripId}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">Journal Notes</label>
                    <textarea id={`notes-${tripId}`} rows="3" value={newEntryNotes} onChange={(e) => setNewEntryNotes(e.target.value)} placeholder="What did you do today?" required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-gray-200"></textarea>
                </div>
                <button type="submit" className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center" disabled={isEntrySaving || !newEntryNotes.trim()}>
                    {isEntrySaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5 mr-1" />}
                    Save Daily Entry
                </button>
            </form>

            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 mt-6">Log History</h4>
            <div className="space-y-3">
                {dailyEntries.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center p-4 border rounded-xl dark:border-gray-700">No daily entries for this trip yet.</p>
                ) : (
                    dailyEntries.map(entry => (
                        <div key={entry.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center flex-wrap gap-x-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                                    <div className="flex items-center"><Calendar className="w-4 h-4 text-orange-500 mr-1" /><span>{entry.date}</span></div>
                                    <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 rounded-full px-2 py-0.5 font-medium"><Tag className="w-3 h-3 mr-1" />{entry.category || 'Uncategorized'}</div>
                                    <span className="ml-2 text-lg text-gray-800 dark:text-gray-100">{entry.expense.toFixed(2)} {entry.currency}</span>
                                </div>
                                <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full transition hover:bg-red-50 dark:hover:bg-gray-700" aria-label="Delete daily entry">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">{entry.notes}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DailyEntrySection;

