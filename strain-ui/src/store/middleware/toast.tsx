import { Dispatch } from "react";
import toast, { Renderable, ToastPosition } from "react-hot-toast";
import { Middleware } from "redux";
import { CheckIcon, SmallCloseIcon, WarningIcon } from "@chakra-ui/icons";
import { ApplicationActions } from "../types";
import { toastActions } from "../_shared/toastHelper";

export type ToastConfig = {
  type: "info" | "error" | "success" | "info-warning";
  message: string;
  timeout?: number;
};

const getIcon = (type: ToastConfig["type"]): Renderable | undefined => {
  switch (type) {
    case "info":
      return "";
    case "error":
      return <SmallCloseIcon />;
    case "success":
      return <CheckIcon />;
    case "info-warning":
      return <WarningIcon />;
    default:
      return undefined;
  }
};

const getClassName = (type: ToastConfig["type"]) => {
  switch (type) {
    case "error":
      return "error-toast";
    case "success":
      return "success-toast";
    case "info":
    case "info-warning":
      return "info-toast";
    default:
      return "";
  }
};

const getToastFn = (type: ToastConfig["type"]) => {
  switch (type) {
    case "error":
      return toast.error;
    case "success":
      return toast.success;
    default:
      return toast.success;
  }
};

export const toastMiddleware: Middleware =
  () =>
  (next: Dispatch<ApplicationActions>) =>
  (action: ApplicationActions) => {
    next(action);

    const getConfig = toastActions[action.type];

    if (!getConfig) {
      return;
    }

    const {
      message = "Somthing went wrong",
      type,
      timeout,
    } = getConfig(action as any);

    if (!message) {
      return;
    }

    const toastOpts = {
      position: "top-center" as ToastPosition,
      duration: timeout || 2000,
      className: getClassName(type),
      icon: getIcon(type),
    };
    const toastFn = getToastFn(type);

    const id = toastFn(message, toastOpts);

    // on mobile sometimes, toast is not auto dismissed, so this workaround
    window.setTimeout(() => {
      toast.dismiss(id);
    }, toastOpts.duration);
  };
