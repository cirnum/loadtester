import { ApplicationActions } from "../store/types";

export const getDefaultErrorMessage = () => {
  return "Unexpected error. Please try again.";
};

export const getErrorMessage = (type: ApplicationActions["type"], err: any) => {
  const errData = err?.response?.data;
  let message = errData.message || getDefaultErrorMessage();
  switch (type) {
    default:
      if (!message) {
        message = getDefaultErrorMessage();
      }
      break;
  }
  return message;
};
