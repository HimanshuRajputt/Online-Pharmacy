/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize state based on whether token exists in localStorage
  const [userlogin, setUserLogin] = useState(
    !!localStorage.getItem("authToken")
  );

  // Function to handle user logout
  const handleUserLogOut = () => {
    // Remove token from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    // Update state to reflect logged out status
    setUserLogin(false);
  };

  // Function to handle user login
  const handleUserLogin = () => {
    // Update state to reflect logged in status
    setUserLogin(true);
  };

  // Listen for changes to localStorage (in case token is modified elsewhere)
  useEffect(() => {
    const checkAuthToken = () => {
      const hasToken = !!localStorage.getItem("authToken");
      setUserLogin(hasToken);
    };

    // Check on mount
    checkAuthToken();

    // Add event listener for storage changes (helps with multiple tabs)
    window.addEventListener("storage", checkAuthToken);

    return () => {
      window.removeEventListener("storage", checkAuthToken);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ userlogin, handleUserLogin, handleUserLogOut }}
    >
      {children}
    </UserContext.Provider>
  );
};
