import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { IContext, IAuthProvider } from "../types/index";

const AuthContext = createContext<IContext>({
  user: "",
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useLocalStorage<string>("token", "");
  const navigate = useNavigate();

  const login = async (payload: string) => {
    setUser(payload);
  };

  const logout = () => {
    setUser("");
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
