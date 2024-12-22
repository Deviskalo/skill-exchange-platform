import admin from "firebase-admin";

const serviceAccountConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

console.log("Firebase Admin Config:", {
  projectId: !!serviceAccountConfig.projectId,
  clientEmail: !!serviceAccountConfig.clientEmail,
  privateKey: serviceAccountConfig.privateKey ? "PRESENT" : "MISSING",
});

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountConfig),
    });
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

export default admin;
