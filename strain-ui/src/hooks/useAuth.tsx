import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { useLogin } from "../utils/mutation/login";
import { useToaster } from "../utils/toast";
import { TLoginPayLoad, IContext, IAuthProvider } from "../types/index";

const AuthContext = createContext<IContext>({
  user: "",
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children, userData }: IAuthProvider) => {
  const [user, setUser] = useLocalStorage("token", userData);
  const toast = useToaster()
  const navigate = useNavigate();
  let loginMutation = useLogin();

  const login = async (payload: TLoginPayLoad) => {
    loginMutation.mutate(payload, {
      onSuccess(data) {
        const { message = "Login successful" } = data;

        toast.success({
          title: message,
        });
        setUser(data?.data);
        navigate("/dashboard", { replace: true });
      },
      onError(error: any) {
        const { message } = error?.response.data;
        toast.error({
          title: message,
        });
      },
    });
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
};

export const useAuth = () => {
  return useContext(AuthContext);
};
