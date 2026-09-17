import { createContext, useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const UserContext = createContext();

export function UserProvider({ children }) {
  const isInit = useRef(false);

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [isLogInError, setIsLoginError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isInit.current) return;

    isInit.current = true;
    me();
  }, []);

  const me = async () => {
    try {
      const result = await fetch(`${API_URL}/api/me`, {
        credentials: "include",
      });

      if (result.ok) {
        const data = await result.json();

        console.log("==>user data: ", data);

        setUser(data.user || data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("==> /api/me error:", error);
      setIsLoggedIn(false);
    }

    setIsInitializing(false);
  };

  const login = async (email, password) => {
    const body = {
      email: email,
      password: password,
    };

    console.log("==>Login body: ", body);

    try {
      const result = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (result.ok) {
        const data = await result.json();

        setUser(data.user || data);
        setIsLoggedIn(true);
        setIsLoginError(false);

        return true;
      } else {
        const errData = await result.json();

        console.log("==>Login failed: ", errData.message);

        setIsLoggedIn(false);
        setIsLoginError(true);
        setLoginErrorMsg(errData.message);

        return false;
      }
    } catch (error) {
      console.log("==>Login error:", error);

      setIsLoggedIn(false);
      setIsLoginError(true);
      setLoginErrorMsg("Unable to connect to server");

      return false;
    }
  };

  const logout = async () => {
    try {
      const result = await fetch(`${API_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (result.ok) {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("==>Logout error:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        isLogInError,
        loginErrorMsg,
        isInitializing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
