import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faInfo } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext, ThemeDispatchContext } from "../contexts/ThemeContext";
import { ModalContext, ModalDispatchContext } from "../contexts/ModalContext";

const infoIcon = <FontAwesomeIcon icon={faInfo} />;
const moonIcon = <FontAwesomeIcon icon={faMoon} />;
const sunIcon = <FontAwesomeIcon icon={faSun} />;

const ThemeSwitch = () => {
  const theme = useContext(ThemeContext);
  const modal = useContext(ModalContext);
  const themeDispatch = useContext(ThemeDispatchContext);
  const modalDispatch = useContext(ModalDispatchContext);
  return (
    <div className="flex justify-end w-full mb-4">
      <button
        aria-label="Info about Scout it Out"
        className="cursor-pointer bg-white dark:bg-slate-300 rounded-full w-9 h-9 border-1 border-slate-800 mr-4"
        onClick={modalDispatch ? () => modalDispatch(modal) : undefined}
      >
        {infoIcon}
      </button>
      <button
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        className="cursor-pointer bg-white dark:bg-slate-300 rounded-full w-9 h-9 border-1 border-slate-800"
        onClick={themeDispatch ? () => themeDispatch(theme) : undefined}
      >
        {theme === "light" ? sunIcon : moonIcon}
      </button>
    </div>
  );
};

export { ThemeSwitch };
