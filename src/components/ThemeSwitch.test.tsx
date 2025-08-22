import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ThemeSwitch } from "./ThemeSwitch";
import { ThemeContext, ThemeDispatchContext } from "../contexts/ThemeContext";
import { ModalContext, ModalDispatchContext } from "../contexts/ModalContext";

const renderThemeSwitch = (theme = "light") => {
  const themeDispatch = vi.fn();
  const modalDispatch = vi.fn();
  const value = theme;
  render(
    <ThemeContext.Provider value={value}>
      <ThemeDispatchContext.Provider value={themeDispatch}>
        <ModalContext.Provider value={false}>
          <ModalDispatchContext.Provider value={modalDispatch}>
            <ThemeSwitch />
          </ModalDispatchContext.Provider>
        </ModalContext.Provider>
      </ThemeDispatchContext.Provider>
    </ThemeContext.Provider>,
  );

  return { themeDispatch, modalDispatch };
};

describe("ThemeSwitch component", () => {
  it("should render the infoIcon", () => {
    renderThemeSwitch();
    const infoIcon = screen.getByRole("button", {
      name: "Info about Scout it Out",
    });
    expect(infoIcon).toBeInTheDocument();
    expect(infoIcon).toHaveClass("dark:bg-slate-300");
  });

  it("should call the modalDispatch function when the info icon is activated", async () => {
    const user = userEvent.setup();
    const { modalDispatch } = renderThemeSwitch();
    const infoIcon = screen.getByRole("button", {
      name: "Info about Scout it Out",
    });
    // Click Event
    fireEvent.click(infoIcon);
    expect(modalDispatch).toHaveBeenCalled();
    expect(modalDispatch).toHaveBeenCalledWith(false);

    // Keyboard (Enter)
    infoIcon.focus();
    await user.keyboard("{Enter}");
    expect(modalDispatch).toHaveBeenCalled();
    expect(modalDispatch).toHaveBeenCalledWith(false);
  });

  it("should render the sun icon when the theme is light", () => {
    renderThemeSwitch();
    const sunIcon = screen.getByRole("button", {
      name: "Switch to dark mode",
    });
    const moonIcon = screen.queryByRole("button", {
      name: "Switch to light mode",
    });
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).not.toBeInTheDocument();
    expect(sunIcon).toHaveClass("dark:bg-slate-300");
  });

  it("should render the moon icon when the theme is dark", () => {
    renderThemeSwitch("dark");
    const sunIcon = screen.queryByRole("button", {
      name: "Switch to dark mode",
    });
    const moonIcon = screen.getByRole("button", {
      name: "Switch to light mode",
    });
    expect(sunIcon).not.toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
    expect(moonIcon).toHaveClass("dark:bg-slate-300");
  });

  it("should call the themeDispatch function when the theme icon is activated", async () => {
    const { themeDispatch } = renderThemeSwitch();
    const sunIcon = screen.getByRole("button", {
      name: "Switch to dark mode",
    });

    // Click Event
    fireEvent.click(sunIcon);
    expect(themeDispatch).toHaveBeenCalled();
    expect(themeDispatch).toHaveBeenCalledWith("light");

    // Keyboard (Enter)
    const user = userEvent.setup();

    sunIcon.focus();
    await user.keyboard("{Enter}");
    expect(themeDispatch).toHaveBeenCalled();
    expect(themeDispatch).toHaveBeenCalledWith("light");
  });

  it("does not crash if dispatch functions are missing", () => {
    render(
      <ThemeContext.Provider value="light">
        <ThemeSwitch />
      </ThemeContext.Provider>,
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });
});
