import { createContext } from "react";
import { Dispatch } from "react";

export const ThemeContext = createContext<string | null>("light");
export const ThemeDispatchContext = createContext<Dispatch<any> | null>(null);
