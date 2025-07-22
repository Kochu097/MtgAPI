import React from 'react';
import MTGApiShowcase from './components/MTGApiShowcase';
import AuthModule from './components/AuthModule';
import { AuthProvider } from './contexts/AuthContext';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Navbar from "./components/Navibar.jsx";

function App() {
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: "mtgapi-9f486.firebaseapp.com",
        projectId: "mtgapi-9f486",
        storageBucket: "mtgapi-9f486.firebasestorage.app",
        messagingSenderId: "644685582424",
        appId: "1:644685582424:web:a028b2433391fef6903a2d",
        measurementId: "G-DE7MQ0NDWC"
    };
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    console.log(app);
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
