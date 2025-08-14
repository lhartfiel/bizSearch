import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";

describe("Footer component", () => {
  beforeEach(() => {
    render(<Footer />);
  });
  it("should display the footer tag", () => {
    const footerTag = screen.getByTestId("footer-el");
    expect(footerTag).toBeInTheDocument();
  });

  it("should display the current year", () => {
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
