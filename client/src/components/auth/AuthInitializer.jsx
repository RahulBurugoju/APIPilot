import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "../../features/auth/auth.thunk";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const { initialized } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading APIPilot...
      </div>
    );
  }

  return children
}

export default AuthInitializer;
