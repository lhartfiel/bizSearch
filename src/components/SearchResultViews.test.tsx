import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { SearchResultViews } from "./SearchResultViews";

const renderSearchResultView = (view = "card") => {
  const mockHandleViewChange = vi.fn();
  render(
    <SearchResultViews view={view} handleViewChange={mockHandleViewChange} />,
  );
  return { mockHandleViewChange };
};

describe("SearchResultViews component", () => {
  it("should show 2 views", () => {
    renderSearchResultView();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("should show the card view as active when the view prop is the card type", () => {
    renderSearchResultView();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      const icon = btn.querySelector("span");
      if (btn.getAttribute("aria-label") === "card view") {
        expect(btn).toHaveClass("bg-bright-salmon");
        expect(icon).toHaveClass("text-white");
      } else {
        expect(btn).toHaveClass("bg-salmon/20");
        expect(icon).not.toHaveClass("text-white");
        expect(icon).toHaveClass("text-bright-salmon");
      }
    });
  });

  it("should show the table view as active when the view prop is the table type", () => {
    renderSearchResultView("table");
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      const icon = btn.querySelector("span");
      if (btn.getAttribute("aria-label") === "table view") {
        expect(btn).toHaveClass("bg-bright-salmon");
        expect(icon).toHaveClass("text-white");
      } else {
        expect(btn).toHaveClass("bg-salmon/20");
        expect(icon).not.toHaveClass("text-white");
        expect(icon).toHaveClass("text-bright-salmon");
      }
    });
  });

  it("should handle the button click with the card type", () => {
    const { mockHandleViewChange } = renderSearchResultView();
    const button = screen.getByRole("button", { name: "card view" });
    fireEvent.click(button);
    expect(mockHandleViewChange).toHaveBeenCalled();
    expect(mockHandleViewChange).toHaveBeenCalledWith("card");
  });

  it("should handle the button click with the table type", () => {
    const { mockHandleViewChange } = renderSearchResultView("table");
    const button = screen.getByRole("button", { name: "table view" });
    fireEvent.click(button);
    expect(mockHandleViewChange).toHaveBeenCalled();
    expect(mockHandleViewChange).toHaveBeenCalledWith("table");
  });

  it("should display the correct accessiblity attributes on the button", () => {
    renderSearchResultView();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute(
        "aria-label",
        expect.stringContaining("view"),
      );
    });
  });

  it("should allow keyboard interaction", async () => {
    const user = userEvent.setup();
    const { mockHandleViewChange } = renderSearchResultView();
    const cardButton = screen.getByRole("button", { name: "card view" });

    cardButton.focus();
    await user.keyboard("{Enter}");

    expect(mockHandleViewChange).toHaveBeenCalledWith("card");
  });

  it("renders icons inside each button", () => {
    renderSearchResultView();
    expect(screen.getByRole("button", { name: "card view" })).toContainHTML(
      "span",
    );
    expect(screen.getByRole("button", { name: "table view" })).toContainHTML(
      "span",
    );
  });
});
