import React from 'react';
import MTGApiShowcase from './components/MTGApiShowcase';
import { AuthProvider } from './contexts/AuthContext';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Navbar from "./components/Navibar.jsx";

function App() {
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    return (
        <AuthProvider>
            <div className="App">
                <Navbar />
                <div className="pt-16">
                    <MTGApiShowcase />
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;