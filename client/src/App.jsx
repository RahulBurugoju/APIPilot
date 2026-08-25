import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import healthService from "./services/health.service";
import AuthInitializer from "./components/auth/AuthInitializer";

function App() {
  // const [status, setStatus] = useState("checking the status...");

  // useEffect(() => {
  //   const checkApi = async () => {
  //     try {
  //       const data = await healthService.check();
  //       setStatus(data.message);
  //     } catch (error) {
  //       console.error("API health check failed:", error);
  //       setStatus("API unavailable");
  //     }
  //   };
  //   checkApi();
  // }, []);

  return (
    <>
      <AuthInitializer>
        <AppRouter />
      </AuthInitializer>
    </>
  );
}

export default App;
