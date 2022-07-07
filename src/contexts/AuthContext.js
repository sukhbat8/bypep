import React, { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BarongApiService from "../services/BarongApiService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    auth: false,
    loading: true,
    me: null,
  });

  const navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/users/usersdirectory";

  useEffect(() => {
    BarongApiService.getUserInfo().then((data) => {
      setAuthData({
        auth: true,
        loading: false,
        me: data,
      });
    });
  }, []);

  const login = (values) => {
    setAuthData({
      ...authData,
      loading: true,
    });

    BarongApiService.login(values)
      .then((res) => {
        setAuthData({
          auth: true,
          loading: false,
          me: null,
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setAuthData({
          auth: false,
          loading: false,
          me: null,
        });
      });
  };

  const logout = () => {
    BarongApiService.logout().then((res) => {
      if (res.data === 200) {
        navigate("/login");
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        authData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
