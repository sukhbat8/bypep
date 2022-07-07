import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routes";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
