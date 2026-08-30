import React from "react";
import "./App.css";
import AppRouter from "./routes/AppRouter.jsx";
import AuthInitializer from "./components/auth/AuthInitializer.jsx";

function App() {
  return (
    <AuthInitializer>
      <AppRouter />
    </AuthInitializer>
  );
}

export default App;
