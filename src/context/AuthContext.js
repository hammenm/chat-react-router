import { createContext } from "react";

export default createContext({
  user: null,
  token: null,
  setAuth: () => {},
  isAuthenticated: false,
  logout: () => {},
});
