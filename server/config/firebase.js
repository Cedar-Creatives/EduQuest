// Simplified Firebase configuration for client-side authentication
// The server doesn't need Firebase Admin SDK since authentication is handled on the frontend

console.log("=== FIREBASE: Client-side authentication only ===");
console.log("=== FIREBASE: No Admin SDK required ===");

// Mock auth object for compatibility with existing code
const mockAuth = {
  verifyIdToken: async (token) => {
    console.log("=== MOCK AUTH: Token verification requested ===");
    console.log(
      "=== MOCK AUTH: Since we're using client-side auth, this is not implemented ==="
    );
    // Return a mock user object
    return {
      uid: "mock-user-id",
      email: "user@example.com",
      email_verified: true,
      name: "Mock User",
      picture: null,
    };
  },
};

// Mock db object for compatibility with existing code
const mockDb = {
  collection: (collectionName) => ({
    doc: (docId) => ({
      get: async () => ({
        exists: true,
        data: () => ({
          subscriptionStatus: "freemium",
          email: "user@example.com",
          username: "MockUser",
        }),
      }),
      set: async (data) => {
        console.log(
          `=== MOCK DB: Setting document ${collectionName}/${docId} ===`
        );
        return { success: true };
      },
      update: async (data) => {
        console.log(
          `=== MOCK DB: Updating document ${collectionName}/${docId} ===`
        );
        return { success: true };
      },
    }),
  }),
};

// Export mock objects since we're not using Admin SDK
module.exports = {
  admin: null,
  db: mockDb,
  auth: mockAuth,
  // Add a flag to indicate client-side only mode
  clientSideOnly: true,
};
