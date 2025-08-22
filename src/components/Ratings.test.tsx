import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Ratings } from "./Ratings";

describe("Ratings component", () => {
  it("should display 5 star outline icons", () => {
    render(<Ratings rating={5} />);
    const starOutlines = screen.getAllByTestId("star-outline");
    expect(starOutlines).toHaveLength(5);

    starOutlines.forEach((star) => {
      const starOutlineIcon = star?.querySelector("svg");
      expect(starOutlineIcon).toBeInTheDocument();
    });
  });

  it("should return 5 filled stars icons", () => {
    render(<Ratings rating={4} />);
    const filledStar = screen.getAllByTestId("star-filled");
    expect(filledStar).toHaveLength(5);
  });

  it("should display width 100% when rating is 5", () => {
    render(<Ratings rating={5} />);
    const filledStars = screen.getByTestId("star-filled-wrapper");
    expect(filledStars).toHaveStyle("width: 100%");
  });

  it("should display width 80% when rating is 4", () => {
    render(<Ratings rating={4} />);
    const filledStars = screen.getByTestId("star-filled-wrapper");
    expect(filledStars).toHaveStyle("width: 80%");
  });

  it("should display width 64% when rating is 3.2", () => {
    render(<Ratings rating={3.2} />);
    const filledStars = screen.getByTestId("star-filled-wrapper");
    expect(filledStars).toHaveStyle("width: 64%");
  });

  it("should return width 0% when rating is 0", () => {
    render(<Ratings rating={0} />);
    const filledStars = screen.getByTestId("star-filled-wrapper");
    expect(filledStars).toHaveStyle("width: 0%");
  });

  it("should return null when rating is -5", () => {
    render(<Ratings rating={-5} />);
    const filledStars = screen.queryByTestId("star-filled-wrapper");
    expect(filledStars).toBeNull();
  });

  it("should return null when rating is a string", () => {
    render(<Ratings rating={"None"} />);
    const filledStars = screen.queryByTestId("star-filled-wrapper");
    expect(filledStars).toBeNull();
  });
});
