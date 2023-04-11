export type TLoginPayLoad = {
  email: string;
  password: string;
};

export type TLoginResponsePayLoad = {
  data: string;
  message: string;
  status: number;
};

export interface IContext {
  user: string;
  login: (payload: string) => void;
  logout: () => void;
}

export type TRegisterPayload = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
};
