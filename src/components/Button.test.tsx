import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button, ButtonType } from "./Button";

const defaultProps: ButtonType = {
  buttonSize: "md",
  buttonText: "Click Me!",
  buttonType: "primary",
  customClasses: "",
  disabled: false,
  type: "reset",
  callback: vi.fn(),
};

const renderButton = (props: Partial<ButtonType> = {}) => {
  const callback = vi.fn();
  render(<Button {...defaultProps} {...props} callback={callback} />);
  const button = screen.getByRole("button");
  return { button, callback };
};

describe("Button component", () => {
  it("has a gradient background when the button type is primary", () => {
    const { button } = renderButton();
    expect(button).toHaveClass("bg-[image:var(--bg-button)]");
    expect(button).not.toHaveClass("bg-white");
  });

  it("has a white background when the button type is secondary", () => {
    const { button } = renderButton({ buttonType: "secondary" });
    expect(button).toHaveClass("bg-white");
    expect(button).not.toHaveClass("bg-[image:var(--bg-button)]");
  });

  it("has a class of py-2 when the button size is md", () => {
    const { button } = renderButton({ buttonType: "secondary" });
    expect(button).toHaveClass("py-2");
  });

  it("has a class of py-4 when the button size is lg", () => {
    const { button } = renderButton({ buttonSize: "lg" });
    expect(button).toHaveClass("py-4");
  });

  it("does not have the disabled attribute when the prop is false", () => {
    const { button } = renderButton();
    expect(button).not.toHaveAttribute("disabled");
  });

  it("displays the disabled attribute when the prop is true", () => {
    const { button } = renderButton({ disabled: true });
    expect(button).toHaveAttribute("disabled");
  });

  it("renders the appropriate buttonText within the button", () => {
    const { button } = renderButton();
    expect(button).toHaveTextContent("Click Me!");
  });

  it("renders the type attribute", () => {
    const { button } = renderButton({ disabled: true });
    expect(button).toHaveAttribute("type", "reset");
  });

  it("renders customClasses passed in as props", () => {
    const { button } = renderButton({ customClasses: "text-[60px]" });
    expect(button).toHaveClass("text-[60px]");
  });

  it("does not initiate a click even when the button is disabled", async () => {
    const { button, callback } = renderButton({ disabled: true });
    fireEvent.click(button);
    expect(callback).not.toHaveBeenCalled();
  });

  it("initiates a click when the button is clicked", () => {
    const { button, callback } = renderButton();
    fireEvent.click(button);
    expect(callback).toHaveBeenCalled();
  });
});
