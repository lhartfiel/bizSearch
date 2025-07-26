import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext, ThemeDispatchContext } from "../ThemeContext";

const moonIcon = <FontAwesomeIcon icon={faMoon} />;
const sunIcon = <FontAwesomeIcon icon={faSun} />;

const ThemeSwitch = () => {
  const theme = useContext(ThemeContext);
  const dispatch = useContext(ThemeDispatchContext);
  return (
    <div className="flex justify-end w-full mb-4">
      <button
        className="bg-white dark:bg-slate-300 rounded-full w-9 h-9 border-1 border-slate-800"
        onClick={dispatch ? () => dispatch(theme) : undefined}
      >
        {theme === "light" ? sunIcon : moonIcon}
      </button>
    </div>
  );
};

export { ThemeSwitch };
