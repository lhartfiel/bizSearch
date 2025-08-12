import { createContext } from "react";
import { Dispatch } from "react";

export const ModalContext = createContext<boolean>(false);
export const ModalDispatchContext = createContext<Dispatch<any> | null>(null);
