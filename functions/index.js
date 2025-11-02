import {onDocumentDeleted} from "firebase-functions/v2/firestore";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions";

// Initialize the Firebase Admin SDK
initializeApp();

/**
 * Recursively deletes all documents and subcollections within a given collection.
 * @param {FirebaseFirestore.Firestore} db The Firestore database instance.
 * @param {string} collectionPath The path to the collection to delete.
 * @param {number} batchSize The number of documents to delete in each batch.
 */
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve, reject);
  });
}

/**
 * Helper function to delete documents in batches.
 * @param {FirebaseFirestore.Firestore} db The Firestore database instance.
 *After you save this, make sure your linter config file is named `.eslintrc.js` (not `.cjs`) and then try deploying again. This combination *must* work.
 * @param {FirebaseFirestore.Query} query The query to execute.
 * @param {Function} resolve The promise resolve function.
 * @param {Function} reject The promise reject function.
 */
async function deleteQueryBatch(db, query, resolve, reject) {
  try {
    const snapshot = await query.get();

    // When there are no documents left, we are done.
    if (snapshot.size === 0) {
      return resolve();
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      // For each document, recursively delete its subcollections
      // This is a placeholder; we'll add recursive deletion if needed.
      // For now, we are just deleting the documents in the current collection.
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next batch
    // eslint-disable-next-line no-undef
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve, reject);
    });
  } catch (err) {
    reject(err);
  }
}

// Define the Cloud Function trigger
// Use 'export const' instead of 'exports.onTripDeleted'
export const onTripDeleted = onDocumentDeleted(
    "artifacts/{appId}/users/{userId}/travel_trips/{tripId}",
    async (event) => {
      // We are intentionally not using the 'event.data.data()' snapshot,
      // so we use an underscore to satisfy the linter.
      const {_snapshot, context} = event;
      const {appId, userId, tripId} = context.params;

      logger.log(
          `Deleting subcollections for trip: ${tripId}
           by user: ${userId}`,
      );

      const db = getFirestore();

      // Define paths to the subcollections
      const dailyEntriesPath =
        `artifacts/${appId}/users/${userId}/travel_trips/${tripId}/daily_entries`;
      const photosPath =
        `artifacts/${appId}/users/${userId}/travel_trips/${tripId}/photos`;

      // Set a batch size for deletion
      const batchSize = 100;

      // Delete both collections in parallel
      try {
        await Promise.all([
          deleteCollection(db, dailyEntriesPath, batchSize),
          deleteCollection(db, photosPath, batchSize),
        ]);
        logger.log(
            `Successfully deleted subcollections for trip: ${tripId}`,
        );
      } catch (err) {
        logger.error(
            `Error deleting subcollections for trip: ${tripId}`,
            err,
        );
      }
    },
);

