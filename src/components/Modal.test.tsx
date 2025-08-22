import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

vi.mock("focus-trap-react", () => {
  return {
    FocusTrap: ({ children }: { children: React.ReactNode }) => {
      return <div>{children}</div>;
    },
  };
});

import { Modal } from "./Modal";
import { ModalContext, ModalDispatchContext } from "../contexts/ModalContext";

const renderModal = (showModal: boolean) => {
  const dispatch = vi.fn();
  render(
    <ModalContext.Provider value={showModal}>
      <ModalDispatchContext.Provider value={dispatch}>
        <Modal showModal={showModal} />
      </ModalDispatchContext.Provider>
    </ModalContext.Provider>,
  );
  return { dispatch };
};

describe("Modal component", () => {
  it("should have opacity-100 class when showModal is true", () => {
    renderModal(true);
    const modal = screen.getByTestId("modal-wrapper");
    expect(modal).toHaveClass("opacity-100");
  });

  it("should have opacity-0 class when showModal is false", () => {
    renderModal(false);
    const modal = screen.getByTestId("modal-wrapper");
    expect(modal).toHaveClass("opacity-0");
    expect(modal).toBeInTheDocument();
  });
  it("should have opacity-100 class on dialog-id when showModal is true", () => {
    renderModal(true);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("opacity-100");
  });
  it("should have opacity-95 class on dialog-id when showModal is false", () => {
    renderModal(false);
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveClass("opacity-100");
    expect(dialog).toHaveClass("opacity-95");
  });
  it("should have role dialog and aria-modal attributes", () => {
    renderModal(true);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
  it("should include the correct h1 header and text", () => {
    renderModal(true);
    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toHaveTextContent('What is "Scout it out?"');
  });
  it("should include the correct p tag and text", () => {
    renderModal(true);
    const paragraphs = screen.getByRole("dialog").querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent(/business search application/);
    expect(paragraphs[1]).toHaveTextContent(/click on the web links/);
  });
  it("should trigger a click event when the close button is clicked", () => {
    const { dispatch } = renderModal(true);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(true);
  });

  it("should close the modal when the Escape key is pressed", () => {
    const { dispatch } = renderModal(true);
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(true);
  });

  it("should wrap modal content inside FocusTrap", () => {
    renderModal(true);
    const trapWrapper = screen
      .getByTestId("modal-wrapper")
      .querySelector("div");
    expect(trapWrapper).not.toBeNull();
  });
});
