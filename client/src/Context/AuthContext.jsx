import { createContext, useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import loader from "../assets/loader.gif"
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(Cookies.get("token") ? jwt_decode(Cookies.get("token")) : false);
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [FPOS, setFPOS] = useState([]);



  if (loading) return <img src={loader} className="loader" />;

  return (
    <AuthContext.Provider value={{ user, setUser, toggle, setToggle, FPOS, setFPOS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}