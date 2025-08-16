import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InfoBox } from "./InfoBox";
import { InfoboxType } from "./InfoBox";

const defaultProps: InfoboxType = {
  isTouch: false,
  rating: "3.5",
  ratingCount: 100,
  showHover: false,
};

describe("InfoBox component", () => {
  it("should include a button", () => {
    render(<InfoBox {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("info-box");
  });

  it("should show the popup text when showPopup is true", () => {
    render(<InfoBox {...defaultProps} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const infoContent = screen.getByTestId("info-content");
    expect(infoContent).toHaveClass("popup");
  });

  it("should not show the popup text when showPopup is false", () => {
    render(<InfoBox {...defaultProps} />);

    const infoContent = screen.queryByTestId("info-content");
    expect(infoContent).not.toBeInTheDocument();
  });

  it("should display the rating number and total rating count", () => {
    render(<InfoBox {...defaultProps} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const infoContent = screen.getByTestId("info-content");
    const paragraph = infoContent.querySelector("p");
    expect(paragraph).toHaveTextContent(
      "Rated 3.5 out of 5 based on a total of 100 ratings.",
    );
  });

  it("should not display the popup on mouseenter or mouseleave when isTouch is true", () => {
    render(<InfoBox {...defaultProps} isTouch={true} />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    expect(screen.queryByTestId("info-content")).not.toBeInTheDocument();

    fireEvent.mouseLeave(button);
    expect(screen.queryByTestId("info-content")).not.toBeInTheDocument();
  });

  it("should display the popup on mouseenter but not on mouseleave when isTouch is false", () => {
    render(<InfoBox {...defaultProps} />);
    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    const infoContent = screen.queryByTestId("info-content");
    expect(infoContent).toBeInTheDocument();

    fireEvent.mouseLeave(button);
    expect(infoContent).not.toBeInTheDocument();
  });

  it("should apply 'text-white' class when popup is shown, not touch, and showHover is true", () => {
    render(<InfoBox {...defaultProps} showHover={true} />);
    const button = screen.getByRole("button");
    const icon =
      button.querySelector("svg") || screen.getByRole("button").firstChild;

    expect(icon).toHaveClass("text-dark-blue");

    fireEvent.click(button);

    expect(icon).toHaveClass("text-white");
  });
});
